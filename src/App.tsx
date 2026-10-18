import { useState } from 'react';
import { parseCivilDate, formatLong, todayInSingapore } from './domain/civil-date';
import { documentFromText, parseReceipt } from './domain/receipt-parser';
import { analysePolicy } from './domain/policy-parser';
import { DATE_CONVENTION } from './domain/engine';
import { emptyCase, useCaseStore } from './state/case-store';
import { outcomeText, passageNumber } from './ui/outcomes';
import { PolicyPanel } from './ui/PolicyPanel';
export default function App() {
    const simulated = parseCivilDate(new URLSearchParams(location.search).get('today') ?? '');
    const now = () => simulated ? new Date(`${simulated}T04:00:00Z`) : new Date();
    const [store, dispatch] = useCaseStore(now());
    const [receiptText, setReceiptText] = useState(''), [policyText, setPolicyText] = useState(''), [label, setLabel] = useState('Store return policy'), [captured, setCaptured] = useState(todayInSingapore(now())), [error, setError] = useState(''), [flash, setFlash] = useState<string | null>(null);
    async function load(receipt: string, policy: string, sample = false) {
        setError('');
        if (policy.length > 50000) {
            setError('That policy is too long (max 50,000 characters).');
            return;
        }
        const capturedOn = parseCivilDate(captured);
        if (!capturedOn) {
            setError('Use a real date, e.g. 08/10/2026.');
            return;
        }
        const text = policy.replace(/\r\n?/g, '\n');
        const hash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)))).map(b => b.toString(16).padStart(2, '0')).join('');
        const state = emptyCase();
        state.sample = sample;
        state.receiptOcr = documentFromText(receipt);
        state.receipt = parseReceipt(state.receiptOcr);
        state.policy = text.trim() ? analysePolicy(label.trim().slice(0, 120) || 'Store return policy', text, capturedOn, hash) : null;
        dispatch({ type: 'replace', state, now: now() });
    }
    async function sample() {
        try {
            const [r, p] = await Promise.all(['/samples/receipt-demo.txt', '/samples/policy-demo.txt'].map(async (url) => { const response = await fetch(url); if (!response.ok)
                throw new Error('Sample unavailable'); return response.text(); }));
            setReceiptText(r!);
            setPolicyText(p!);
            await load(r!, p!, true);
        }
        catch {
            setError('The sample could not be loaded. Paste the text instead.');
        }
    }
    async function readText(file: File | undefined, policy = false) {
        if (!file)
            return;
        if (file.size > 15 * 1024 * 1024) {
            setError('That file is too large (max 15 MB).');
            return;
        }
        if (!file.name.toLowerCase().endsWith('.txt')) {
            setError('Use a text file in this slice. Photo and PDF input arrive in the next slice.');
            return;
        }
        const text = await file.text();
        if (policy)
            setPolicyText(text);
        else
            setReceiptText(text);
    }
    function showPassage(id: string) { setFlash(id); document.getElementById(`passage-${id}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' }); setTimeout(() => setFlash(null), 2000); }
    const { case: state, result } = store;
    return <><header><strong>ReturnWindow</strong>{simulated && <span className="chip">Simulated today: {formatLong(simulated)}</span>}{state.sample && <span className="chip">Synthetic sample</span>}</header>
    {!state.receipt ? <main><h1>Know the last day to return each item, and the policy line that proves it.</h1><div className="inputs"><section className="panel"><h2>Receipt</h2><label>Receipt text<textarea value={receiptText} onChange={e => setReceiptText(e.target.value)}/></label><label>Receipt .txt file<input type="file" accept=".txt,text/plain" onChange={e => void readText(e.target.files?.[0])}/></label></section><section className="panel"><h2>Store return policy</h2><label>Paste the store's policy text<textarea value={policyText} onChange={e => setPolicyText(e.target.value)}/></label><label>Policy .txt file<input type="file" accept=".txt,text/plain" onChange={e => void readText(e.target.files?.[0], true)}/></label><label>Policy label<input value={label} maxLength={120} onChange={e => setLabel(e.target.value)}/></label><label>Copied on<input type="date" value={captured} onChange={e => setCaptured(e.target.value as typeof captured)}/></label></section></div><button onClick={() => void load(receiptText, policyText)}>See item deadlines</button> <button onClick={() => void sample()}>Try the sample</button></main> : <main>
      {result.refusal && <div role="alert" className="refusal">{result.refusal.code === 'no_policy' ? "No policy, no deadline. Paste the store's return policy — ReturnWindow doesn't guess store rules." : result.refusal.code === 'no_window_in_policy' ? "We couldn't find a return window (like '30 days') in this text, so no deadlines are shown." : 'Add a receipt to see item deadlines.'}</div>}
      <div className="workspace"><section className="panel"><h2>Receipt</h2><p>Store: {state.receipt.store.value}</p><p>Purchase date: {state.receipt.purchaseDate.value}</p>{state.receipt.purchaseDate.needsCheck && <p className="check">Check this · {state.receipt.purchaseDate.note}</p>}<pre>{receiptText}</pre>{state.receipt.warnings.map((w, i) => <p role="status" key={i}>{w.code}</p>)}</section><section aria-label="Deadlines"><h2>Deadlines</h2>{result.questions[0] && <div className="panel question"><p>{result.questions[0].prompt}</p></div>}{result.items.map(r => { const item = state.receipt!.items.find(i => i.id === r.itemId)!; return <article key={r.itemId} data-item={r.itemId} className={`panel item ${r.outcome.status}`}><h3>{item.description.value}</h3><span className="chip">{item.category.value}</span><p className="date">{result.refusal ? 'No deadline computed.' : outcomeText(r.outcome)}</p>{r.daysLeft !== null && <p>{r.daysLeft < 0 ? `Closed ${-r.daysLeft} days ago` : r.daysLeft === 0 ? 'Last day today' : `in ${r.daysLeft} days`}</p>}{r.outcome.status === 'computed' && <p>{r.outcome.window.amount} {r.outcome.window.unit.replace('_', ' ')} from {r.outcome.start.basis} ({formatLong(r.outcome.start.date)}) · passage {passageNumber(r.outcome.clauseId)}</p>}{('clauseId' in r.outcome ? [r.outcome.clauseId] : r.outcome.status === 'conflict' ? r.outcome.clauseIds : []).map(id => <button key={id} onClick={() => showPassage(id)}>Show passage {passageNumber(id)}</button>)}</article>; })}</section>{state.policy ? <PolicyPanel policy={state.policy} result={result} flash={flash}/> : <section className="panel"><h2>Policy</h2><p>No policy supplied.</p></section>}</div><p className="convention">{DATE_CONVENTION}</p><div className="actions"><button disabled title="Coming in a later slice">Download reminders (.ics) (coming in a later slice)</button><button disabled>Evidence pack (coming in a later slice)</button><button onClick={() => { if (confirm('Start over and clear this case?'))
            dispatch({ type: 'reset', now: now() }); }}>Start over</button></div></main>}
    {error && <p role="alert" className="refusal">{error}</p>}<footer><p>Runs entirely in your browser. Nothing is uploaded. Not legal advice.</p><p>Extraction: on-device OCR (Tesseract LSTM) + deterministic rules. No generative AI model is used to compute deadlines.</p><p>This slice accepts text. On-device image and PDF extraction arrive in the next slice.</p></footer></>;
}
