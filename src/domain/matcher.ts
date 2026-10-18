import type { LineItem, PolicyClause, PolicyDoc } from './types';
export function governingClauses(item: LineItem, policy: PolicyDoc): {
    kind: 'exclusion' | 'window' | 'none' | 'conflict';
    clauses: PolicyClause[];
} {
    const marked = policy.clauses.find(c => c.kind === 'exclusion' && c.scope.type === 'marked' && item.marker.finalSale);
    if (marked)
        return { kind: 'exclusion', clauses: [marked] };
    const excluded = policy.clauses.find(c => c.kind === 'exclusion' && c.scope.type === 'categories' && c.scope.categories.includes(item.category.value));
    if (excluded)
        return { kind: 'exclusion', clauses: [excluded] };
    let windows = policy.clauses.filter(c => c.kind === 'window' && c.scope.type === 'categories' && c.scope.categories.includes(item.category.value));
    if (!windows.length)
        windows = policy.clauses.filter(c => c.kind === 'window' && c.scope.type === 'default');
    if (!windows.length)
        return { kind: 'none', clauses: [] };
    const signature = (c: PolicyClause) => `${c.window?.amount}:${c.window?.unit}:${c.anchor.value}`;
    return windows.every(c => signature(c) === signature(windows[0]!)) ? { kind: 'window', clauses: [windows[0]!] } : { kind: 'conflict', clauses: windows };
}
