# ReturnWindow — private submission draft

Prepared by GPT-6 Astra HIGH under Johan's explicit 19 October 2026 request for a submission draft. This supersedes the earlier preparation-only instruction for this draft, but does not claim Johan wrote, approved or submitted it. Technical prose is grounded in the implemented app; personal sections remain for Johan. Current form wording and field limits have not been checked in this preparation pass. Nothing has been published.

## Project name

ReturnWindow

## Short description

Turn a mixed-item receipt and a supplied store policy into separate return deadlines, each linked to its evidence. Review an uncertain date, answer an ambiguous rule, then export reminders and a printable evidence pack—all locally in the browser.

## What it does

A single receipt can contain items with different return rules. ReturnWindow associates each item with a supported passage from the policy supplied by the user. It shows the deadline and its basis, asks a question when the start of a return window is ambiguous, and refuses to invent dates when rules are missing, unsupported or conflicting.

Receipts can be read through local image OCR, PDF text extraction or pasted text. The extracted fields remain editable. In the synthetic demo, OCR reads the purchase date as 5 October instead of 8 October. Correcting it moves the shirt and mug deadlines by three days while the delivery-based earbuds deadline stays unchanged. Each result can be traced back to the policy text.

The app exports all-day calendar events for computed, unexpired deadlines, with reminder instants for 09:00 Singapore time on the preceding day. A self-contained HTML evidence pack includes the item results, quoted passages, offsets, policy fingerprint, answers and correction history. A single imageless case can be restored locally after reload; Start over deliberately clears it.

## Who it is for

The proof of concept targets shoppers dealing with a mixed-item receipt and an English store policy, using an explicit Singapore calendar-date convention. It does not interpret legal rights or decide whether an item meets return conditions.

[JOHAN: Confirm the intended audience in your own words. Add personal motivation or real experience only if true. No customer interviews, user validation or measured impact are claimed.]

## How it was built

React and TypeScript provide the interface. Tesseract.js performs on-device OCR using locally served worker, core and English model assets; PDF.js extracts PDF text. Deterministic parsers and date rules compute the deadlines. Zod validates locally saved cases. No generative model computes a return date, and no backend or API key is needed for the app.

The Devpost Learn skill pack was genuinely installed and used to create the planning documents and build checklist. Claude Opus 5.5 HIGH authored the original engineering plan and early reviews; GPT-6 Astra HIGH continued specification and review after an authorized quota fallback; GPT-6.1 Sol HIGH implemented and tested the application. Routine planning approvals were delegated by Johan. Personal hands-on and learning checkpoints have not been represented as completed.

## Technical challenges and evidence

An ambiguous policy clock needs an explicit answer rather than a guessed start date. A date correction must update purchase-based items without changing a delivery-based item. These distinctions are exercised by the demo and tests.

Calendar reminders required a specification correction: a relative alarm on an all-day event does not guarantee a fixed Singapore reminder time. The implementation uses explicit UTC alarm instants and independently parses the exported calendar in tests.

The accepted S3 application passed 131 unit tests, 49 date/engine tests in each of three timezones, 13 OCR/adapter tests, six production E2E cases and a production build. The E2E checks read actual downloaded ICS/HTML bytes, and include no-policy refusal, uncertainty, correction, persistence and input recovery. These are local technical results on synthetic fixtures, not evidence of real-world OCR accuracy or user outcomes. Later targeted changes and checks must be listed in the final release notes before this draft is used.

## What I learned

[JOHAN: Write your own reflection. Describe a decision you actually made, what you tried, what changed your understanding, and any limits you noticed. Agent explanations and generated code do not establish your personal learning.]

## What I am proud of

[JOHAN: Add your own assessment after trying the app. Do not claim hands-on use or personal authorship of agent work that did not occur.]

## Next steps

Potential future work includes broader policy-language coverage and more varied, consented receipt testing. These are not implemented claims. The current proof of concept intentionally handles one case and a bounded English-policy grammar.

## Limitations and disclosure

OCR can confidently misread text, so users must review the receipt, fields and conditions. Dates use Asia/Singapore and day zero at purchase or delivery; business-day/holiday interpretation and legal advice are outside scope. Scanned-PDF browser and separate browser-unmount paths were not independently exercised in the accepted browser runs. Calendar-client import and actual print/PDF review remain human checks.

The G4 native walkthrough completed downloads but lost its temporary downloaded-file paths after tab closure; that lead byte inspection was not completed. Export acceptance uses the separately passing S3 actual-file assertions, not a claim that missing evidence was retained.

19 October notice disposition: installed English model bytes match pinned Naptha/official tessdata content IDs, and the official model data licence is Apache-2.0, separate from npm-package MIT. Source notices retain Can I Use CC BY4.0 attribution and dev-only MDN CC0 terms. Static model-notice copying remains proposed; no legal clearance is claimed. The reference app-map passed scoped agent desktop/mobile visual checks, not Johan viewing. Slot2 evidence-table changes and their targeted result remain pending lead coordination before final package wording is updated.

## Links and final declarations

- Repository: https://github.com/Jo2234/hackathon-2026-ai-basics — private; latest relay upload must be verified separately.
- Demo video: [JOHAN: supply an accessible link only after recording and authorized release.]
- Live deployment: none; local browser app.
- Hands-on/final review, personal planning-document review, learning wrap-up, Calendar/print: [JOHAN: pending.]
- Public release, registration and submission: not performed or authorized by this preparation task.


---
Original private draft: GPT-6 Astra HIGH, from control/plans/basics/delivery-20261019/submission-draft.md. Original source SHA-256: b8995b1cf39ab9f93d542368cd1238bf8cd52679a216bc40870f6ad91b073948. Integration/factual notice-map amendments: GPT-6.1 Sol HIGH,19October2026. This is not Johan authorship, personal review, publication or submission.
