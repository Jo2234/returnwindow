import type { CaseResult, PolicyDoc, TextSpan } from '../domain/types';
import { verifySpan } from '../domain/spans';
import { passageNumber } from './outcomes';
export function PolicyPanel({ policy, result, flash }: {
    policy: PolicyDoc;
    result: CaseResult;
    flash: string | null;
}) {
    const used = new Set(result.items.flatMap(r => 'clauseId' in r.outcome ? [r.outcome.clauseId] : r.outcome.status === 'conflict' ? r.outcome.clauseIds : []));
    const highlights = policy.clauses.filter(c => used.has(c.id));
    const valid = highlights.every(c => verifySpan(policy.text, c.span));
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
    let cursor = 0;
    return <section className="panel policy" aria-label="Policy"><h2>Policy</h2><strong>{policy.label}</strong><p>copied on {policy.capturedOn} · SHA-256 {policy.sha256.slice(0, 12)}</p>{!valid ? <><p role="alert">Evidence mismatch; highlight hidden</p><pre>{policy.text}</pre></> : <pre>{parts.map(({ span, ids }) => {
                const before = policy.text.slice(cursor, span.start);
                cursor = span.end;
                return <span key={ids[0]}>{before}<mark id={`passage-${ids[0]}`} tabIndex={-1} className={`${flash && ids.includes(flash) ? 'flash' : ''} tint-${(Number(ids[0]!.slice(1)) - 1) % 4}`}><b>{ids.map(passageNumber).join(' ')} </b>{span.text}</mark></span>;
            })}{policy.text.slice(cursor)}</pre>}<details><summary>Passages not used</summary>{policy.clauses.filter(c => !used.has(c.id)).map(c => <p key={c.id}>{passageNumber(c.id)} {c.span.text}</p>)}</details></section>;
}
