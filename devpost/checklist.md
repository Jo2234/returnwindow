---
doc: checklist
status: approved
---

# Build Checklist

Build mode: fast

Stage 0 plans only. Slices 1–2 are being implemented by slot 2; verification records appear below. Later workers follow this checklist and the detailed hand-computed tests in docs/opus/implementation-plan.md §10. All learner feedback is Johan's; agent verification must be recorded separately and must not tick a learner checkpoint.

## Slices

- [x] **1. Paste a receipt and a policy and see per-item deadlines with highlighted passages**
  Becomes usable: A local app accepts pasted receipt/policy text and shows item cards with separate supported dates, final-sale exclusion and exact numbered policy passages.
  Why now: Proves the distinctive evidence-backed date kernel immediately; bootstrapping is part of this usable flow. It gives later input and export work a tested baseline.
  PRD ref: `prd.md > The Core Journey` (steps 1–3), `prd.md > Receipt and Policy Input`, `prd.md > Per-Item Deadlines and Evidence`, `prd.md > Observable Acceptance Criteria`
  Spec ref: `spec.md > Where It Runs and How Someone Tries It`, `spec.md > Civil Dates — civil-date.ts`, `spec.md > Verified Spans — spans.ts`, `spec.md > Categories — categories.ts`, `spec.md > Receipt Parser — receipt-parser.ts`, `spec.md > Policy Parser — policy-parser.ts`, `spec.md > Clause Matcher — matcher.ts`, `spec.md > Outcome Engine — engine.ts`, `spec.md > Case Store — state/case-store.ts`, `spec.md > UI — App.tsx and ui/`, `spec.md > File Structure`
  Build: Scaffold pinned React/Vite/TypeScript, pnpm lock/config and capped Vitest setup. Implement plan §4 types and pure date/span/category/text-receipt/policy/matcher/engine modules, text fixtures exactly from §10.2, reducer and paste-text workspace with fields, cards and verified highlights. Keep the ambiguous electronics result visibly pending; interactive answers arrive in slice 2. Use minimal functional styling from the approved palette.
  Verify (mechanical): Run `pnpm typecheck`, `pnpm test` (maxWorkers ≤2) and `pnpm test:tz` for implemented date/parser/matcher/span/demo tests from plan §§10.1–10.4. Observe the text sample in a browser at 127.0.0.1:5188/?today=2026-10-20: shirt 7 Nov, mug 29 Oct, scarf not returnable, earbuds pending; Show passage reveals an exact quotation. Record commands/counts and agent browser result; stop the started server.
  Learner check: Open the local app, paste the sample receipt and policy, inspect each item and Show passage, and report whether the dates and evidence are understandable. [JOHAN: hands-on check pending]. Agent-side equivalent completed 18 Oct 2026: pnpm typecheck passed; pnpm test 80/80 (5 files); pnpm test:tz 44/44 (3 files) for each of UTC, America/Los_Angeles and Pacific/Kiritimati. T3 Playwright-backed preview at 127.0.0.1:5188/?today=2026-10-20 confirmed shirt Sat 7 Nov (18 days), mug Thu 29 Oct (9 days), scarf not returnable ③, earbuds waiting, and the visible simulated-today badge. Clicking shirt Show passage scrolled/flashed the exact c1 quotation. Screenshot: /tmp/basics-slot2-shots/slice1-workspace.png. Owned dev server and browser tab stopped. This brief interactive check used the existing shared T3 browser; production build remains gated behind the other project's heavyweight run.
  Commit: `feat: paste receipts and policies into evidence-backed item deadlines`

- [x] **2. Ambiguity asks one question; corrections recompute every deadline; refusals**
  Becomes usable: Answer purchase/delivery/Not sure, edit extracted fields or categories, see affected results change with a log, and get clear refusals instead of guessed dates.
  Why now: Completes the kernel's honest uncertainty and correction loop before OCR can introduce real extraction mistakes.
  PRD ref: `prd.md > One Question and Corrections`, `prd.md > Observable Acceptance Criteria`, `prd.md > States and Boundaries`
  Spec ref: `spec.md > Questions — questions.ts`, `spec.md > Corrections — corrections.ts`, `spec.md > Outcome Engine — engine.ts`, `spec.md > Case Store — state/case-store.ts`, `spec.md > UI — App.tsx and ui/`
  Build: Implement deduplicated questions, delivery-date entry, unsure earliest-possible display, immutable validated corrections and six-second result diffs/live announcements. Complete missing-policy/window/match, unsupported-business-day, conflict, missing-date and exclusion states. Preserve delivery-anchored results through purchase-date changes. Finish every required plan §§10.1–10.4 test, including fuzz and correction round-trip.
  Verify (mechanical): Run `pnpm typecheck`, `pnpm test` (maxWorkers ≤2) and `pnpm test:tz`; all plan §§10.1–10.4 cases must be green. In the browser, answer delivery 10 Oct → earbuds 24 Oct; Not sure → earliest 22 Oct without computed date; correct purchase 6→8 Oct → shirt 5→7 Nov and mug 27→29 Oct while delivery earbuds stay 24 Oct. Confirm one shared question, invalid delivery rejection, no-policy refusal and business-day/conflict explanations. Record evidence and stop the server.
  Learner check: Try the question choices, correct a date and category, and remove the policy. Tell us which changes or refusal messages are confusing. [JOHAN: hands-on check pending]. No learner action claimed. Agent-side equivalent completed 18 Oct 2026: pnpm typecheck passed; pnpm test 107/107 (7 files); pnpm test:tz 49/49 (3 files) in each TZ. In the Playwright-backed T3 browser, delivery 05/10/2026 was rejected without changing the pending item; delivery 10/10/2026 computed earbuds Sat 24 Oct (4 days). Editing purchase 08→06 showed shirt Thu 5 Nov / mug Tue 27 Oct, then 06→08 showed Sat 7 Nov / Thu 29 Oct while earbuds stayed Sat 24 Oct. Two was→now badges and '2 deadlines updated' appeared and both cleared after 6.2 seconds. Not sure showed earliest Thu 22 Oct, no computed date; changing the mug category to electronics reused the same answer, and reopening Change answer displayed one card for the shared clause. Choosing purchase gave both electronics items Thu 22 Oct. Business-day and conflicting-footwear policies showed exact non-computed explanations and two conflict passage links. No-window and removed-policy states showed their exact refusal banners, no item dates, disabled exports. Owned dev server and browser tab stopped. [JOHAN: hands-on check pending]
  Commit: `feat: ask about uncertain clocks and recompute corrections without guessing`

- [ ] **3. Drop a receipt photo or PDF and it is read on the device**
  Becomes usable: The labelled synthetic image sample, photo drop, text-layer PDF and text files enter the same editable workspace with real progress/check flags.
  Why now: Tests the useful unknown—messy OCR—after the deterministic baseline can expose and correct mistakes.
  PRD ref: `prd.md > Receipt and Policy Input`, `prd.md > Screens and Layout`, `prd.md > States and Boundaries`
  Spec ref: `spec.md > OCR Adapter — extract/ocr.ts`, `spec.md > PDF Adapter — extract/pdf.ts`, `spec.md > Input Router — extract/input.ts`, `spec.md > External Services and Dependencies`, `spec.md > Decisions and Open Issues`
  Build: Add Tesseract/PDF adapters, input routing/limits, cancel/resource cleanup, boxes/confidence plumbing and Try the sample from real OCR. Copy local OCR/model/worker assets in postinstall; inject production-only CSP. Create synthetic clean/messy/blank receipts and text PDF with ground truth before OCR, record actual golden output with engine versions/time/load, and write licences/asset hashes. P1 scanned-PDF OCR only if core is green and capacity permits.
  Verify (mechanical): Run `pnpm typecheck`, `pnpm test` (maxWorkers ≤2), then resource-gated `pnpm fixtures:render`, `pnpm test:ocr` (maxWorkers 1) and `pnpm build`. O1–O4 must assert exact clean/PDF extraction, actual messy output with wrong-or-check-flagged date, and blank failure. In production preview at 127.0.0.1:4188, exercise image sample, correction, PDF, cancel and bad-input recovery; observe requests for same-origin assets only. Record actual times with uptime, any fixture changes and waits; stop all processes started.
  Learner check: Try the synthetic image and PDF, inspect Check this against the image, and correct anything questionable. [JOHAN: hands-on check pending]. Agent-side browser observation does not complete this check.
  Commit: `feat: read synthetic receipt photos and PDFs entirely on device`

- [ ] **4. Take it with you: calendar reminders and a printable evidence pack**
  Becomes usable: Download .ics reminders and self-contained evidence HTML, print the evidence, and restore the imageless case on reload if P1 persistence is retained.
  Why now: The input and correction journey now has stable evidence to export; persistence reuses that validated case.
  PRD ref: `prd.md > Reminders and Evidence Pack`, `prd.md > States and Boundaries`, `prd.md > Observable Acceptance Criteria`
  Spec ref: `spec.md > Calendar Export — ics.ts`, `spec.md > Evidence Export — evidence.ts`, `spec.md > Persistence — persist.ts (P1)`, `spec.md > Data Model`
  Build: Implement CRLF/escaped/folded calendar events with exclusions, all-day dates and relative alarms. Add escaped script-free evidence HTML/print view with quotes, offsets, hash, answers, corrections and synthetic labels. Add P1 Zod-validated imageless single-case storage and Start over cleanup; record a scope revision if it is cut.
  Verify (mechanical): Run `pnpm typecheck` and `pnpm test` (maxWorkers ≤2), including plan §10.6 I1–I4/E1–E2 and §10.7 S1–S2 unit portions. Independent ical.js must parse exactly three answered-sample events (24 Oct, 7 Nov, 29 Oct) and exclude closed/unsure items; raw tests assert UTF-8 75-octet folding and escaping. Inspect evidence and print emulation, restore on reload and clear on Start over if persistence included. Record observed results and stop servers.
  Learner check: Import the sample .ics into Calendar, check its dates/reminder behavior, print the evidence, reload and Start over. [JOHAN: hands-on check pending]. Calendar app import is Johan's; agent checks file structure/browser only.
  Commit: `feat: export return reminders and evidence with imageless case restore`

- [ ] **5. Polish and prove the complete journey**
  Becomes usable: A coherent keyboard-accessible, print-ready demonstration with verified no-egress behavior, documented setup, licences and honest handoff facts.
  Why now: Full-journey checks can now falsify behavior across real extraction, corrections and exports; visual work follows working evidence.
  PRD ref: `prd.md > The Core Journey`, `prd.md > Look and Feel`, `prd.md > Observable Acceptance Criteria`, `prd.md > States and Boundaries`
  Spec ref: `spec.md > UI — App.tsx and ui/`, `spec.md > Look and Feel`, `spec.md > Where It Runs and How Someone Tries It`, `spec.md > External Services and Dependencies`, `spec.md > Decisions and Open Issues`
  Build: Finish tokens/layout/status/empty/error/focus/reduced-motion/print styling and P1 small-screen layout if retained. Add Playwright X1–X7 against production preview, final README, test report with commands/counts/load, neutral submission facts and lead demo script. Record actual OCR behavior; do not write Johan's reflections or submission copy.
  Verify (mechanical): Run `pnpm typecheck`, `pnpm test` (maxWorkers ≤2), `pnpm test:tz`, then resource-gated serial `pnpm test:ocr`, `pnpm build` and `pnpm test:e2e` (workers 1). All required plan §10 checks must pass, with no skipped/weakened tests. Assert zero other-origin requests and built CSP, unsure/no-policy export restrictions, print-hidden controls, keyboard journey and P1 restore. Save 1280×800 screenshots of start/workspace/question/evidence under ignored test-results/screens; review screenshots and walkthrough. Stop every owned server/browser.
  Learner check: Freely try the whole flow, awkward inputs, keyboard use, evidence and reminders; report what is broken or confusing before release. [JOHAN: hands-on check pending]. Agent tests cannot assert Johan's approval.
  Commit: `feat: polish and verify the complete ReturnWindow journey`

## Hands-on Checkpoints

- [ ] Early usable behavior explored — after slice 1; feedback on the cards and passages can shape later interactions. [JOHAN: hands-on check pending]
- [ ] Integrated image journey explored — after slice 3; check the real OCR/correction experience against the synthetic image. [JOHAN: hands-on check pending]
- [ ] Final kick-the-tires exploration and feedback completed — after slice 5. [JOHAN: hands-on check pending]

Fast mode reduces explanation, not verification or learner ownership. Later workers perform the authorized mechanical/browser equivalents, record evidence under each slice and leave these boxes pending until Johan actually reports back. After slice 1, the optional Discord project-thread suggestion is a Johan option only; no agent post/message is authorized.

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship. [JOHAN: hands-on check pending]

No final review performed in Stage 0. Record actual feedback and any agreed revision items here; do not invent revisions or readiness.

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: Not started; Stage 0 is planning only. Personal learning goal is not established. Use actual code/test evidence after revisions; no learner mastery claimed.
Route and stops: Not started; choose 2–3 actual paths/symbols from the finished app, never planned-only code.
Edit outcome: Not offered; no implementation exists.
Reflection: Not offered; any personal answer belongs only in the ignored learner profile. [JOHAN: personal reflection pending]
Activity mode: Not started.

## Revisions

- 18 Oct 2026, slot 2 (S1, slices 1–2): scaffold and deterministic text kernel checkpoint. Exact §12 pins installed. Initial `pnpm install` failed with `ERR_PNPM_IGNORED_BUILDS` for esbuild; `pnpm approve-builds --help` documents positional package approval, and `pnpm approve-builds esbuild --yes` succeeded. It generated `pnpm-workspace.yaml` with only `allowBuilds.esbuild: true`; this necessary package-manager config is an addition to the slot's listed paths. The shell's pnpm launcher reports 12.14.0, but the project's packageManager setting runs pnpm 12.11.2 (confirmed by install output). `pnpm vitest --help` confirms `--maxWorkers`; scripts cap it at 2. Two initial typechecks failed (missing generic for empty delivery field; test callback narrowing); repaired without changing acceptance expectations. `pnpm typecheck` then passed; `pnpm test`: 80/80 in 5 files; `pnpm test:tz`: 44/44 in 3 files in each of UTC, America/Los_Angeles, Pacific/Kiritimati. Browser/build gated at 12:09 SGT: load 7.18/6.17/5.22, 54% free; Amazon Playwright running. Slice boxes remain unchecked until their browser mechanical checks pass. [JOHAN: hands-on check pending]

- Slice 1 completed with the text sample and exact passage checked in the browser; the screenshot is temporary, uncommitted evidence. Fixtures contain LF with exactly one trailing newline, byte-exact to plan §10.2. No learner check claimed.

- Slice 2 implements immutable corrections, editable store/dates/descriptions/amounts/categories, logged answer replacement, one visible question, six-second diffs/live region, refusal copy, text files, manual item addition and policy replacement/removal. Original extraction warnings remain in state; the receipt panel hides resolved missing-date/item warnings and recomputes displayed total mismatch after edits. Added tests assert the complete §10.2 Then sequence and C1, every D/W/P row, 1,000 D15 and 500 W12 property runs, typed correction errors, epoch/century boundaries and whole-word category priority. A final receipt invalid-month test rejects 'Octopus 8, 2026'.

- Small parser grammar reconciliations: §5.2's literal delivery regex does not cover W3's 'from the date you receive your order' or W10's coordinated 'of purchase or delivery'. Added those two patterns to meet the explicit W3/W10 expectations, rather than guessing an anchor. Multiple windows separated by category phrases retain their literal subspans and inherited return context; differing unsplit windows remain separate same-span clauses so the existing matcher can represent conflict using the unchanged public contract.

- Byte verification against the code blocks in plan §10.2: policy-demo.txt 499 UTF-8 bytes and receipt-demo.txt 426 bytes; both public text twins exactly equal their fixtures. Frozen install passed on pnpm 12.11.2. A first browser automation attempt used unsuccessful locators; retargeting snapshot-provided references and inspected controls passed all checks; no application failure was inferred from the locator errors.

- Build gate wait continues: 12:12 SGT load 12.68/11.30/7.76, 52% free, Amazon Playwright still running; 12:13 8.65/10.44/7.62, 56% free with only the persistent T3 browser; final build held while finishing source/UI verification. 12:15 14.31/11.02/8.24, 57% free, only persistent T3 browser found, so build deferred for load >12. No process from another project was stopped.

- Follow-up review caught incomplete singular/plural lexicon support required by §5.2. Category matching now expands the fixed lexicon with whole-word singular/plural aliases (shirts, mugs, boot, smartwatches, cosmetic, dresses), preserving priority and exact keyword offsets. Added an independent positive/negative regression case. `pnpm typecheck`, `pnpm test` (107/107 in 7 files) and `pnpm test:tz` (49/49 in each of the 3 TZs) passed. This repairs the specified behavior; it adds no feature.

- Further build-gate polls: 12:16 SGT load 17.58/13.06/9.21, 56% free; 12:18 11.21/12.00/9.20, 53% free but Amazon Playwright running; 12:19 11.70/12.04/9.37, 53% free with both Amazon and DEV Playwright detected. Continue waiting; DEV priority honored.

- Final S1 verification (18 Oct 2026): `pnpm install --frozen-lockfile` passed with pnpm 12.11.2; `pnpm typecheck` passed; `pnpm test` passed 107/107 in 7 files; `pnpm test:tz` passed 49/49 in 3 files for each of UTC, America/Los_Angeles and Pacific/Kiritimati. No skipped tests. `pnpm build` passed (TypeScript + 47 Vite modules). Build log: /tmp/basics-slot2-build.log. Vite reported 1.77 s with start uptime 12:27 SGT, load 7.17/12.40/11.88, and end uptime 12:27, load 6.83/12.25/11.83; the immediately preceding memory check was 54% free. These are observed command output, not an OCR/performance benchmark.

- Heavyweight gate record: initial gating check 12:09 → build ran 12:27 (approximately 18 minutes elapsed, with implementation and light checks continuing during part of the wait). Remaining polls: 12:21 load 15.19/18.85/13.03, 58% free, only persistent T3 browser; 12:24 load 13.59/16.25/12.90, 54% free, Amazon Playwright running; 12:27 load 6.83/12.43/11.89, 54% free, only the idle shared T3 browser infrastructure. No other heavyweight job was detected at build start. The current one-minute load was the load gate; historic averages are recorded for context. DEV priority respected. No foreign process stopped.

- Final production-browser equivalent: `pnpm preview` (log /tmp/basics-slot2-preview.log), T3's Playwright-backed browser at http://127.0.0.1:4188/?today=2026-10-20, 1280×800. Pasted the exact receipt and policy text: earbuds waiting, shirt Sat 7 Nov, mug Thu 29 Oct, scarf not returnable, exactly one question and visible simulated-today badge. Changed purchase to 06/10, answered delivery 10/10: earbuds Sat 24 Oct, shirt Thu 5 Nov, mug Tue 27 Oct. Corrected back to 08/10: earbuds stayed Sat 24 Oct, shirt Sat 7 Nov and mug Thu 29 Oct, with two was→now badges and '2 deadlines updated'. Inspected all four item texts. Browser console error count 0; inspected resource origin count outside 127.0.0.1:4188 was 0. Start over confirmation cleared all item cards and the receipt text. Try the sample then fetched both public text twins, showed Synthetic sample and restored the expected initial outcomes. This is a local text-flow smoke test, not the later full OCR/export X1–X7 suite. Owned preview server and browser tab stopped.

- Screenshots saved outside Git and visually reviewed: /tmp/basics-slot2-shots/slice1-workspace.png; /tmp/basics-slot2-shots/production-correction.png; /tmp/basics-slot2-shots/production-answered.png. All are 1280×800. Scrolling is needed for the lower cards in this functional layout; slot 4 owns polish.

- Slot 3 handoff: `documentFromText()` is temporarily exported by src/domain/receipt-parser.ts, per the S1 brief; move it to src/extract/input.ts when adding OCR/PDF routing. Public receipt-demo.txt and policy-demo.txt are temporary sample twins. The exact §4 contracts remain in src/domain/types.ts; `emptyCase`, `caseReducer` and `useCaseStore` expose the text case/store baseline. OCR/PDF/CSP belong to slice 3; export buttons are deliberately disabled with '(coming in a later slice)'; exports/persistence/visual polish belong to slots 3–4. No main merge, push, deployment or conversation-history copy performed. [JOHAN: hands-on check pending]
