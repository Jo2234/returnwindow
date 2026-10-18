import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
const root = fileURLToPath(new URL('../', import.meta.url));
const dir = path.join(root, 'fixtures/receipts');
const arg = process.argv.find(a=>a.startsWith('--iteration='));
const iteration = arg?.split('=')[1] ?? '1';
const uptime = () => execFileSync('uptime', {encoding:'utf8'}).trim();
// This command is heavyweight in both modes and requires an explicit master grant.
if (process.argv.includes('--record-ocr')) {
  const require = createRequire(import.meta.url);
  const {createWorker,OEM,PSM} = require('tesseract.js');
  for(const name of ['receipt-demo-clean','receipt-demo-messy']) {
    // Ground truth must already exist; never derive it from recognition output.
    await fs.access(path.join(dir,`${name}.expected.json`));
    const image=await fs.readFile(path.join(dir,`${name}.png`));
    const started=performance.now(),load=uptime();
    const worker=await createWorker('eng',OEM.LSTM_ONLY,{langPath:path.join(root,'public/ocr'),cacheMethod:'none',gzip:true,legacyCore:false,legacyLang:false,errorHandler:()=>{}});
    try {
      await worker.setParameters({tessedit_pageseg_mode:PSM.SINGLE_BLOCK,preserve_interword_spaces:'1'});
      const {data}=await worker.recognize(image,{}, {text:true,blocks:true});
      const lines=(data.blocks??[]).flatMap(b=>b.paragraphs.flatMap(p=>p.lines.map(l=>({text:l.text.replace(/\n$/,''),confidence:l.confidence,bbox:l.bbox,words:l.words.map(w=>({text:w.text,confidence:w.confidence,bbox:w.bbox}))}))));
      const record={synthetic:true,engine:'tesseract.js',version:'7.0.0',lang:'eng',langDataVersion:'@tesseract.js-data/eng@1.0.0/4.0.0',recordedAt:new Date().toISOString(),uptime:load,wallMs:Math.round(performance.now()-started),imageSha256:createHash('sha256').update(image).digest('hex'),imageSize:{width:image.readUInt32BE(16),height:image.readUInt32BE(20)},text:data.text,lines};
      await fs.writeFile(path.join(dir,`${name}.ocr-golden.json`),JSON.stringify(record,null,2)+'\n');
      const dateLine=lines.find(l=>/date/i.test(l.text));
      const summary=`${name}, iteration ${iteration}: ${record.wallMs} ms; ${load}; OCR date line ${JSON.stringify(dateLine??null)}.`;
      console.log(summary);
      await fs.appendFile(path.join(dir,'CHANGELOG.md'),`\n- ${record.recordedAt}: real OCR recorded by script. ${summary}\n`);
    } finally {await worker.terminate();}
  }
} else {
  const {chromium}=await import('@playwright/test');
  console.log(`Fixture rendering start: ${uptime()}`);
  const browser=await chromium.launch({headless:true});
  try {
    const page=await browser.newPage({viewport:{width:600,height:800},deviceScaleFactor:1});
    await page.route('**/*',route=>route.request().url().startsWith('file:')?route.continue():route.abort());
    for(const name of ['receipt-demo-clean','receipt-demo-messy']) {
      await fs.access(path.join(dir,`${name}.expected.json`));
      await page.goto(new URL(`../fixtures/receipts/${name}.html`,import.meta.url).href);
      await page.screenshot({path:path.join(dir,`${name}.png`)});
      const bytes=(await fs.stat(path.join(dir,`${name}.png`))).size;
      if(bytes>=400_000)throw new Error(`${name}.png is too large (${bytes} bytes)`);
      if(name==='receipt-demo-clean')await page.pdf({path:path.join(dir,'receipt-demo.pdf'),width:'600px',height:'800px',printBackground:true});
      console.log(`${name}.png: ${bytes} bytes`);
    }
    await page.setContent('<!doctype html><html><body style="margin:0;background:white;width:600px;height:800px"></body></html>');
    await page.screenshot({path:path.join(dir,'blank.png')});
    await fs.copyFile(path.join(dir,'receipt-demo-messy.png'),path.join(root,'public/samples/receipt-demo-messy.png'));
    await fs.copyFile(path.join(root,'fixtures/policies/policy-demo.txt'),path.join(root,'public/samples/policy-demo.txt'));
    await fs.appendFile(path.join(dir,'CHANGELOG.md'),`\n- ${new Date().toISOString()}: rendered iteration ${iteration}; OCR not inferred from appearance. ${uptime()}\n`);
    console.log(`Fixture rendering complete: ${uptime()}`);
  } finally {await browser.close();}
}
