# Smart Recipe Finder

A modern recipe discovery app powered by real web search and a local AI model. Type a natural language query — the app refines it with Ollama, fetches live results from Brave Search, and returns structured recipes displayed in a clean UI.

---

## Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js | 18.17 or later |
| npm | 9 or later |
| [Ollama](https://ollama.com) | Latest |
| Brave Search API key | Free tier at [brave.com/search/api](https://brave.com/search/api/) |

---

## Local Setup

### 1. Install and start Ollama

Download Ollama from [ollama.com](https://ollama.com), then pull the model and start the server:

```bash
ollama pull llama3
ollama serve
```

Ollama runs on `http://localhost:11434` by default. Leave this running in a separate terminal.

> Alternatively use `mistral` or `phi3` — update `OLLAMA_MODEL` in `.env.local` to match.

---

### 2. Install dependencies

```bash
npm install
```

If you are behind a corporate proxy that blocks the public registry, add the flag:

```bash
npm install --registry https://registry.npmjs.org
```

---

### 3. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

Open `.env.local` and set:

```env
# Get a free key at https://brave.com/search/api/
BRAVE_API_KEY=your_brave_search_api_key_here

# URL where Ollama is running (default is fine for local)
OLLAMA_BASE_URL=http://localhost:11434

# Model to use — must be pulled with: ollama pull <model>
OLLAMA_MODEL=llama3
```

---

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Production Build

```bash
npm run build
npm start
```

Ollama must be running on the same machine (or reachable at the `OLLAMA_BASE_URL` you configured).

---

## How it works

```
User query
  → Ollama refines the query into a clean search string
  → Brave Search API fetches the top 8 live recipe results
  → Ollama extracts structured recipe data from the snippets
  → UI renders title, ingredients, instructions, cook time, and source link
```

---

## Project structure

```
src/
├── app/
│   ├── api/search/route.ts   # Backend pipeline (Ollama + Brave)
│   ├── layout.tsx            # Root layout with theme script
│   ├── page.tsx              # Home page
│   └── providers.tsx         # React Query provider
├── components/
│   ├── RecipeCard.tsx        # Individual recipe card
│   ├── RecipeGrid.tsx        # Responsive grid + skeleton loading
│   ├── SearchBar.tsx         # Search input
│   └── ThemeToggle.tsx       # Dark / light mode toggle
├── hooks/
│   └── useRecipeSearch.ts    # React Query mutation
├── store/
│   └── recipeStore.ts        # Zustand global state
└── types/
    └── recipe.ts             # Shared TypeScript types
```

---

## Troubleshooting

**"Could not reach Ollama"**
Ollama is not running. Start it with `ollama serve` and make sure `OLLAMA_BASE_URL` in `.env.local` matches.

**"BRAVE_API_KEY is not configured"**
Add your key to `.env.local`. Restart the dev server after changing env vars.

**"Brave Search returned 4XX"**
Your API key is invalid or you have exceeded the free tier quota. Check your key at [brave.com/search/api](https://brave.com/search/api/).

**No recipes returned / warning shown**
Ollama parsed the search snippets but could not extract structured data. Try a more specific query, or switch to a larger model (`llama3` instead of `phi3`).
