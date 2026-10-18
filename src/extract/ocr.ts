import { createWorker, OEM, PSM } from 'tesseract.js';
import type { Page, Worker, WorkerOptions } from 'tesseract.js';
import type { OcrDocument } from '../domain/types';
export const OCR_ENGINE = { name: 'tesseract.js' as const, version: '7.0.0', lang: 'eng' as const, langDataVersion: '@tesseract.js-data/eng@1.0.0/4.0.0' };
export function documentFromOcr(data: Page, imageSize: OcrDocument['imageSize']): OcrDocument {
    return { source: 'image', engine: { ...OCR_ENGINE }, imageSize,
        lines: (data.blocks ?? []).flatMap(block => block.paragraphs.flatMap(paragraph => paragraph.lines.map(line => ({
            text: line.text.replace(/\n$/, ''), confidence: line.confidence, bbox: { ...line.bbox },
            words: line.words.map(word => ({ text: word.text, confidence: word.confidence, bbox: { ...word.bbox } })),
        })))) };
}
function cancelled(): DOMException { return new DOMException('Reading cancelled', 'AbortError'); }
export function throwIfAborted(signal: AbortSignal): void { if(signal.aborted) throw cancelled(); }
// Exported for Node integration checks: they supply local filesystem paths.
// Browser recognition always uses the fixed same-origin options below.
export async function recognizeDocument(image: Parameters<Worker['recognize']>[0], imageSize: OcrDocument['imageSize'], options: Partial<WorkerOptions>, onProgress: (p:{status:string;progress:number})=>void, signal:AbortSignal):Promise<OcrDocument> {
    throwIfAborted(signal);
    let worker:Worker|null=null;
    let terminated=false;
    const terminate=async()=>{if(worker&&!terminated){terminated=true;await worker.terminate();}};
    let rejectAbort:(reason:unknown)=>void=()=>{};
    const abortPromise=new Promise<never>((_resolve,reject)=>{rejectAbort=reject;});
    const abort=()=>{rejectAbort(cancelled());void terminate();};
    signal.addEventListener('abort',abort,{once:true});
    const pending=createWorker('eng',OEM.LSTM_ONLY,{
        ...options,cacheMethod:'none',legacyCore:false,legacyLang:false,
        logger:p=>{if(!signal.aborted)onProgress({status:p.status,progress:p.progress});},
        // Tesseract otherwise throws again after rejecting the active job.
        errorHandler:()=>{},
    }).then(async value=>{worker=value;if(signal.aborted)await terminate();return value;});
    try {
        worker=await Promise.race([pending,abortPromise]);throwIfAborted(signal);
        await Promise.race([worker.setParameters({tessedit_pageseg_mode:PSM.SINGLE_BLOCK,preserve_interword_spaces:'1'}),abortPromise]);
        const result=await Promise.race([worker.recognize(image,{}, {text:true,blocks:true}),abortPromise]);
        throwIfAborted(signal);
        return documentFromOcr(result.data,imageSize);
    } finally {
        signal.removeEventListener('abort',abort);
        await terminate();
    }
}
export async function recognizeImage(file:Blob,onProgress:(p:{status:string;progress:number})=>void,signal:AbortSignal):Promise<OcrDocument> {
    throwIfAborted(signal);
    const bitmap=await createImageBitmap(file);
    const size={width:bitmap.width,height:bitmap.height};
    const canvas=document.createElement('canvas');canvas.width=size.width;canvas.height=size.height;
    try {
        throwIfAborted(signal);
        const context=canvas.getContext('2d');
        if(!context)throw new Error('This image could not be read. Paste the text instead.');
        context.fillStyle='#fff';context.fillRect(0,0,size.width,size.height);context.drawImage(bitmap,0,0);
        return await recognizeDocument(canvas,size,{
            workerPath:new URL('/ocr/worker.min.js',location.origin).href,
            corePath:new URL('/ocr/',location.origin).href,
            langPath:new URL('/ocr/',location.origin).href,
            workerBlobURL:false,gzip:true,
        },onProgress,signal);
    } finally {bitmap.close();canvas.width=0;canvas.height=0;}
}
