# G3 review — S2 OCR/PDF

Reviewer: GPT-6 Astra HIGH (authorized quota fallback), 18 October 2026.

Status: G3 ACCEPTED by GPT-6 Astra HIGH on 18 October 2026, based on application/evidence `23af61860c9700a5dc40f95fa4ee7bb9c0183271`. Final mechanical checklist tick is a documentation-only follow-up; verify its SHA before merge. Historical pending/failed entries below remain as the review trail.

Reviewed draft code `dcfd9630ff7530af5725fb3b5f7b4a30a981d668`; generated batch A evidence is committed at clean `b360f1031ef65531794c60b4ded891e81e44d5be` by the same Sol slot2 worker; tests and ground truth unchanged.

Batch A grant `heavy-basics-s2a-slot2-20261018-1258`: master release confirmed after worker cleanup plus independent master PID/PGID checks. All three exact commands exited 0; 13 tests passed across 2 files. Lead read the logs.

- O1/O3 retain exact four-item amounts 8900,4590,1850,1200 and total16540.
- O2 uses real golden output: messy date05/10/2026 (line92/dateword80); ground truth08/10/2026. Actual misread retained, no forced target06.
- O4 rejects the real blank image.
- Lead visually inspected receipt-demo-messy.png: synthetic fictional store, four visible line items, faded purchase-date digit; PNG351671B fits400KB bound.
- Source review: same-origin OCR paths, three LSTM core variants copied with hash inventory; image bitmap/canvas cleanup and operation-id fencing; worker termination scheduled after cancelled initialization resolves; PDF text grouping and local worker; production-only CSP with no broadened script directive; browser harness includes request/worker URLs, cancellation/replacement and failure recovery. These are source observations, not completed browser evidence.

Remaining G3 gates: full unit/TZ regression; production build; actual browser OCR/PDF/CSP/no-egress/lifecycle walkthrough under a fresh master grant. Review screenshot/request evidence after it runs. Do not tick slice3 or merge before these pass and lead accepts.

Licence follow-up remains explicit: caniuse-lite CC-BY-4.0 data metadata; traineddata-specific upstream notice not independently verified. Resolve provenance before public release; no public release is authorized.

Future demo choreography must use05→08 rather than planned06→08: before correction shirt04Nov and mug26Oct; after correction shirt07Nov and mug29Oct. A delivery-anchored earbuds deadline stays24Oct when delivery is10Oct. Validate these in the browser instead of silently claiming the original script's dates.

Browser harness source review: SHA256 `5f913c2ada2693907c8ab8d8777446f2442b247ce47d347a1f25b8b3ae89018b` asserts actual05, pre-correction04Nov/26Oct, delivery10Oct→24Oct, then purchase correction05→08 changes only purchase deadlines to07Nov/29Oct. Syntax check is worker-reported; execution still awaits B grant.

## Batch B result

At unchanged application/evidence commit b360f1031ef65531794c60b4ded891e81e44d5be: install/typecheck pass,113/113 unit,3×49 timezone tests pass; production build passes(79modules,Vite2.49s). Browser stopped at its first actual-date assertion: expected05/10/2026 while ReceiptPanel displays the correct ISO2026-10-05. Sample progress,4items and nonzero bboxes reached. Later correction/PDF/lifecycle/no-egress/console checks did not execute. CSP meta exists and OCR reached workspace under it; full CSP/no-egress acceptance remains unverified.

Same Sol worker assigned harness-only exact-format fix and failure-safe evidence capture; no application/test/fixture change and no retry granted. Fresh browser-only reservation required. G3 remains unapproved.

## Acceptance evidence

R1 grant heavy-basics-s2browser-r1-slot2-20261018-1319: exact single command EXIT0; requests.json status=pass/stage=complete;7000ms with start load2.53/3.25/3.74,end2.57/3.25/3.73. Lead independently read logs/request JSON, inspected sample/PDF/blank screenshots, and checked all reported12PIDs absent and4188 clear. Master independently verified groups and released the grant.

31 requests,0 other-origin;6 local workerURLs; no console/page/evidence/cleanup errors. Exact original production CSP. Real image sample and PDF extraction, actual05→08 correction with delivery24Oct invariant, blank failure/recovery, start over,cancel/replacement with no stale results and workers/objectURLs0 passed. Prior B failure remains documented.

Local OCR/PDF/input G3 is accepted. Optional scanned-PDF browser path and separate browser unmount not exercised; no claim of verification. Licence provenance flags retained. Final exported calendar/evidence flow, persistence, visual polish and G4 remain outstanding. Current workspace is long; the fixed action bar overlays part of full-page screenshots. S3 owns compact receipt presentation, spacing/scroll behavior, and final1280×800 review.
