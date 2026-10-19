# ReturnWindow dependencies and local assets

Status: installed-package metadata inspected; local Node OCR and PDF-text integration verified under master grant heavy-basics-s2a-slot2-20261018-1258 (13/13 tests). Production CSP and browser origin/lifecycle checks passed under grant heavy-basics-s2browser-r1-slot2-20261018-1319. Full resolved metadata is in licenses.json, generated with `pnpm licenses list --json > docs/licenses.json`. The package script is invoked with `pnpm run licenses` because `pnpm licenses` selects pnpm's built-in command.

## Direct dependencies

| Package | Exact version | Licence | Scope |
|---|---|---|---|
| @playwright/test | 1.64.1 | Apache-2.0 | development only |
| @tesseract.js-data/eng | 1.0.0 | MIT | runtime / local asset |
| @types/node | 24.19.2 | MIT | development only |
| @types/react | 19.3.0 | MIT | development only |
| @types/react-dom | 19.3.0 | MIT | development only |
| @vitejs/plugin-react | 5.2.0 | MIT | development only |
| ical.js | 2.2.1 | MPL-2.0 | development only / independent calendar parser |
| jsdom | 30.1.3 | MIT | development only / independent HTML parser |
| fast-check | 4.10.2 | MIT | development only |
| pdfjs-dist | 6.4.299 | Apache-2.0 | runtime / local asset |
| react | 19.3.1 | MIT | runtime / local asset |
| react-dom | 19.3.1 | MIT | runtime / local asset |
| tesseract.js | 7.0.0 | Apache-2.0 | runtime / local asset |
| typescript | 6.0.3 | Apache-2.0 | development only |
| vite | 7.3.7 | MIT | development only |
| vitest | 4.1.12 | MIT | development only |
| zod | 4.6.7 | MIT | runtime / local asset |

ical.js MPL-2.0 is dev-only; jsdom is also development only. Both were added for S3 independent parser tests and are not imported by the application. All current direct package licence labels are OSI-approved; see the transitive data exception below.

## Transitive licence flags

- **caniuse-lite@1.0.30001816 — CC-BY-4.0: not an OSI-approved software licence.** A smaller version of caniuse-db, with only the essentials!

- **mdn-data@2.27.1 — CC0-1.0: not OSI-approved; development-only MDN data pulled through jsdom CSS tooling.** Retained explicitly as a data-licence flag ([OSI FAQ on CC0](https://opensource.org/faq#cc-zero), checked 18 Oct 2026).

19 Oct scope/attribution clarification: caniuse-lite is development/build data through plugin-react/Babel/Browserslist; mdn-data is development/test data through jsdom/css-tree. Retain both data-licence labels. [Supplementary notices](../THIRD_PARTY_NOTICES.md) credit caniuse.com and preserve the complete CC BY4.0 / CC0 texts; installed notice bytes match their upstream npm-gitHead revisions. Neither is an application runtime root dependency or an OCR-copied asset.

The remaining resolved labels in the updated pnpm snapshot are MIT, MIT-0, Apache-2.0, ISC, BSD-2-Clause, BSD-3-Clause, MPL-2.0 and BlueOak-1.0.0. [MIT-0](https://opensource.org/license/mit-0) and [Blue Oak](https://opensource.org/license/BlueOak-1.0.0) are listed by OSI (checked 18 Oct 2026). This inventory reports package metadata, not a legal audit.

## OCR provenance and bytes

- tesseract.js@7.0.0 and tesseract.js-core@7.0.0: Apache-2.0 per installed package metadata and licence notices. The application explicitly uses OEM.LSTM_ONLY with legacyCore disabled. v7's installed getCore.js selects scalar, SIMD or relaxed-SIMD LSTM wrappers; all three wrappers and matching WASM files are copied locally.
- @tesseract.js-data/eng@1.0.0: installed package.json declares MIT and the repository https://github.com/naptha/tessdata.git. Its README says it provides English traineddata for Tesseract.js, but does not include a model-specific upstream licence/provenance notice. index.js selects the 4.0.0 directory; the 10,923,060-byte eng.traineddata.gz from that directory is used in both browser and Node. The 4.0.0_best_int alternative is not used.
- The approved Opus plan attributes traineddata to tessdata with Apache-2.0 upstream. **19 Oct source-backed disposition:** the installed gzip matches Naptha at the npm gitHead; its decompressed Git content ID/length match official Tesseract tessdata at pinned revision ced78752cc61322fb554c280d13360b35b8684e4. That revision's README/LICENSE apply Apache-2.0 to the data. The previous chain gap is substantiated; package MIT metadata is separate. Preserve the model-specific [notice/licence and exact hashes](notices/provenance-investigation-20261019.md). No training-data rights audit or legal clearance is claimed.
- docs/ocr-assets.json records every copied file's package/version, bytes and SHA-256. The amended total is 31,347,373 bytes across 13 files, including the two source-reviewed model notice/licence files. The accepted S3 baseline was 31,334,499 bytes across 11 entries, all unchanged in this amendment. Generated public/ocr assets are ignored by Git.

## Other assets

- Installed Devpost Learn skill pack: MIT, © 2026 Devpost. Original planning author remains Claude Opus 5.5 HIGH; the operational amendment records GPT-6 Astra HIGH as the authorized later lead. This S2 implementation is GPT-6.1 Sol HIGH.
- Receipt and policy fixtures: synthetic Juniper Lane Goods only, created for this project. The PNG/PDF assets are generated from project HTML; no real receipt, retailer logo, remote image or external font is used. Real OCR goldens must be recorded by the script under a grant; none is invented.

## Security notes

- Worker, core wrappers/WASM and English model are self-hosted at /ocr; workerBlobURL is false, cacheMethod is none, and no CDN default is used. The browser uses only same-origin assets. PDF.js has a bundled local worker; no remote CMaps, standard font data or font URLs are configured.
- The plan's production-only CSP is injected by the Vite build plugin. Verified in production preview on 18 Oct 2026: real image OCR, PDF text, blank-image failure/recovery, cancellation and replacement passed with the exact plan directive. No broader script directive was needed. Browser evidence records 31 requests with zero other-origin requests, including same-origin OCR worker/core/model and PDF-worker URLs, and zero console/page errors. Evidence: /tmp/basics-slot2-ocr-shots/run-2026-10-18T05-20-08-798Z/requests.json. The earlier B failure was an incorrect harness date-format assertion, not an observed CSP error; its logs remain preserved.
- pnpm initially blocked Tesseract's install hook. Installed package.json shows that it only runs opencollective-postinstall (a donation notice), so it is explicitly denied via `pnpm approve-builds '!tesseract.js' --yes`. No Tesseract build step is required; esbuild remains the sole allowed dependency install script.
- Receipt image object URLs are memory-only; cancellation, replacement, failure recovery, Start over and unmount revoke them. The adapter terminates workers after recognition or cancellation, including cancellation while initialization is pending (termination runs as soon as createWorker resolves). Async UI work is fenced by an operation id and AbortSignal. Mocked-worker targeted checks cover initialization cancellation and late progress/results. Real browser cancellation/replacement during active work passed with zero remaining instrumented workers/object URLs and no stale case replacement; the browser and owned preview process group were stopped and port 4188 was closed afterward. Unmount cleanup is implemented; no separate browser unmount scenario was run.

## 19 Oct notice delivery boundary

The source tree now includes model-specific Apache-2.0 and data notices. The accepted S3 static build is unchanged and was not rerun. The authorized two-file copier/manifest amendment is implemented and syntax/deterministic local-copy checks passed. Fresh full-copier/build-output verification remains pending the one combined slot2 grant; [the bounded receipt](process/notice-packaging-20261019.md) and [source investigation](notices/provenance-investigation-20261019.md) record exact filenames/hashes. No model/lock/fixture or dependency replacement occurred.
