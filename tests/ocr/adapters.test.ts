import { beforeEach, expect, it, vi } from 'vitest';
import type { Page } from 'tesseract.js';
import type { TextItem } from 'pdfjs-dist/types/src/display/api';
const create=vi.hoisted(()=>vi.fn());
vi.mock('tesseract.js',()=>({createWorker:create,OEM:{LSTM_ONLY:1},PSM:{SINGLE_BLOCK:'6'}}));
import { documentFromText, receiptIsUnreadable, routeFile } from '../../src/extract/input';
import { documentFromOcr, recognizeDocument } from '../../src/extract/ocr';
import { documentFromPdfItems } from '../../src/extract/pdf';
import { parseReceipt } from '../../src/domain/receipt-parser';
const bbox={x0:10,y0:20,x1:110,y1:40};
const page={blocks:[{paragraphs:[{lines:[{text:'Shirt 12.00\n',confidence:62,bbox,words:[{text:'Shirt',confidence:55,bbox},{text:'12.00',confidence:69,bbox}]}]}]}]} as unknown as Page;
const worker=()=>({setParameters:vi.fn().mockResolvedValue({}),recognize:vi.fn().mockResolvedValue({data:page}),terminate:vi.fn().mockResolvedValue({})});
beforeEach(()=>{create.mockReset();});
it('routes only supported extensions and matching declared media types',()=>{
 expect(routeFile(new File([''],'receipt.PNG',{type:'image/png'}))).toBe('image');
 expect(routeFile(new File([''],'receipt.webp',{type:'image/webp'}))).toBe('image');
 expect(routeFile(new File([''],'receipt.pdf',{type:'application/pdf'}))).toBe('pdf');
 expect(routeFile(new File([''],'receipt.txt',{type:'text/plain'}))).toBe('text');
 expect(routeFile(new File([''],'receipt.png',{type:'text/html'}))).toBe('unsupported');
 expect(routeFile(new File([''],'receipt.svg',{type:'image/svg+xml'}))).toBe('unsupported');
});
it('text conversion retains confidence 100 and normalizes only newlines',()=>{
 const doc=documentFromText('A\r\n B\rC');expect(doc.lines.map(l=>[l.text,l.confidence,l.bbox])).toEqual([['A',100,null],[' B',100,null],['C',100,null]]);expect(doc.source).toBe('pasted-text');
});
it('maps actual line/word confidences and boxes without substituting values',()=>{
 const doc=documentFromOcr(page,{width:600,height:800});
 expect(doc.lines).toEqual([{text:'Shirt 12.00',confidence:62,bbox,words:[{text:'Shirt',confidence:55,bbox},{text:'12.00',confidence:69,bbox}]}]);
 expect(doc.imageSize).toEqual({width:600,height:800});
 expect(doc.lines[0]!.bbox).not.toBe(bbox);
 expect(parseReceipt(doc).items[0]!.description).toMatchObject({confidence:62,needsCheck:true});
});
it('groups PDF items by y tolerance and x order, confidence 100',()=>{
 const item=(str:string,x:number,y:number)=>({str,transform:[1,0,0,1,x,y],width:20,height:12,dir:'ltr',fontName:'f1',hasEOL:false}) as TextItem;
 const doc=documentFromPdfItems([item('08/10/2026',90,399),item('TOTAL 12.00',0,350),item('Order date:',0,400)]);
 expect(doc.source).toBe('pdf-text');expect(doc.lines.map(l=>[l.text,l.confidence])).toEqual([['Order date: 08/10/2026',100],['TOTAL 12.00',100]]);
});
it('refuses low confidence or no date and no items, while preserving manual recovery',()=>{
 const doc=documentFromText('JUNIPER LANE GOODS\nOrder date: 08/10/2026\nShirt 12.00');
 expect(receiptIsUnreadable(doc,parseReceipt(doc))).toBe(false);
 const low=structuredClone(doc);low.lines.forEach(l=>l.confidence=39);expect(receiptIsUnreadable(low,parseReceipt(low))).toBe(true);
 const blank=documentFromText('');expect(receiptIsUnreadable(blank,parseReceipt(blank))).toBe(true);
});
it('pre-cancelled work never starts a worker',async()=>{
 const controller=new AbortController();controller.abort();await expect(recognizeDocument(new Blob(),null,{},()=>{},controller.signal)).rejects.toMatchObject({name:'AbortError'});expect(create).not.toHaveBeenCalled();
});
it('requests block output, disables caches and terminates a successful worker',async()=>{
 const w=worker();create.mockResolvedValue(w);
 const doc=await recognizeDocument(new Blob(),{width:600,height:800},{langPath:'/local-model'},()=>{},new AbortController().signal);
 expect(create).toHaveBeenCalledWith('eng',1,expect.objectContaining({langPath:'/local-model',cacheMethod:'none',legacyCore:false}));
 expect(w.recognize).toHaveBeenCalledWith(expect.any(Blob),{}, {text:true,blocks:true});expect(doc.lines[0]!.text).toBe('Shirt 12.00');expect(w.terminate).toHaveBeenCalledTimes(1);
});
it('cancellation terminates a ready worker and suppresses late progress/results',async()=>{
 const w=worker();let resolveResult:(value:unknown)=>void=()=>{};
 w.recognize.mockImplementation(()=>new Promise(resolve=>{resolveResult=resolve;}));create.mockResolvedValue(w);
 const controller=new AbortController(),progress=vi.fn();
 const reading=recognizeDocument(new Blob(),null,{},progress,controller.signal);
 await vi.waitFor(()=>expect(w.recognize).toHaveBeenCalled());controller.abort();
 await expect(reading).rejects.toMatchObject({name:'AbortError'});expect(w.terminate).toHaveBeenCalledTimes(1);
 create.mock.calls[0]![2].logger({status:'recognizing text',progress:1});resolveResult({data:page});await Promise.resolve();expect(progress).not.toHaveBeenCalled();
});
it('cancellation during initialization terminates the worker as soon as creation resolves',async()=>{
 const w=worker();let resolveWorker:(value:unknown)=>void=()=>{};create.mockImplementation(()=>new Promise(resolve=>{resolveWorker=resolve;}));
 const controller=new AbortController(),reading=recognizeDocument(new Blob(),null,{},()=>{},controller.signal);controller.abort();
 await expect(reading).rejects.toMatchObject({name:'AbortError'});resolveWorker(w);
 await vi.waitFor(()=>expect(w.terminate).toHaveBeenCalledTimes(1));expect(w.recognize).not.toHaveBeenCalled();
});
