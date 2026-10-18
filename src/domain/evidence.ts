import type { CaseResult, CaseState, ItemOutcome } from './types';
import { formatLong, todayInSingapore } from './civil-date';
import { DATE_CONVENTION } from './engine';
import { policySpansValid } from './policy-parser';

export const escapeHtml = (text: unknown): string => String(text ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
export const EVIDENCE_CSS = `
.evidence-pack{max-width:900px;margin:24px auto;padding:28px;background:#fff;color:#1e2330;font:14px/1.6 system-ui,sans-serif;overflow-wrap:anywhere}
.evidence-pack h1{font-size:28px}.evidence-pack h2{font-size:19px;margin-top:24px}.evidence-pack table{width:100%;border-collapse:collapse;margin:12px 0}
.evidence-pack th,.evidence-pack td{border:1px solid #9197a4;padding:8px;text-align:left;vertical-align:top}
.evidence-pack blockquote{margin:12px 0;padding:12px;border-left:3px solid #2647d0;white-space:pre-wrap;background:#f6f3ea}
.evidence-pack code{font:12px ui-monospace,monospace}.evidence-pack img{display:block;max-width:100%;max-height:1000px;object-fit:contain}
@page{size:A4;margin:16mm}
@media print{[data-print="hide"]{display:none!important}html,body{background:#fff!important;margin:0}.evidence-pack{margin:0;padding:0;max-width:none;font-size:10pt}.evidence-pack h2,.evidence-pack tr,.evidence-pack blockquote{break-inside:avoid}.evidence-pack h2{break-after:avoid}.evidence-pack img{max-height:220mm}}
@media(max-width:720px){.evidence-pack{margin:8px;padding:12px;font-size:12px}.evidence-pack th,.evidence-pack td{padding:5px}}
`;
function statusText(outcome: ItemOutcome): string {
    switch (outcome.status) {
        case 'computed': return `Computed — ${formatLong(outcome.deadline)}`;
        case 'needs_answer': return 'Waiting for your answer';
        case 'unsure': return `Not computed. ${outcome.earliestPossible ? `Earliest possible last day: ${formatLong(outcome.earliestPossible)} (if counted from purchase). ` : ''}Check with the store.`;
        case 'not_returnable': return 'Not returnable (final sale)';
        case 'no_policy_match': return 'No policy line covers this item. ReturnWindow won’t guess.';
        case 'unsupported': return 'Business days unsupported; not computed';
        case 'conflict': return 'Conflicting passages; not computed';
        case 'missing_input': return `Missing ${outcome.field === 'deliveryDate' ? 'delivery' : 'purchase'} date`;
    }
}
export function buildEvidenceHtml(state: CaseState, result: CaseResult, now: Date, opts: { receiptImageDataUrl: string | null }): string {
    const e = escapeHtml, policy = state.policy;
    const used = new Set(result.items.flatMap(r => 'clauseId' in r.outcome ? [r.outcome.clauseId] : r.outcome.status === 'conflict' ? r.outcome.clauseIds : []));
    const rows = (state.receipt?.items ?? []).map(item => {
        const r = result.items.find(r => r.itemId === item.id), o = r?.outcome;
        const ids = o && 'clauseId' in o ? [o.clauseId] : o?.status === 'conflict' ? o.clauseIds : [];
        return `<tr><td>${e(item.description.value)}<br>SGD ${e(item.amountCents.value === null ? 'Not provided' : (item.amountCents.value / 100).toFixed(2))}</td><td>${e(result.refusal ? `No deadline: ${result.refusal.code}` : o ? statusText(o) : 'No result')}</td><td>${e(o?.status === 'computed' ? `${o.window.amount} ${o.window.unit.replace(/_/g, ' ')} from ${o.start.basis} (${formatLong(o.start.date)}) via ${o.start.via}` : '—')}</td><td>${e(ids.map(id => `Passage ${id.slice(1)}`).join(', ') || '—')}</td></tr>`;
    }).join('');
    const passages = policy && policySpansValid(policy) ? policy.clauses.filter(c => used.has(c.id)).map(c => `<section><h3>Passage ${e(c.id.slice(1))} · offsets ${c.span.start}–${c.span.end}</h3><blockquote>${e(c.span.text)}</blockquote></section>`).join('') : policy ? '<p>Evidence mismatch; quotations hidden.</p>' : '<p>No policy supplied.</p>';
    const corrections = state.corrections.map(c => `<tr><td>${e(new Intl.DateTimeFormat('en-SG', { timeZone: 'Asia/Singapore', dateStyle: 'medium', timeStyle: 'medium', hour12: false }).format(new Date(c.at)))} SGT</td><td>${e(c.target.field)}${'itemId' in c.target ? ` (${e(c.target.itemId)})` : ''}</td><td>${e(c.from ?? 'Not provided')} → ${e(c.to)}</td></tr>`).join('');
    const answers = state.answers.map(a => `<li>${e(a.questionId)}: ${e(a.choice)} · ${e(a.at)}</li>`).join('');
    const image = opts.receiptImageDataUrl && /^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(opts.receiptImageDataUrl) ? `<h2>Receipt image</h2><img src="${opts.receiptImageDataUrl}" alt="Receipt supplied for this case">` : '';
    return `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'"><title>ReturnWindow evidence — ${e(state.receipt?.store.value)}</title><style>${EVIDENCE_CSS}</style></head><body><main class="evidence-pack"><h1>ReturnWindow evidence pack</h1>${state.sample ? '<p><strong>Sample data — synthetic</strong></p>' : ''}<p><strong>Store:</strong> ${e(state.receipt?.store.value ?? 'Not provided')}<br><strong>Purchase date:</strong> ${e(state.receipt?.purchaseDate.value ?? 'Not provided')}<br><strong>Delivery date:</strong> ${e(state.deliveryDate.value ?? 'Not provided')}</p><p>${e(DATE_CONVENTION)}</p><h2>Item results</h2><table><thead><tr><th>Item / amount</th><th>Status / last return day</th><th>Basis</th><th>Evidence</th></tr></thead><tbody>${rows}</tbody></table><h2>Policy evidence</h2><p>${e(policy?.label ?? 'No policy')} · copied on ${e(policy?.capturedOn ?? '—')}<br>SHA-256: <code>${e(policy?.sha256 ?? '—')}</code></p>${passages}<h2>Answers</h2><ul>${answers || '<li>No answers given.</li>'}</ul><h2>Changes</h2><table><thead><tr><th>Time (Singapore)</th><th>Field</th><th>Was → now</th></tr></thead><tbody>${corrections || '<tr><td colspan="3">No corrections made.</td></tr>'}</tbody></table>${image}<p>Generated by ReturnWindow on ${e(todayInSingapore(now))} — not legal advice.</p><p>Extraction: on-device OCR (Tesseract LSTM) + deterministic rules. No generative AI model is used to compute deadlines.</p></main></body></html>`;
}
