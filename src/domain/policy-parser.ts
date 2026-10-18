import type { CivilDate, PolicyClause, PolicyDoc, TextSpan, WindowUnit } from './types';
import { categoriesInText } from './categories';
import { makeSpan, verifySpan } from './spans';
const numbers: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, fourteen: 14, fifteen: 15, twenty: 20, 'twenty-one': 21, thirty: 30, 'forty-five': 45, sixty: 60, ninety: 90 };
const windowPattern = new RegExp(`\\b(\\d{1,3}|${Object.keys(numbers).sort((a, b) => b.length - a.length).join('|')})(?:\\s*\\((\\d{1,3})\\))?[\\s-]*(calendar\\s+|business\\s+|working\\s+)?(days?|weeks?|months?)\\b`, 'gi');
function segments(text: string): [
    number,
    number
][] {
    const out: [
        number,
        number
    ][] = [];
    let begin = 0;
    const push = (end: number) => {
        const chunk = text.slice(begin, end), prefix = /^\s*(?:(?:[-*•–]|\d+[.)])\s*)?/.exec(chunk)![0].length;
        const start = begin + prefix, finish = end - (chunk.match(/\s*$/)?.[0].length ?? 0);
        if (start < finish)
            out.push([start, finish]);
    };
    for (let i = 0; i < text.length; i++) {
        if (text[i] === '\n') {
            push(i);
            begin = i + 1;
            continue;
        }
        if (/[.!?;]/.test(text[i]!) && /\s/.test(text[i + 1] ?? '') && !/(?:\be\.g\.|\bi\.e\.|\betc\.|\bNo\.|\bapprox\.)$/i.test(text.slice(begin, i + 1))) {
            push(i + 1);
            begin = i + 1;
        }
    }
    push(text.length);
    return out;
}
function scopeFor(text: string, span: TextSpan): PolicyClause['scope'] {
    const cats = categoriesInText(span.text);
    if (cats.length)
        return { type: 'categories', categories: [...new Set(cats.map(c => c.category))], spans: cats.map(c => makeSpan(text, span.start + c.start, span.start + c.end)) };
    const match = /\b(?:all other items|all other|other items|all items|everything else|most items|any item)\b/i.exec(span.text);
    return { type: 'default', span: match ? makeSpan(text, span.start + match.index, span.start + match.index + match[0].length) : null };
}
function anchorFor(text: string, span: TextSpan): PolicyClause['anchor'] {
    const purchase = /\b(?:of|from|after)\s+(?:the\s+)?(?:date\s+of\s+)?(?:purchase|purchasing|sale|transaction|order\s+date|invoice\s+date|receipt\s+date)\b|\b(?:from|after)\s+(?:the\s+day\s+)?you\s+(?:buy|bought|purchase)\b/i.exec(span.text);
    const delivery = /\b(?:of|from|after)\s+(?:the\s+)?(?:date\s+of\s+)?(?:delivery|arrival)\b|\b(?:from|after)\s+(?:the\s+date\s+)?(?:you\s+)?(?:receive|received|receiving)\b|\b(?:of|from|after)\s+receipt\s+of\s+(?:the|your)\s+(?:item|items|order|goods|parcel)\b|\b(?:once|after)\s+(?:it|they|your\s+order)\s+(?:is|are|has|have)\s+(?:been\s+)?delivered\b/i.exec(span.text);
    // Coordinated “of purchase or delivery” shares the preposition.
    const coordinated = /\b(?:purchase|delivery)\s+or\s+(?:purchase|delivery)\b/i.test(span.text);
    if ((!!purchase === !!delivery) || coordinated)
        return { value: 'unspecified', span: null };
    const m = (purchase ?? delivery)!;
    return { value: purchase ? 'purchase' : 'delivery', span: makeSpan(text, span.start + m.index, span.start + m.index + m[0].length) };
}
export function analysePolicy(label: string, input: string, capturedOn: CivilDate, sha256: string): PolicyDoc {
    const text = input.replace(/\r\n?/g, '\n'), clauses: PolicyClause[] = [];
    const add = (clause: Omit<PolicyClause, 'id'>) => clauses.push({ id: `c${clauses.length + 1}`, ...clause });
    function analyse(start: number, end: number, maySplit = true): void {
        const span = makeSpan(text, start, end), scope = scopeFor(text, span), anchor = anchorFor(text, span);
        const exclusion = /\b(?:final sale|non-returnable|not eligible for (?:a\s+)?return|cannot be returned|no returns|not returnable)\b/i.test(span.text);
        if (exclusion) {
            const marker = /\b(?:marked|labelled|labeled)\s+(?:final sale|clearance)\b/i.exec(span.text);
            if (marker)
                add({ span, kind: 'exclusion', window: null, anchor, scope: { type: 'marked', marker: 'final_sale', span: makeSpan(text, start + marker.index, start + marker.index + marker[0].length) } });
            else if (scope.type === 'categories')
                add({ span, kind: 'exclusion', window: null, anchor, scope });
            return;
        }
        if (!/\b(?:returns?|returned|refunds?|exchange)\b/i.test(span.text))
            return;
        const matches = [...span.text.matchAll(windowPattern)];
        if (matches.some(m => m[2] && Number(m[2]) !== (numbers[m[1]!.toLowerCase()] ?? Number(m[1]))))
            return;
        const windows = matches.filter(m => !/^\s*(?:of approval|of processing|to process)\b/i.test(span.text.slice(m.index + m[0].length)));
        if (maySplit && windows.length > 1) {
            const boundaries: number[] = [];
            for (let i = 1; i < windows.length; i++) {
                const previous = windows[i - 1]!, current = windows[i]!;
                const cat = categoriesInText(span.text).filter(c => c.start >= previous.index + previous[0].length && c.end <= current.index).sort((a, b) => a.start - b.start)[0];
                if (cat)
                    boundaries.push(start + cat.start);
            }
            if (boundaries.length === windows.length - 1) {
                const edges = [start, ...boundaries, end];
                for (let i = 0; i < edges.length - 1; i++) {
                    let e = edges[i + 1]!;
                    while (e > edges[i]! && /[\s,]/.test(text[e - 1]!))
                        e--;
                    analyse(edges[i]!, e, false);
                }
                return;
            }
        }
        for (const m of windows) {
            const amount = numbers[m[1]!.toLowerCase()] ?? Number(m[1]), qualifier = m[3]?.trim().toLowerCase(), base = m[4]!.toLowerCase();
            const unit: WindowUnit = qualifier === 'business' || qualifier === 'working' ? 'business_days' : base.startsWith('week') ? 'weeks' : base.startsWith('month') ? 'months' : qualifier === 'calendar' ? 'calendar_days' : 'days';
            add({ span, kind: 'window', window: { amount, unit, span: makeSpan(text, start + m.index, start + m.index + m[0].length) }, anchor, scope });
        }
    }
    for (const [start, end] of segments(text))
        analyse(start, end);
    const policy = { label, text, capturedOn, sha256, clauses };
    if (!policySpansValid(policy))
        throw new Error('Evidence mismatch');
    return policy;
}
export function policySpansValid(policy: PolicyDoc): boolean {
    return policy.clauses.every(c => {
        const nested = [c.window?.span, c.anchor.span, ...(c.scope.type === 'categories' ? c.scope.spans : [c.scope.span])].filter((s): s is TextSpan => !!s);
        return verifySpan(policy.text, c.span) && nested.every(s => verifySpan(policy.text, s) && s.start >= c.span.start && s.end <= c.span.end);
    });
}
