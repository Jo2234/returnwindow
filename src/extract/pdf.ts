import type { TextItem } from 'pdfjs-dist/types/src/display/api';
import type { OcrDocument, OcrLine } from '../domain/types';
import { recognizeImage, throwIfAborted } from './ocr';
export function documentFromPdfItems(items:TextItem[]):OcrDocument {
    const rows:{y:number;height:number;items:TextItem[]}[]=[];
    for(const item of items.filter(item=>item.str.trim()).sort((a,b)=>b.transform[5]-a.transform[5]||a.transform[4]-b.transform[4])) {
        const row=rows.find(row=>Math.abs(row.y-item.transform[5])<=2);
        if(row){row.items.push(item);row.height=Math.max(row.height,item.height);}else rows.push({y:item.transform[5],height:item.height,items:[item]});
    }
    const lines:OcrLine[]=rows.map(row=>({text:row.items.sort((a,b)=>a.transform[4]-b.transform[4]).map(item=>item.str).join(' '),confidence:100,bbox:null,words:[]}));
    return {source:'pdf-text',engine:null,imageSize:null,lines};
}
export async function readPdf(file:Blob,signal:AbortSignal):Promise<OcrDocument> {
    throwIfAborted(signal);
    const pdfjs=await import('pdfjs-dist');
    pdfjs.GlobalWorkerOptions.workerSrc=new URL('pdfjs-dist/build/pdf.worker.min.mjs',import.meta.url).href;
    const bytes=new Uint8Array(await file.arrayBuffer());throwIfAborted(signal);
    const task=pdfjs.getDocument({data:bytes,disableFontFace:true,useSystemFonts:false,useWorkerFetch:false});
    const abort=()=>{void task.destroy();};signal.addEventListener('abort',abort,{once:true});
    try {
        const pdf=await task.promise;throwIfAborted(signal);
        const page=await pdf.getPage(1);const content=await page.getTextContent();throwIfAborted(signal);
        const doc=documentFromPdfItems(content.items.filter((item):item is TextItem=>'str'in item));
        if(doc.lines.map(line=>line.text).join('').replace(/\s/g,'').length>=20)return doc;
        const viewport=page.getViewport({scale:2}),canvas=document.createElement('canvas');
        canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);
        try {
            const context=canvas.getContext('2d');if(!context)throw new Error('This PDF has no text layer. Paste the text instead.');
            const render=page.render({canvas,canvasContext:context,viewport});
            const cancelRender=()=>render.cancel();signal.addEventListener('abort',cancelRender,{once:true});
            try{await render.promise;}finally{signal.removeEventListener('abort',cancelRender);}
            throwIfAborted(signal);
            const image=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('This PDF could not be read. Paste the text instead.')),'image/png'));
            return {...await recognizeImage(image,()=>{},signal),source:'pdf-ocr'};
        } finally {canvas.width=0;canvas.height=0;}
    } finally { signal.removeEventListener('abort',abort);await task.destroy(); }
}
