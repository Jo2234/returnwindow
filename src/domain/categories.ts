import type { Category } from './types';
const lexicon: readonly [
    Category,
    string
][] = [
    ['electronics', 'electronics electronic earbuds headphones earphones laptop tablet phone smartphone charger cable camera speaker smartwatch console gadget gadgets'],
    ['footwear', 'footwear shoes shoe sneakers sneaker sandals boots'],
    ['apparel', 'apparel clothing clothes garment garments shirt t-shirt tee dress jeans trousers pants jacket scarf skirt socks'],
    ['beauty', 'beauty cosmetics skincare makeup fragrance perfume lipstick'],
    ['home', 'home homeware homewares kitchen mug cup plate bowl towel bedding lamp cushion'],
    ['groceries', 'groceries grocery food snacks beverages perishable perishables'],
];
// Build singular/plural aliases once; whole-word matching never matches “mugshot”.
function forms(word:string):string[] {
  const singular=word.endsWith('ies')?word.slice(0,-3)+'y':/(?:ches|shes|xes|zes|sses)$/.test(word)?word.slice(0,-2):word.endsWith('s')&&!word.endsWith('ss')?word.slice(0,-1):word;
  const plural=/[^aeiou]y$/.test(singular)?singular.slice(0,-1)+'ies':/(?:s|x|z|ch|sh)$/.test(singular)?singular+'es':singular+'s';
  return [word,singular,plural];
}
const matchers=lexicon.map(([category,words])=>({category,pattern:[...new Set(words.split(' ').flatMap(forms))].sort((a,b)=>b.length-a.length).join('|')}));
export function categoriesInText(text: string): {
    category: Category;
    start: number;
    end: number;
}[] {
    return matchers.flatMap(({category,pattern}) => [...text.matchAll(new RegExp(`\\b(?:${pattern})\\b`, 'gi'))].map(m => ({ category, start: m.index, end: m.index + m[0].length }))).sort((a, b) => a.start - b.start);
}
export function categorize(description: string): {
    value: Category;
    keyword: string | null;
} {
    const hits = categoriesInText(description);
    const hit = lexicon.flatMap(([category]) => hits.filter(h => h.category === category))[0];
    return hit ? { value: hit.category, keyword: description.slice(hit.start, hit.end) } : { value: 'other', keyword: null };
}
export function saleMarker(description: string): {
    finalSale: boolean;
    keyword: string | null;
} {
    const match = /\b(?:final sale|clearance|as[- ]is)\b/i.exec(description);
    return { finalSale: !!match, keyword: match?.[0] ?? null };
}
