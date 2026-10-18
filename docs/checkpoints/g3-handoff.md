# ReturnWindow G3 local-input checkpoint

Lead: GPT-6 Astra HIGH (authorized quota fallback); original plan/G1/G2: Claude Opus5.5HIGH; implementation: GPT-6.1 Sol HIGH. Same RP threads and worker IDs retained.

G3 accepts real local image OCR,PDF text input,synthetic fixtures,local assets,production CSP and input lifecycle. Mechanical checks: frozen install/typecheck pass,113unit tests,49tests in each of3timezones,13OCR/adapter tests,production build and production browser walkthrough pass.

Build-tested:b360f1031ef65531794c60b4ded891e81e44d5be. Browser-tested:cc0534311453a107f5588f429e387044682f582c. App code is unchanged across subsequent documentation commits.

Commands: pnpm fixtures:render; node scripts/render-fixtures.mjs --record-ocr --iteration=1; pnpm test:ocr; pnpm install --frozen-lockfile; pnpm typecheck; pnpm test; pnpm test:tz; pnpm build; node /tmp/basics-slot2-ocr-browser-check.mjs. All ran under explicit master grants. The first browser attempt failed because a harness expected DD/MM rather than ISO display; no application defect was inferred. The corrected pinned harness passed on its separately granted run; failed logs retained.

Actual messy OCR date05Oct2026(line confidence92,date-word80) against ground truth08Oct. Correction changes shirt04→07Nov and mug26→29Oct; delivery-anchored earbuds stays24Oct with delivery10Oct. Browser evidence:31same-origin requests,0external,0console/page errors; unchanged CSP; real PDF4exact amounts; blank failure and recovery;cancel/replacement leaves0instrumented workers/objectURLs. R1 wall7000ms at load2.53/3.25/3.74→2.57/3.25/3.73,not a standalone benchmark.

Remaining:S3 calendar/evidence exports,persistence,visual polish,full final E2E/G4 and S4 audit. Optional scanned-PDF browser and separate unmount scenario not exercised. License inventory flags caniuse-liteCC-BY-4.0 data and unverified model-specific traineddata upstream notice; resolve before public release. No sponsor APIs. No deployment/publication/submission or conversation-history export.

Johan gates remain:personal planning review/facts,hands-on checks,description/reflection,video,public repo and submission. Saved artifacts go through automatic RP Files delivery; private relay status is verified separately.
