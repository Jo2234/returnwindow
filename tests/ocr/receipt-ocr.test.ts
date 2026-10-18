import { expect, it } from 'vitest';
import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { recognizeDocument } from '../../src/extract/ocr';
import { documentFromPdfItems } from '../../src/extract/pdf';
import { receiptIsUnreadable } from '../../src/extract/input';
import { parseReceipt } from '../../src/domain/receipt-parser';
import type { OcrDocument, ReceiptExtraction } from '../../src/domain/types';
const fixtures=new URL('../../fixtures/receipts/',import.meta.url);
const localData=fileURLToPath(new URL('../../public/ocr/',import.meta.url));
const normalize=(value:string|null)=>(value??'').replace(/\s+/g,' ').trim();
async function measured<T>(name:string,run:()=>Promise<T>):Promise<T>{
    const load=execFileSync('uptime',{encoding:'utf8'}).trim(),start=performance.now();
    try{return await run();}finally{console.log(`${name}: wallMs=${Math.round(performance.now()-start)}; uptime=${load}`);}
}
async function image(name:string):Promise<OcrDocument>{
    const bytes=await fs.readFile(new URL(name,fixtures));
    return recognizeDocument(bytes,{width:bytes.readUInt32BE(16),height:bytes.readUInt32BE(20)},{langPath:localData,cacheMethod:'none',gzip:true},()=>{},new AbortController().signal);
}
function exactReceipt(receipt:ReceiptExtraction):void {
    expect(normalize(receipt.store.value)).toBe('JUNIPER LANE GOODS');
    expect(receipt.purchaseDate.value).toBe('2026-10-08');
    expect(receipt.items).toHaveLength(4);
    expect(receipt.items.map(item=>[normalize(item.description.value),item.amountCents.value,item.quantity])).toEqual([
        ['Wireless Earbuds',8900,1],['Linen Shirt (M)',4590,1],['Stoneware Mug',1850,1],['Wool Scarf CLEARANCE FINAL SALE',1200,1],
    ]);
    expect(receipt.totalCents.value).toBe(16540);
}
it('O1 real clean-image OCR extracts the exact four items and amounts',async()=>measured('O1',async()=>{
    const doc=await image('receipt-demo-clean.png');exactReceipt(parseReceipt(doc));
    expect(doc.engine?.version).toBe('7.0.0');expect(doc.lines.some(line=>line.words.length>0&&line.bbox)).toBe(true);
}),120000);
it('O2 real messy OCR matches the recorded golden and is wrong or flagged',async()=>measured('O2',async()=>{
    const golden=JSON.parse(await fs.readFile(new URL('receipt-demo-messy.ocr-golden.json',fixtures),'utf8'));
    const doc=await image('receipt-demo-messy.png');
    expect(doc.lines.map(line=>line.text)).toEqual(golden.lines.map((line:{text:string})=>line.text));
    expect(doc.engine?.langDataVersion).toBe(golden.langDataVersion);
    const receipt=parseReceipt(doc);
    expect(receipt.purchaseDate.value!=='2026-10-08'||receipt.purchaseDate.needsCheck).toBe(true);
    console.log(`O2 actual purchaseDate=${receipt.purchaseDate.value}; confidence=${receipt.purchaseDate.confidence}; needsCheck=${receipt.purchaseDate.needsCheck}; raw=${receipt.purchaseDate.raw}`);
}),120000);
it('O3 real PDF text layer gives exact clean extraction at confidence 100',async()=>measured('O3',async()=>{
    // PDF.js's legacy build is the Node-supported adapter; grouping is shared with the browser.
    const pdfjs=await import('pdfjs-dist/legacy/build/pdf.mjs');
    const task=pdfjs.getDocument({data:new Uint8Array(await fs.readFile(new URL('receipt-demo.pdf',fixtures))),disableFontFace:true,useSystemFonts:false});
    try{const pdf=await task.promise,page=await pdf.getPage(1),content=await page.getTextContent();
        const doc=documentFromPdfItems(content.items.filter((item):item is import('pdfjs-dist/types/src/display/api').TextItem=>'str'in item));
        const receipt=parseReceipt(doc);exactReceipt(receipt);
        expect(doc.lines.every(line=>line.confidence===100)).toBe(true);
        expect(receipt.store.confidence).toBe(100);expect(receipt.purchaseDate.confidence).toBe(100);
        expect(receipt.items.every(item=>item.description.confidence===100&&item.amountCents.confidence===100)).toBe(true);
    }finally{await task.destroy();}
}),120000);
it('O4 real blank-image OCR enters receipt_failed, never a guessed receipt',async()=>measured('O4',async()=>{
    const doc=await image('blank.png');expect(receiptIsUnreadable(doc,parseReceipt(doc))).toBe(true);
    expect(parseReceipt(doc).items).toHaveLength(0);expect(parseReceipt(doc).purchaseDate.value).toBeNull();
}),120000);
