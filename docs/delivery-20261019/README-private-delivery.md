# ReturnWindow — private review package

This package is for local technical and personal review. It is not a public release, judging approval, completed upload or submission. See release-notes.md and progress.json for the exact source commit and separately tested commits.

## Open the source locally

Use Node24+ and the project's pinned pnpm12.11.2. From a folder containing repository.bundle:

```sh
git clone repository.bundle returnwindow
cd returnwindow
pnpm install --frozen-lockfile
pnpm dev
```

Open http://127.0.0.1:5188/?today=2026-10-20 . The date override is shown on screen. Dependency installation needs registry access; the running app uses local assets and needs no account or API key. Keep this checkout and its history private. On the shared RP machine, installation/build/browser work still requires a fresh master grant; these commands are local setup guidance, not authorization to start a second RP job.

For production preview after the required local build:

```sh
pnpm build
pnpm preview
```

Open http://127.0.0.1:4188/?today=2026-10-20 . Use the terminal's normal interrupt to stop the server after review. No deployment is required to try the proof of concept.

## Review the important behavior

1. Try the synthetic sample. Compare the purchase field with the full receipt and review the Check this flag. Preserved OCR reads05October; groundtruth is08October.
2. Answer Delivery date with10October. Earbuds should show24October.
3. Correct purchase date to08October. Shirt should move04→07November, mug26→29October; earbuds should stay24October. Follow each policy passage and inspect the final-sale scarf refusal.
4. Download reminders and evidence. Inspect the actual Calendar import and print/PDF output yourself; agent file assertions are not a claim about your Calendar app or printer.
5. Reload to restore the imageless case. Startover then reload must stayempty.

The repository's devpost/app-map.html explains the code route and can be opened offline with the source alongside it. Agent desktop/mobile review is recorded; your viewing or learning has not been assumed.

## Package guide

- repository.bundle and optional source archive: committed source/history, main only advertised by the bundle.
- publish-ready.json: exact source commit for the scoped private relay; not an upload receipt.
- progress.json, blockers.json, batch-results.md: actual checks, remaining gates and setup actions.
- release-notes.md and final-handoff.md: behavior, tested/source provenance and limitations.
- demo-storyboard.md: factual shot plan, not personal narration or a recorded video.
- submission-draft.md: explicitly AI-prepared private draft under19October authorization; review it, replace personal placeholders yourself and check current form fields before use.
- evidence directories: retained screenshots/test/request/cleanup records. Missing G4 native downloaded-byte copies are not recreated or claimed.

Human planning/hands-on/finalreview/learning/Calendar/print/video/release/submission gates remain yours. Do not change repository visibility or submit anything based solely on this package. The main-Mac relay owns private GitHub uploads and verifies their resulting SHA separately.

---
Original private setup/package guide: GPT-6 Astra HIGH, control/plans/basics/delivery-20261019/README-private-delivery.md. Source SHA-256: aa21d44086f3fd8d527c2f720e444d3b597e6ab9d24858e02dd02b32c60f259b. Copied by original GPT-6.1 Sol HIGH slot1 on19October2026. The original setup text is retained verbatim above; this is a source-repository copy for the lead's later package, not a claim that a bundle/progress/relay receipt has already been produced.

Reviewed combined build/source: 6cd7b5c0418a6e06d8efd60a463fd8dac728bb7c; integration merge: 64f8e339c2f4d7503e4d5612564bb3274c73a799. Subsequent source changes in this assignment are documentation only. The final package manifest must identify the final documentation HEAD; this file does not invent a self-referential commit ID. Build exited0 and the13 local asset matches completed under0909; the raw browser harness remains FAIL/exit1 for its cleanup snapshot, with separate later post-exit cleanup/master release evidence. See [release notes](release-notes.md) and [review](../process/evidence-notice-review-20261019.md). All human gates remain pending.
