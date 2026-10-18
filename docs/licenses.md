# ReturnWindow dependencies and local assets

Status: installed-package metadata inspected; local Node OCR and PDF-text integration verified under master grant heavy-basics-s2a-slot2-20261018-1258 (13/13 tests). Production CSP and browser origin/lifecycle checks remain pending a separate grant. Full resolved metadata is in licenses.json, generated with `pnpm licenses list --json > docs/licenses.json`. The package script is invoked with `pnpm run licenses` because `pnpm licenses` selects pnpm's built-in command.

## Direct dependencies

| Package | Exact version | Licence | Scope |
|---|---|---|---|
| @playwright/test | 1.64.1 | Apache-2.0 | development only |
| @tesseract.js-data/eng | 1.0.0 | MIT | runtime / local asset |
| @types/node | 24.19.2 | MIT | development only |
| @types/react | 19.3.0 | MIT | development only |
| @types/react-dom | 19.3.0 | MIT | development only |
| @vitejs/plugin-react | 5.2.0 | MIT | development only |
| fast-check | 4.10.2 | MIT | development only |
| pdfjs-dist | 6.4.299 | Apache-2.0 | runtime / local asset |
| react | 19.3.1 | MIT | runtime / local asset |
| react-dom | 19.3.1 | MIT | runtime / local asset |
| tesseract.js | 7.0.0 | Apache-2.0 | runtime / local asset |
| typescript | 6.0.3 | Apache-2.0 | development only |
| vite | 7.3.7 | MIT | development only |
| vitest | 4.1.12 | MIT | development only |
| zod | 4.6.7 | MIT | runtime / local asset |

ical.js MPL-2.0 is dev-only. It is planned for the later export slice and is not installed in S2. jsdom is also deferred to that slice. All current direct package licence labels are OSI-approved; see the transitive data exception below.

## Transitive licence flags

- **caniuse-lite@1.0.30001816 — CC-BY-4.0: not an OSI-approved software licence.** A smaller version of caniuse-db, with only the essentials!

The remaining resolved labels in the pnpm snapshot are MIT, Apache-2.0, ISC, BSD-2-Clause and BSD-3-Clause. This inventory reports package metadata, not a legal audit.

## OCR provenance and bytes

- tesseract.js@7.0.0 and tesseract.js-core@7.0.0: Apache-2.0 per installed package metadata and licence notices. The application explicitly uses OEM.LSTM_ONLY with legacyCore disabled. v7's installed getCore.js selects scalar, SIMD or relaxed-SIMD LSTM wrappers; all three wrappers and matching WASM files are copied locally.
- @tesseract.js-data/eng@1.0.0: installed package.json declares MIT and the repository https://github.com/naptha/tessdata.git. Its README says it provides English traineddata for Tesseract.js, but does not include a model-specific upstream licence/provenance notice. index.js selects the 4.0.0 directory; the 10,923,060-byte eng.traineddata.gz from that directory is used in both browser and Node. The 4.0.0_best_int alternative is not used.
- The approved Opus plan attributes traineddata to tessdata with Apache-2.0 upstream. **Provenance flag:** the installed npm package does not independently substantiate the model-specific upstream notice; preserve the plan's attribution and verify it before public release. No unsupported upstream provenance claim is presented as newly verified.
- docs/ocr-assets.json records every copied file's package/version, bytes and SHA-256. Current total: 31,334,499 bytes across 11 files (including distributed licence notices). Generated public/ocr assets are ignored by Git.

## Other assets

- Installed Devpost Learn skill pack: MIT, © 2026 Devpost. Original planning author remains Claude Opus 5.5 HIGH; the operational amendment records GPT-6 Astra HIGH as the authorized later lead. This S2 implementation is GPT-6.1 Sol HIGH.
- Receipt and policy fixtures: synthetic Juniper Lane Goods only, created for this project. The PNG/PDF assets are generated from project HTML; no real receipt, retailer logo, remote image or external font is used. Real OCR goldens must be recorded by the script under a grant; none is invented.

## Security notes

- Worker, core wrappers/WASM and English model are self-hosted at /ocr; workerBlobURL is false, cacheMethod is none, and no CDN default is used. The browser uses only same-origin assets. PDF.js has a bundled local worker; no remote CMaps, standard font data or font URLs are configured.
- The plan's production-only CSP is injected by the Vite build plugin. **Not yet browser-verified under CSP.** No broader script directive has been added. Any actual CSP failure and narrow correction will be recorded after the granted browser check.
- pnpm initially blocked Tesseract's install hook. Installed package.json shows that it only runs opencollective-postinstall (a donation notice), so it is explicitly denied via `pnpm approve-builds '!tesseract.js' --yes`. No Tesseract build step is required; esbuild remains the sole allowed dependency install script.
- Receipt image object URLs are memory-only; cancellation, replacement, failure recovery, Start over and unmount revoke them. The adapter terminates workers after recognition or cancellation, including cancellation while initialization is pending (termination runs as soon as createWorker resolves). Async UI work is fenced by an operation id and AbortSignal. These lifecycle paths have mocked-worker targeted checks; real browser cleanup remains pending.
