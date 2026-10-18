import { useEffect, useMemo, useState } from 'react';
import type { CaseResult, CaseState } from '../domain/types';
import { buildIcs } from '../domain/ics';
import { buildEvidenceHtml, EVIDENCE_CSS } from '../domain/evidence';

function useDownload() {
    const [pending] = useState(() => new Map<string, ReturnType<typeof setTimeout>>());
    useEffect(() => () => { for (const [url, timer] of pending) { clearTimeout(timer); URL.revokeObjectURL(url); } pending.clear(); }, [pending]);
    return (text: string, type: string, filename: string) => {
        const url = URL.createObjectURL(new Blob([text], { type })), link = document.createElement('a');
        link.href = url; link.download = filename; document.body.append(link); link.click(); link.remove();
        pending.set(url, setTimeout(() => { URL.revokeObjectURL(url); pending.delete(url); }, 1000));
    };
}
const basename = (state: CaseState) => `returnwindow-${(state.receipt?.store.value ?? 'store').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'store'}-${state.receipt?.purchaseDate.value ?? 'undated'}`;
export function ExportActions({ state, result, now, onEvidence, onReset }: { state: CaseState; result: CaseResult; now: Date; onEvidence: () => void; onReset: () => void }) {
    const output = buildIcs(state, result, now), download = useDownload();
    const reason = result.refusal ? 'A receipt and supported policy are needed' : 'No computed unexpired deadlines yet';
    return <div className="export-controls">
        <div className="actions" aria-label="Case actions"><button disabled={!output.included.length} title={!output.included.length ? reason : `${output.included.length} all-day reminders; 09:00 SGT the day before`} aria-describedby={!output.included.length ? 'export-disabled-reason' : undefined} onClick={() => download(output.text, 'text/calendar;charset=utf-8', `${basename(state)}.ics`)}>Download reminders (.ics)</button><button className="subtle" onClick={onEvidence}>Evidence pack</button><button className="subtle" onClick={onReset}>Start over</button></div>
        {!output.included.length && <p id="export-disabled-reason" className="export-note">{reason}.</p>}
        {output.excluded.length > 0 && <details className="export-note"><summary>{output.excluded.length} {output.excluded.length === 1 ? 'item excluded' : 'items excluded'} from reminders</summary><ul>{output.excluded.map(item => <li key={item.itemId}>{state.receipt?.items.find(i => i.id === item.itemId)?.description.value}: {item.reason}</li>)}</ul></details>}
    </div>;
}
export function EvidenceView({ state, result, now, imageUrl, onBack }: { state: CaseState; result: CaseResult; now: Date; imageUrl: string | null; onBack: () => void }) {
    const [image, setImage] = useState<string | null>(null), [imageError, setImageError] = useState(false), [loading, setLoading] = useState(!!imageUrl), download = useDownload();
    useEffect(() => {
        const controller = new AbortController(); let reader: FileReader | null = null;
        setImage(null); setImageError(false); setLoading(!!imageUrl);
        if (imageUrl) void fetch(imageUrl, { signal: controller.signal }).then(response => response.blob()).then(blob => {
            if (controller.signal.aborted) return;
            reader = new FileReader(); reader.onload = () => { if (!controller.signal.aborted) { setImage(String(reader!.result)); setLoading(false); } };
            reader.onerror = () => { if (!controller.signal.aborted) { setImageError(true); setLoading(false); } }; reader.readAsDataURL(blob);
        }).catch(() => { if (!controller.signal.aborted) { setImageError(true); setLoading(false); } });
        return () => { controller.abort(); if (reader?.readyState === FileReader.LOADING) reader.abort(); };
    }, [imageUrl]);
    const html = useMemo(() => buildEvidenceHtml(state, result, now, { receiptImageDataUrl: image }), [state, result, now, image]);
    const body = html.slice(html.indexOf('<body>') + 6, html.lastIndexOf('</body>'));
    return <section id="evidence" aria-label="Evidence pack"><nav className="evidence-actions" data-print="hide" aria-label="Evidence actions"><button className="subtle" onClick={onBack}>Back to workspace</button><button disabled={loading} onClick={() => window.print()}>Print / Save as PDF</button><button disabled={loading} onClick={() => download(html, 'text/html;charset=utf-8', `${basename(state)}-evidence.html`)}>Download .html</button>{loading && <span role="status">Preparing receipt image…</span>}{imageError && <span role="status">The image could not be included; extracted evidence is available.</span>}</nav><style>{EVIDENCE_CSS}</style><div dangerouslySetInnerHTML={{ __html: body }}/></section>;
}
