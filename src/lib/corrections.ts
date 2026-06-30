const corrections: Record<string, string> = {
  // Common English misspellings
  teh: 'the', adn: 'and', hte: 'the', taht: 'that', waht: 'what', wiht: 'with',
  hwo: 'how', nad: 'and', yuo: 'you', recieve: 'receive', beleive: 'believe',
  freind: 'friend', wierd: 'weird', thier: 'their', occured: 'occurred',
  begining: 'beginning', seperate: 'separate', definately: 'definitely',
  probaly: 'probably', probabaly: 'probably', becuase: 'because',
  becasue: 'because', untill: 'until', tommorrow: 'tomorrow', tomarrow: 'tomorrow',
  writting: 'writing', writen: 'written', truely: 'truly', arguement: 'argument',
  concious: 'conscious', suprise: 'surprise', grammer: 'grammar', sieze: 'seize',
  neccessary: 'necessary', necesary: 'necessary', necesarry: 'necessary',
  succesful: 'successful', recomend: 'recommend', reccomend: 'recommend',
  refered: 'referred', prefered: 'preferred', occassion: 'occasion',
  relevent: 'relevant', independant: 'independent', existance: 'existence',
  knowlege: 'knowledge', accomodate: 'accommodate', enviroment: 'environment',
  unfortunatly: 'unfortunately', immedietly: 'immediately', immediatly: 'immediately',
  basicaly: 'basically', finaly: 'finally', usefull: 'useful', carefull: 'careful',
  gratefull: 'grateful', hopefull: 'hopeful', helpfull: 'helpful',
  beautifull: 'beautiful',

  // Recipe
  recipie: 'recipe', reciepe: 'recipe', recepie: 'recipe', reicpe: 'recipe',
  recipee: 'recipe', recpie: 'recipe',

  // Chicken
  chiken: 'chicken', chikken: 'chicken', chiecken: 'chicken', chciken: 'chicken',

  // Spaghetti
  spagetti: 'spaghetti', spagehtti: 'spaghetti', spghetti: 'spaghetti',
  spageti: 'spaghetti', spaghetii: 'spaghetti',

  // Herbs & veg
  parsly: 'parsley', parsely: 'parsley', parseley: 'parsley',
  brocolli: 'broccoli', brocoli: 'broccoli',
  zuchini: 'zucchini', zucchinni: 'zucchini', zuchhinni: 'zucchini',
  avacado: 'avocado', avocardo: 'avocado', avacardo: 'avocado',
  cinnimon: 'cinnamon', cinammon: 'cinnamon', cinnamin: 'cinnamon',
  garlick: 'garlic', galic: 'garlic',
  onoin: 'onion', oinon: 'onion',
  tomatoe: 'tomato', tomate: 'tomato', potatoe: 'potato',
  coliflower: 'cauliflower', califlower: 'cauliflower', caulflower: 'cauliflower',
  mashrooms: 'mushrooms', mushroms: 'mushrooms',
  corriander: 'coriander', coriender: 'coriander',
  tumeric: 'turmeric',

  // Dishes
  carbonarra: 'carbonara', carbonnara: 'carbonara', carbanara: 'carbonara',
  fetucini: 'fettuccine', fettucini: 'fettuccine', fetuccini: 'fettuccine',
  lasange: 'lasagne', lasagnia: 'lasagna', lasanga: 'lasagna',
  bruchetta: 'bruschetta', bruscheta: 'bruschetta',
  focacia: 'focaccia', focacica: 'focaccia',
  mozzarela: 'mozzarella', mozarella: 'mozzarella', mozzerella: 'mozzarella',
  parmesian: 'parmesan', parmasan: 'parmesan', parmeson: 'parmesan',
  caeser: 'caesar', ceasar: 'caesar',
  teriyakie: 'teriyaki', teriyake: 'teriyaki',
  vinegerette: 'vinaigrette', vinagerette: 'vinaigrette', vinagrette: 'vinaigrette',
  burito: 'burrito', burritto: 'burrito',
  quesadila: 'quesadilla', quesedilla: 'quesadilla',
  enchillada: 'enchilada',
  tzatzki: 'tzatziki',
  hummous: 'hummus', humus: 'hummus', humas: 'hummus',
  tabouleh: 'tabbouleh', tabbouli: 'tabbouleh',
  felafel: 'falafel',
  mousaka: 'moussaka', musaka: 'moussaka',
  mayonaise: 'mayonnaise', mayanaise: 'mayonnaise', mayonnase: 'mayonnaise',
  margerine: 'margarine', margaraine: 'margarine',
  biscut: 'biscuit', bisquit: 'biscuit',
  sandwhich: 'sandwich', sandwitch: 'sandwich',
  burgur: 'burger',
  deserts: 'desserts', desssert: 'dessert',
  choclate: 'chocolate', chocloate: 'chocolate',
  vanila: 'vanilla', vanilia: 'vanilla',
  straberry: 'strawberry', strawbery: 'strawberry',
  rasberry: 'raspberry', rasbperry: 'raspberry',
  cranbery: 'cranberry',
  refridgerate: 'refrigerate', refridgerator: 'refrigerator',
  marinaide: 'marinade',

  // Cooking verbs
  fied: 'fried', boild: 'boiled', grild: 'grilled', rosted: 'roasted',
  stemed: 'steamed', miced: 'minced', choped: 'chopped', slised: 'sliced',
  simered: 'simmered', brased: 'braised',
  carmelise: 'caramelise', caramalise: 'caramelise', carmelized: 'caramelized',
};

export function autocorrectWord(word: string): string | null {
  const lower = word.toLowerCase();
  if (!corrections[lower]) return null;
  const corrected = corrections[lower];
  const isCapitalized = word[0] >= 'A' && word[0] <= 'Z';
  return isCapitalized
    ? corrected.charAt(0).toUpperCase() + corrected.slice(1)
    : corrected;
}
