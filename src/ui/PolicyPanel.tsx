import type { CaseResult, PolicyDoc, TextSpan } from '../domain/types';
import { policySpansValid } from '../domain/policy-parser';
import { passageNumber } from './outcomes';
export function PolicyPanel({ policy, result, flash }: {
    policy: PolicyDoc;
    result: CaseResult;
    flash: string | null;
}) {
    const used = new Set(result.items.flatMap(r => 'clauseId' in r.outcome ? [r.outcome.clauseId] : r.outcome.status === 'conflict' ? r.outcome.clauseIds : []));
    const highlights = policy.clauses.filter(c => used.has(c.id));
    const valid = policySpansValid(policy);
    const parts: {
        span: TextSpan;
        ids: string[];
    }[] = [];
    for (const c of highlights) {
        const previous = parts.at(-1);
        if (previous && previous.span.start === c.span.start && previous.span.end === c.span.end)
            previous.ids.push(c.id);
        else
            parts.push({ span: c.span, ids: [c.id] });
    }
    const unused: string[] = [];
    let unusedCursor = 0;
    for (const { span } of parts) {
        const text = policy.text.slice(unusedCursor, span.start).trim();
        if (text)
            unused.push(text);
        unusedCursor = span.end;
    }
    const tail = policy.text.slice(unusedCursor).trim();
    if (tail)
        unused.push(tail);
    let cursor = 0;
    return <section className="panel policy" aria-label="Policy"><h2>Policy</h2><strong>{policy.label}</strong><p>copied on {policy.capturedOn} · SHA-256 {policy.sha256.slice(0, 12)}</p>{!valid ? <><p role="alert">Evidence mismatch; highlight hidden</p><pre>{policy.text}</pre></> : <pre>{parts.map(({ span, ids }) => {
                const before = policy.text.slice(cursor, span.start);
                cursor = span.end;
                return <span key={ids[0]}>{before}<mark className={`${flash && ids.includes(flash) ? 'flash' : ''} tint-${(Number(ids[0]!.slice(1)) - 1) % 4}`}><b>{ids.map(id => <span key={id} id={`passage-${id}`} tabIndex={-1}>{passageNumber(id)} </span>)}</b>{span.text}</mark></span>;
            })}{policy.text.slice(cursor)}</pre>}<details><summary>Passages not used</summary>{unused.map((text, index) => <pre key={index}>{text}</pre>)}</details></section>;
}
