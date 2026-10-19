import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const require = createRequire(import.meta.url);
const tessPackage = require.resolve('tesseract.js/package.json');
const tessRequire = createRequire(tessPackage);
const packageFiles = {
  'tesseract.js': tessPackage,
  'tesseract.js-core': tessRequire.resolve('tesseract.js-core/package.json'),
  '@tesseract.js-data/eng': require.resolve('@tesseract.js-data/eng/package.json'),
};
const assets = [
  ['tesseract.js', 'dist/worker.min.js', 'worker.min.js'],
  ['tesseract.js', 'dist/worker.min.js.LICENSE.txt', 'worker.min.js.LICENSE.txt'],
  ['tesseract.js', 'LICENSE.md', 'LICENSE-tesseract.js.txt'],
  ['tesseract.js-core', 'LICENSE', 'LICENSE-tesseract.js-core.txt'],
];
// OEM.LSTM_ONLY + legacyCore:false selects one of these three v7 variants.
for (const variant of ['lstm', 'simd-lstm', 'relaxedsimd-lstm']) {
  for (const extension of ['wasm.js', 'wasm']) {
    const name = `tesseract-core-${variant}.${extension}`;
    assets.push(['tesseract.js-core', name, name]);
  }
}
assets.push(['@tesseract.js-data/eng', '4.0.0/eng.traineddata.gz', 'eng.traineddata.gz']);
const manifest = [];
await fs.mkdir(path.join(root, 'public/ocr'), { recursive: true });
for (const [pkg, source, destination] of assets) {
  const metadata = JSON.parse(await fs.readFile(packageFiles[pkg], 'utf8'));
  const data = await fs.readFile(path.join(path.dirname(packageFiles[pkg]), source));
  await fs.writeFile(path.join(root, 'public/ocr', destination), data);
  manifest.push({ file: `/ocr/${destination}`, source: `${pkg}@${metadata.version}/${source}`, bytes: data.byteLength, sha256: createHash('sha256').update(data).digest('hex') });
}
// Model-data notices are local, source-reviewed files; package MIT metadata is separate.
const modelNotices = ['eng-traineddata-NOTICE.txt', 'eng-traineddata-LICENSE-Apache-2.0.txt'];
for (const destination of modelNotices) {
  const source = `docs/notices/${destination}`;
  const data = await fs.readFile(path.join(root, source));
  await fs.writeFile(path.join(root, 'public/ocr', destination), data);
  manifest.push({ file: `/ocr/${destination}`, source, bytes: data.byteLength, sha256: createHash('sha256').update(data).digest('hex') });
}
await fs.mkdir(path.join(root, 'docs'), { recursive: true });
await fs.writeFile(path.join(root, 'docs/ocr-assets.json'), JSON.stringify({ engine: 'tesseract.js@7.0.0', lang: 'eng', langDataVersion: '@tesseract.js-data/eng@1.0.0/4.0.0', assets: manifest, totalBytes: manifest.reduce((n,a)=>n+a.bytes,0) }, null, 2)+'\n');
console.log(`Copied ${manifest.length} local OCR assets (${manifest.reduce((n,a)=>n+a.bytes,0)} bytes); no network requests.`);
