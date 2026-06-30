import { NextRequest, NextResponse } from 'next/server';
import { Recipe } from '@/types/recipe';

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_MODEL = 'llama-3.1-8b-instant';
const TAVILY_API_KEY = process.env.TAVILY_API_KEY || '';

async function groqGenerate(prompt: string): Promise<string> {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2048,
    }),
  });

  if (!res.ok) throw new Error(`Groq responded with ${res.status}`);

  const data = await res.json();
  return (data.choices[0].message.content as string).trim();
}

async function refineQuery(userQuery: string): Promise<string> {
  const prompt =
    `You are a recipe search assistant. Convert this natural language query into a concise web search query for finding recipes. ` +
    `Query: "${userQuery}". Return only the search string, nothing else.`;
  return groqGenerate(prompt);
}

type SearchResult = { title: string; description: string; url: string };

async function searchTavily(query: string): Promise<SearchResult[]> {
  const res = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: TAVILY_API_KEY,
      query: query + ' recipe',
      search_depth: 'basic',
      max_results: 8,
    }),
  });

  if (!res.ok) throw new Error(`Tavily Search returned ${res.status}`);

  const data = await res.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data.results ?? []).map((r: any) => ({
    title: r.title ?? '',
    description: r.content ?? '',
    url: r.url ?? '',
  }));
}

async function extractRecipes(results: SearchResult[]): Promise<Recipe[]> {
  const resultsText = results
    .map((r, i) => `${i + 1}. Title: ${r.title}\nDescription: ${r.description}\nURL: ${r.url}`)
    .join('\n\n');

  const prompt =
    `Extract recipe information from the following search results and return a JSON array. ` +
    `Each item must have: title (string), ingredients (array of strings), instructions (array of strings), ` +
    `cookTime (string), source (the URL string). ` +
    `If ingredients or instructions are not in the snippet, infer reasonable ones from the recipe title. ` +
    `Return ONLY a valid JSON array — no markdown, no explanation.\n\nResults:\n\n${resultsText}`;

  const response = await groqGenerate(prompt);

  const jsonMatch = response.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error('No JSON array in Groq response');

  const parsed: Recipe[] = JSON.parse(jsonMatch[0]);
  return parsed.filter(
    (r) => r.title && Array.isArray(r.ingredients) && Array.isArray(r.instructions),
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query: string = (body.query ?? '').trim();

    if (!query) {
      return NextResponse.json({ error: 'query is required' }, { status: 400 });
    }

    if (!TAVILY_API_KEY || TAVILY_API_KEY === 'your_tavily_api_key_here') {
      return NextResponse.json(
        { error: 'TAVILY_API_KEY is not configured in .env.local' },
        { status: 500 },
      );
    }

    if (!GROQ_API_KEY || GROQ_API_KEY === 'your_groq_api_key_here') {
      return NextResponse.json(
        { error: 'GROQ_API_KEY is not configured in .env.local' },
        { status: 500 },
      );
    }

    // Step 1 — refine query with Groq
    let refinedQuery: string;
    try {
      refinedQuery = await refineQuery(query);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return NextResponse.json(
        { error: `Groq error: ${msg}` },
        { status: 503 },
      );
    }

    // Step 2 — fetch live results from Tavily
    let searchResults: SearchResult[];
    try {
      searchResults = await searchTavily(refinedQuery);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      return NextResponse.json({ error: `Web search failed: ${msg}` }, { status: 502 });
    }

    if (searchResults.length === 0) {
      return NextResponse.json({ recipes: [] });
    }

    // Step 3 — extract structured recipes with Groq
    let recipes: Recipe[];
    try {
      recipes = await extractRecipes(searchResults);
    } catch {
      try {
        recipes = await extractRecipes(searchResults.slice(0, 4));
      } catch {
        return NextResponse.json(
          { recipes: [], warning: 'Results found but could not extract structured recipe data.' },
        );
      }
    }

    return NextResponse.json({ recipes });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
