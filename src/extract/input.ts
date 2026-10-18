import type { OcrDocument, ReceiptExtraction } from '../domain/types';
export function documentFromText(text: string): OcrDocument {
    return { source: 'pasted-text', engine: null, imageSize: null, lines: text.replace(/\r\n?/g, '\n').split('\n').map(text => ({ text, confidence: 100, bbox: null, words: [] })) };
}
export function routeFile(file: File): 'image' | 'pdf' | 'text' | 'unsupported' {
    const extension = file.name.toLowerCase().split('.').at(-1);
    if (['png', 'jpg', 'jpeg', 'webp'].includes(extension ?? '') && (!file.type || ['image/png','image/jpeg','image/webp'].includes(file.type))) return 'image';
    if (extension === 'pdf' && (!file.type || file.type === 'application/pdf')) return 'pdf';
    if (extension === 'txt' && (!file.type || file.type === 'text/plain')) return 'text';
    return 'unsupported';
}
export function receiptIsUnreadable(doc: OcrDocument, receipt: ReceiptExtraction): boolean {
    const confidence = doc.lines.length ? doc.lines.reduce((sum,line)=>sum+line.confidence,0)/doc.lines.length : 0;
    return confidence < 40 || (!receipt.purchaseDate.value && !receipt.items.length);
}
