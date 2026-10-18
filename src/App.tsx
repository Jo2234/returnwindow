import { useEffect, useRef, useState } from 'react';
import type { CaseState, CivilDate, Correction, OcrDocument, PolicyDoc } from './domain/types';
import { parseCivilDate, formatLong, todayInSingapore } from './domain/civil-date';
import { extractedField, parseAmount, parseDateToken, parseReceipt } from './domain/receipt-parser';
import { documentFromText, routeFile, receiptIsUnreadable } from './extract/input';
import { recognizeImage } from './extract/ocr';
import { readPdf } from './extract/pdf';
import { analysePolicy } from './domain/policy-parser';
import { applyCorrection, displayDate } from './domain/corrections';
import { questionFor } from './domain/questions';
import { DATE_CONVENTION } from './domain/engine';
import { emptyCase, useCaseStore } from './state/case-store';
import { PolicyPanel } from './ui/PolicyPanel';
import { ItemCard } from './ui/ItemCard';
import { ReceiptPanel } from './ui/ReceiptPanel';
import { QuestionCard } from './ui/QuestionCard';
import { PolicyInputs, TextInputs } from './ui/TextInputs';
export default function App() {
    const simulated = parseCivilDate(new URLSearchParams(location.search).get('today') ?? '');
    const now = () => simulated ? new Date(`${simulated}T04:00:00Z`) : new Date();
    const [store, dispatch] = useCaseStore(now());
    const [receiptText, setReceiptText] = useState(''), [policyText, setPolicyText] = useState('');
    const [label, setLabel] = useState('Store return policy'), [captured, setCaptured] = useState(todayInSingapore(now()));
    const [error, setError] = useState(''), [flash, setFlash] = useState<string | null>(null), [showChanges, setShowChanges] = useState(false);
    const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
    const [reading,setReading]=useState<{status:string;progress:number}|null>(null);
    const [receiptImage,setReceiptImage]=useState<string|null>(null);
    const [failed,setFailed]=useState<{message:string;document:OcrDocument|null}|null>(null);
    const extraction=useRef<{id:number;controller:AbortController|null;imageUrl:string|null}>({id:0,controller:null,imageUrl:null});
    useEffect(()=>()=>{extraction.current.id++;extraction.current.controller?.abort();if(extraction.current.imageUrl)URL.revokeObjectURL(extraction.current.imageUrl);},[]);
    const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const { case: state, result, previousResult } = store;
    const editingClause = state.policy?.clauses.find(c => `clock:${c.id}` === editingQuestionId);
    const activeQuestion = editingClause ? questionFor(editingClause, state.receipt?.items.filter(i => result.items.some(r => r.itemId === i.id && 'clauseId' in r.outcome && r.outcome.clauseId === editingClause.id)) ?? [], state.receipt?.purchaseDate.value ?? null) : result.questions[0];
    const changedCount = result.items.filter(r => { const previous = previousResult?.items.find(p => p.itemId === r.itemId); return previous && JSON.stringify(previous.outcome) !== JSON.stringify(r.outcome); }).length;
    useEffect(() => {
        setShowChanges(true);
        const timer = setTimeout(() => setShowChanges(false), 6000);
        return () => clearTimeout(timer);
    }, [store.revision]);
    useEffect(() => () => { if (flashTimer.current)
        clearTimeout(flashTimer.current); }, []);
    async function makePolicy(text: string): Promise<PolicyDoc | null> {
        if (text.length > 50000)
            throw new Error('That policy is too long (max 50,000 characters).');
        const capturedOn = parseCivilDate(captured);
        if (!capturedOn)
            throw new Error('Use a real date, e.g. 08/10/2026.');
        const normalized = text.replace(/\r\n?/g, '\n');
        if (!normalized.trim())
            return null;
        const sha = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(normalized)))).map(b => b.toString(16).padStart(2, '0')).join('');
        return analysePolicy(label.trim().slice(0, 120) || 'Store return policy', normalized, capturedOn, sha);
    }
    const replace = (state: CaseState) => dispatch({ type: 'replace', state, now: now() });
    function releaseImage(){if(extraction.current.imageUrl)URL.revokeObjectURL(extraction.current.imageUrl);extraction.current.imageUrl=null;setReceiptImage(null);}
    function stopExtraction():number {
        const current=extraction.current;current.id++;current.controller?.abort();current.controller=null;
        releaseImage();setReading(null);return current.id;
    }
    function beginExtraction():{id:number;controller:AbortController} {
        const id=stopExtraction(),controller=new AbortController();extraction.current.controller=controller;
        setFailed(null);setError('');dispatch({type:'reset',now:now()});return {id,controller};
    }
    function current(id:number):boolean {return extraction.current.id===id&&!extraction.current.controller?.signal.aborted;}
    async function commitDocument(doc:OcrDocument,policyText:string,sample:boolean,id:number,requireReadable:boolean) {
        const receipt=parseReceipt(doc);
        if(requireReadable&&receiptIsUnreadable(doc,receipt)) {
            if(current(id)){releaseImage();setFailed({message:"We couldn't read enough from this image.",document:doc});setReading(null);}
            return;
        }
        const policy=await makePolicy(policyText);if(!current(id))return;
        const state=emptyCase();state.policy=policy;state.sample=sample;state.receiptOcr=doc;state.receipt=receipt;
        setReceiptText(doc.lines.map(line=>line.text).join('\n'));setError('');setReading(null);setFailed(null);replace(state);
    }
    async function load(receipt:string,policy:string,sample=false) {
        const {id}=beginExtraction();
        try{await commitDocument(documentFromText(receipt),policy,sample,id,false);}
        catch(e){if(current(id))setError(e instanceof Error?e.message:'The text could not be read. Try again.');}
    }
    async function extractFile(file:File,policy:string,sample:boolean,id:number,controller:AbortController) {
        const route=routeFile(file);
        if(file.size>15*1024*1024)throw new Error('That file is too large (max 15 MB).');
        if(route==='unsupported')throw new Error("That file type isn't supported. Use PNG, JPG, WebP, PDF or text.");
        if(route==='image') {
            const url=URL.createObjectURL(file);if(!current(id)){URL.revokeObjectURL(url);return;}
            extraction.current.imageUrl=url;setReceiptImage(url);
        }
        setReading({status:route==='pdf'?'Reading PDF on this device…':'Reading receipt on this device…',progress:0});
        const onProgress=(p:{status:string;progress:number})=>{if(current(id))setReading({status:p.status==='recognizing text'?'Reading receipt on this device…':p.status,progress:p.progress});};
        const doc=route==='image'?await recognizeImage(file,onProgress,controller.signal):route==='pdf'?await readPdf(file,controller.signal):documentFromText(await file.text());
        if(current(id))await commitDocument(doc,policy,sample,id,route!=='text');
    }
    async function sample() {
        const {id,controller}=beginExtraction();setReading({status:'Loading the synthetic sample…',progress:0});
        try {
            const [imageResponse,policyResponse]=await Promise.all(['/samples/receipt-demo-messy.png','/samples/policy-demo.txt'].map(url=>fetch(url,{signal:controller.signal})));
            if(!imageResponse!.ok||!policyResponse!.ok)throw new Error('The sample could not be loaded. Paste the text instead.');
            const [blob,policy]=await Promise.all([imageResponse!.blob(),policyResponse!.text()]);if(!current(id))return;
            setPolicyText(policy);await extractFile(new File([blob],'receipt-demo-messy.png',{type:'image/png'}),policy,true,id,controller);
        }catch(e){if(current(id)){releaseImage();setReading(null);setFailed({message:e instanceof Error?e.message:'The sample could not be loaded. Paste the text instead.',document:null});}}
    }
    async function readText(file:File|undefined,policy:boolean) {
        if(!file)return;
        if(policy) {
            try{if(routeFile(file)!=='text')throw new Error('Use a .txt file for the store return policy.');if(file.size>15*1024*1024)throw new Error('That file is too large (max 15 MB).');
                const text=await file.text();if(text.length>50000)throw new Error('That policy is too long (max 50,000 characters).');setPolicyText(text);setError('');
            }catch(e){setError(e instanceof Error?e.message:'The text file could not be read. Paste the text instead.');}return;
        }
        const {id,controller}=beginExtraction();
        try{await extractFile(file,policyText,false,id,controller);}
        catch(e){if(current(id)){releaseImage();setReading(null);setFailed({message:e instanceof Error?e.message:'The receipt could not be read. Paste the text instead.',document:null});}}
    }
    function cancelReading(){stopExtraction();setFailed(null);setError('');}
    function pasteRecovery(){const doc=failed?.document;stopExtraction();setFailed(null);if(doc)setReceiptText(doc.lines.map(line=>line.text).join('\n'));requestAnimationFrame(()=>document.querySelector<HTMLTextAreaElement>('textarea')?.focus());}
    function prepareCorrection(current: CaseState, target: Correction['target'], input: unknown): {
        state: CaseState;
    } | {
        error: string;
    } {
        let value = input, to = String(input);
        if (target.field === 'purchaseDate' || target.field === 'deliveryDate') {
            const date = typeof input === 'string' ? (parseCivilDate(input) ?? parseDateToken(input)?.date) : null;
            if (!date)
                return { error: 'Use a real date, e.g. 08/10/2026.' };
            value = date;
            to = displayDate(date)!;
        }
        if (target.field === 'item.amountCents' && typeof input === 'string') {
            const amount = parseAmount(input);
            if (!amount || amount.repaired)
                return { error: 'Enter an amount like 12.00.' };
            value = amount.cents;
            to = (amount.cents / 100).toFixed(2);
        }
        const applied = applyCorrection(current, { target, to, at: now().toISOString() }, value);
        if ('state' in applied)
            return applied;
        return { error: applied.error.code === 'delivery_before_purchase' ? `Delivery can't be before the purchase date (${current.receipt?.purchaseDate.value ?? ''}).` : applied.error.code === 'invalid_date' ? 'Use a real date, e.g. 08/10/2026.' : applied.error.code === 'invalid_amount' ? 'Enter an amount like 12.00.' : applied.error.code === 'unknown_item' ? 'This item could not be found.' : 'Enter a value before saving.' };
    }
    function correct(target: Correction['target'], value: unknown): string | null {
        const applied = prepareCorrection(state, target, value);
        if ('error' in applied)
            return applied.error;
        setError('');
        replace(applied.state);
        return null;
    }
    function answer(choice: 'purchase' | 'delivery' | 'unsure', delivery?: string): string | null {
        const question = activeQuestion;
        if (!question)
            return null;
        let current = state;
        if (choice === 'delivery') {
            const applied = prepareCorrection(current, { field: 'deliveryDate' }, delivery ?? '');
            if ('error' in applied)
                return applied.error;
            current = applied.state;
        }
        if (question.kind === 'clock_start') {
            const applied = prepareCorrection(current, { field: 'answer', questionId: question.id }, choice);
            if ('error' in applied)
                return applied.error;
            current = applied.state;
        }
        setError('');
        setEditingQuestionId(null);
        replace(current);
        return null;
    }
    function showPassage(id: string) {
        setFlash(id);
        const element = document.getElementById(`passage-${id}`);
        element?.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
        element?.focus({ preventScroll: true });
        if (flashTimer.current)
            clearTimeout(flashTimer.current);
        flashTimer.current = setTimeout(() => setFlash(null), 2000);
    }
    function addItem() { if (!state.receipt)
        return; const next = structuredClone(state), id = `item-${Math.max(0, ...next.receipt!.items.map(i => Number(i.id.slice(5)))) + 1}`; next.receipt!.items.push({ id, description: extractedField('New item'), amountCents: extractedField(0), quantity: 1, category: { value: 'other', origin: 'default', keyword: null }, marker: { finalSale: false, keyword: null } }); replace(next); }
    async function updatePolicy() { try {
        const policy = await makePolicy(policyText);
        setError('');
        setEditingQuestionId(null);
        replace({ ...state, policy, answers: policy?.sha256 === state.policy?.sha256 ? state.answers : [] });
    }
    catch (e) {
        setError(e instanceof Error ? e.message : 'Policy could not be read.');
    } }
    function startOver() { if (confirm('Start over and clear this case?')) {
        stopExtraction();setFailed(null);
        dispatch({ type: 'reset', now: now() });
        setReceiptText('');
        setPolicyText('');
        setError('');
        setFlash(null);
        setEditingQuestionId(null);
    } }
    const policyInputs = { text: policyText, onText: setPolicyText, label, onLabel: setLabel, captured, onCaptured: setCaptured, onFile: (file: File | undefined, policy: boolean) => void readText(file, policy) };
    return <>
    <header><strong>ReturnWindow</strong>{simulated && <span className="chip">Simulated today: {formatLong(simulated)}</span>}{state.sample && <span className="chip">Synthetic sample</span>}</header>
    <main>
      {error && <p role="alert" className="refusal">{error}</p>}
      {reading?<section className="panel" aria-label="Reading receipt">{receiptImage&&<img src={receiptImage} alt="Receipt being read" style={{maxWidth:260,maxHeight:300}}/>}<p role="status">{reading.status} {Math.round(reading.progress*100)}%</p><progress aria-label="Receipt reading progress" value={reading.progress} max={1}/><button onClick={cancelReading}>Cancel</button><label>Replace receipt<input data-receipt-file type="file" accept="image/png,image/jpeg,image/webp,application/pdf,text/plain,.txt" onChange={e=>void readText(e.target.files?.[0],false)}/></label></section>:<>
      {failed&&<section className="panel refusal" role="alert" data-state="receipt_failed"><h2>{failed.message}</h2><button onClick={()=>document.querySelector<HTMLInputElement>('input[data-receipt-file]')?.click()}>Try another image</button><button onClick={pasteRecovery}>Paste the text instead</button><button onClick={()=>void load('',policyText)}>Enter details manually</button></section>}
      {!state.receipt ? <TextInputs receipt={receiptText} onReceipt={setReceiptText} onSubmit={() => void load(receiptText, policyText)} onSample={() => void sample()} policy={policyInputs}/> : <>
        {result.refusal && <div role="alert" className="refusal">{result.refusal.code === 'no_policy' ? "No policy, no deadline. Paste the store's return policy — ReturnWindow doesn't guess store rules." : result.refusal.code === 'no_window_in_policy' ? "We couldn't find a return window (like '30 days') in this text, so no deadlines are shown." : 'Add a receipt to see item deadlines.'}</div>}
        <div className="workspace">
          <ReceiptPanel state={state} onCorrect={correct} onAddItem={addItem} imageUrl={receiptImage} onFile={file=>void readText(file,false)}/>
          <section aria-label="Deadlines"><h2>Deadlines</h2>{activeQuestion && <QuestionCard key={`${activeQuestion.id}:${editingQuestionId ?? ''}`} question={activeQuestion} count={editingClause ? 1 : result.questions.length} onAnswer={answer}/>}
            {result.items.map(r => <ItemCard key={r.itemId} item={state.receipt!.items.find(i => i.id === r.itemId)!} result={r} previous={showChanges ? previousResult?.items.find(p => p.itemId === r.itemId) : undefined} refused={!!result.refusal} onCategory={value => { const error = correct({ field: 'item.category', itemId: r.itemId }, value); if (error)
            setError(error); }} onPassage={showPassage}/>)}
          </section>
          <div>{state.policy ? <PolicyPanel policy={state.policy} result={result} flash={flash}/> : <section className="panel"><h2>Policy</h2><p>No policy supplied.</p></section>}<details className="panel"><summary>Edit policy</summary><PolicyInputs {...policyInputs}/><button onClick={() => void updatePolicy()}>Apply policy</button><button className="subtle" onClick={() => { setPolicyText(''); replace({ ...state, policy: null, answers: [] }); }}>Remove policy</button></details></div>
        </div>
        <div aria-live="polite" className="announcement">{showChanges && changedCount > 0 ? `${changedCount} ${changedCount === 1 ? 'deadline' : 'deadlines'} updated` : ''}</div>
        <details className="panel changes"><summary>Changes ({state.corrections.length}) and answers</summary>{state.corrections.map(c => <p key={c.id}>{c.target.field}: {c.from ?? 'Not provided'} → {c.to}</p>)}{state.answers.map(a => <p key={a.questionId}>{a.questionId}: {a.choice} <button className="subtle" onClick={() => { setEditingQuestionId(a.questionId); }}>Change answer</button></p>)}</details>
        <p className="convention">{DATE_CONVENTION}</p><div className="actions"><button disabled title="Coming in a later slice">Download reminders (.ics) (coming in a later slice)</button><button disabled>Evidence pack (coming in a later slice)</button><button onClick={startOver}>Start over</button></div>
      </>}
      </>}
    </main>
    <footer><p>Runs entirely in your browser. Nothing is uploaded. Not legal advice.</p><p>Extraction: on-device OCR (Tesseract LSTM) + deterministic rules. No generative AI model is used to compute deadlines.</p></footer>
  </>;
}
