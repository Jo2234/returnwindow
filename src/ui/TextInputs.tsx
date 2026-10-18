import type { CivilDate } from '../domain/types';
export interface PolicyInputProps {
    text: string;
    onText: (text: string) => void;
    label: string;
    onLabel: (label: string) => void;
    captured: string;
    onCaptured: (date: CivilDate) => void;
    onFile: (file: File | undefined, policy: boolean) => void;
}
export function PolicyInputs(p: PolicyInputProps) {
    return <><label>Paste the store's policy text<textarea value={p.text} onChange={e => p.onText(e.target.value)}/></label><label>Policy .txt file<input type="file" accept=".txt,text/plain" onChange={e => p.onFile(e.target.files?.[0], true)}/></label><label>Policy label<input value={p.label} maxLength={120} onChange={e => p.onLabel(e.target.value)}/></label><label>Copied on<input type="date" min="1900-01-01" max="2199-12-31" value={p.captured} onChange={e => p.onCaptured(e.target.value as CivilDate)}/></label></>;
}
export function TextInputs({ receipt, onReceipt, onSubmit, onSample, policy }: {
    receipt: string;
    onReceipt: (value: string) => void;
    onSubmit: () => void;
    onSample: () => void;
    policy: PolicyInputProps;
}) {
    return <><h1>Know the last day to return each item, and the policy line that proves it.</h1><div className="inputs"><section className="panel"><h2>Receipt</h2><p>Paste receipt text or choose a .txt file.</p><label>Receipt text<textarea value={receipt} onChange={e => onReceipt(e.target.value)}/></label><label>Receipt .txt file<input type="file" accept=".txt,text/plain" onChange={e => policy.onFile(e.target.files?.[0], false)}/></label></section><section className="panel"><h2>Store return policy</h2><PolicyInputs {...policy}/></section></div><button onClick={onSubmit}>See item deadlines</button><button onClick={onSample}>Try the sample</button></>;
}
