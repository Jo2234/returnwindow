import type { CaseState, Correction, Field } from '../domain/types';
import { EditableField } from './EditableField';
import { useRef } from 'react';
export function ReceiptPanel({ state, onCorrect, onAddItem, imageUrl, onFile, restored }: {
    state: CaseState;
    onCorrect: (target: Correction['target'], value: unknown) => string | null;
    onAddItem: () => void;
    imageUrl?: string|null;
    onFile?: (file:File|undefined)=>void;
    restored?: boolean;
}) {
    const dialog = useRef<HTMLDialogElement>(null);
    const receipt = state.receipt!;
    const doc=state.receiptOcr, size=doc?.imageSize;
    const indices=new Set([receipt.store.lineIndex,receipt.purchaseDate.lineIndex,...receipt.items.map(item=>item.description.lineIndex)]);
    const itemsCents = receipt.items.reduce((sum, item) => sum + (item.amountCents.value ?? 0), 0);
    const warnings = receipt.warnings.filter(w => w.code !== 'items_total_mismatch' && (w.code !== 'no_date_found' || !receipt.purchaseDate.value) && (w.code !== 'multiple_dates_found' || receipt.purchaseDate.origin !== 'corrected') && (w.code !== 'no_items_found' || !receipt.items.length));
    if (receipt.totalCents.value !== null && Math.abs(itemsCents - receipt.totalCents.value) > 1)
        warnings.push({ code: 'items_total_mismatch', itemsCents, totalCents: receipt.totalCents.value });
    const edit = (label: string, field: Field<string>, target: Correction['target']) => <EditableField label={label} value={field.value ?? ''} check={field.needsCheck} note={field.note} onSave={value => onCorrect(target, value)}/>;
    const imageFigure = (full: boolean) => <figure className={full ? 'full-receipt' : 'receipt-preview'}><img src={imageUrl!} alt={state.sample?'Synthetic Juniper Lane Goods receipt':'Receipt image'}/>{size&&<svg aria-label="Extracted receipt field boxes" role="img" viewBox={`0 0 ${size.width} ${size.height}`}><title>Extracted store, purchase date and item lines</title>{doc?.lines.map((line,index)=>line.bbox&&indices.has(index)?<rect key={index} data-ocr-box x={line.bbox.x0} y={line.bbox.y0} width={line.bbox.x1-line.bbox.x0} height={line.bbox.y1-line.bbox.y0} fill="none" stroke="#2647d0" strokeWidth={2}><title>{line.text}</title></rect>:null)}</svg>}</figure>;
    return <section className="panel receipt-panel" aria-label="Receipt" onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();onFile?.(e.dataTransfer.files[0]);}}><h2>Receipt</h2>
    {imageUrl&&<><div className="receipt-preview-row">{imageFigure(false)}<div><p>Compare the highlighted fields with your receipt.</p><button className="subtle" onClick={()=>dialog.current?.showModal()}>View full receipt</button></div></div><dialog ref={dialog} aria-label="Full receipt image"><button className="subtle" onClick={()=>dialog.current?.close()}>Close full receipt</button>{imageFigure(true)}</dialog></>}
    {restored&&!imageUrl&&state.receiptOcr?.source!=='pasted-text'&&<p className="restore-note">The receipt image isn't kept after reload; the extracted text and evidence are.</p>}
    {edit('Store', receipt.store, { field: 'store' })}{edit('Purchase date', receipt.purchaseDate, { field: 'purchaseDate' })}{edit('Delivery date', state.deliveryDate, { field: 'deliveryDate' })}
  <details className="item-details"><summary>Edit {receipt.items.length} item details</summary>{receipt.items.map((item, index) => <div key={item.id} className="receipt-item"><h3>Item {index + 1}</h3>{edit(`Item ${index + 1} description`, item.description, { field: 'item.description', itemId: item.id })}<EditableField label={`Item ${index + 1} amount (SGD)`} value={item.amountCents.value === null ? '' : (item.amountCents.value / 100).toFixed(2)} check={item.amountCents.needsCheck} note={item.amountCents.note} onSave={value => onCorrect({ field: 'item.amountCents', itemId: item.id }, value)}/></div>)}</details>
  {!receipt.items.length && <p>No items found — add them manually</p>}<button className="subtle" onClick={onAddItem}>Add item</button>
  {warnings.length > 0 && <details open><summary>Check the receipt</summary>{warnings.map((w, i) => <p key={i}>{w.code === 'items_total_mismatch' ? `Items total SGD ${(w.itemsCents / 100).toFixed(2)} differs from receipt total SGD ${(w.totalCents / 100).toFixed(2)}.` : w.code === 'multiple_dates_found' ? 'Several dates found. Please check the purchase date.' : w.code === 'no_date_found' ? 'No purchase date found. Add it above.' : w.code === 'no_items_found' ? 'No items found in the receipt text.' : `Low reading confidence (${w.meanConfidence.toFixed(0)}%).`}</p>)}</details>}
  <details><summary>Receipt source text</summary><pre>{state.receiptOcr?.lines.map(l => l.text).join('\n')}</pre></details>{onFile&&<label className="replace-file">Replace receipt<input data-receipt-file type="file" accept="image/png,image/jpeg,image/webp,application/pdf,text/plain,.txt" onChange={e=>onFile(e.target.files?.[0])}/></label>}</section>;
}
