# ReturnWindow

ReturnWindow tells you the last day to return each item on a receipt and shows the exact supporting line from the store's supplied policy; it asks about ambiguity and refuses to guess.

Status: G3 local OCR/PDF input verified; calendar/evidence exports, persistence and final polish pending

Receipt images now use real on-device English OCR; text-layer PDFs, pasted text and text files feed the same editable workspace. Per-item deadlines, uncertainty questions, evidence highlighting and corrections are implemented. On installation, the project's asset-copy step generates ignored `public/ocr/` worker/core/WASM/model files from installed packages. They are served from the app's own origin; the PDF worker is bundled locally. No CDN or remote OCR service is used.

The actual synthetic messy receipt was read as **5 Oct 2026**, against ground truth **8 Oct 2026**. Correcting 05→08 changes the shirt deadline **4→7 Nov** and mug **26→29 Oct**; earbuds anchored to delivery on 10 Oct stay **24 Oct**. These are recorded observations from the fictional Juniper Lane Goods sample.

The [G3 review](docs/checkpoints/g3-review.md) and [handoff](docs/checkpoints/g3-handoff.md) record the prior granted verification: frozen install/typecheck, 113 unit tests, 49 tests in each of three timezones, 13 OCR/adapter tests, production build and production browser walkthrough passed. Build-tested commit: `b360f1031ef65531794c60b4ded891e81e44d5be`; browser-tested commit: `cc0534311453a107f5588f429e387044682f582c`. Later commits changed documentation only. Browser evidence recorded 31 same-origin requests, zero external requests and zero console/page errors under the original production CSP; real image/PDF input, correction, blank-image recovery and cancellation/replacement passed. The earlier browser harness date-format failure is retained in the review history. This integration assignment reruns no app checks.

Calendar/evidence exports, persistence, final visual polish, full final E2E/G4 and the S4 audit remain pending. The optional scanned-PDF browser path and a separate browser unmount scenario were not exercised. The long workspace and action-bar overlap need the planned polish pass. [Licence provenance flags](docs/licenses.md) for caniuse-lite CC-BY-4.0 data and the model-specific traineddata upstream notice remain open before public release.

The approved planning/build documents are:

- [Scope](devpost/scope.md)
- [Product requirements](devpost/prd.md)
- [Technical spec](devpost/spec.md)
- [Build checklist](devpost/checklist.md) — fast mode; slices 1–3 mechanically complete, Johan hands-on checks pending

## How this was built

This repository started empty on 18 Oct 2026. Its first action was `npx -y skills add challengepost/learn-ai-basics --all -y`; the first commit contains exactly the installer output. The [Devpost Learn Skill Pack](https://github.com/challengepost/learn-ai-basics) is MIT © 2026 Devpost. Installed 1-start → 2-scope → 3-prd → 4-spec and 5-build planning were executed by a Codex GPT-6.1 Sol agent; subsequent Sol work implemented 5-build slices 1–2.

Claude Opus 5.5 HIGH authored the original plan and G1/G2 reviews. GPT-6 Astra HIGH continues specification/review/coordination in the same lead thread after authorized quota fallback; neither lead writes application code or tests. GPT-6.1 Sol HIGH implements the application. The lead plan was written outside this folder on 18 Oct 2026 and [copied in after the skill-generated docs](docs/opus/README.md). Learner-side product answers came from the pre-approved brief; approvals were delegated. Personal answers, hands-on checks and final personal review remain Johan's. See the [skill-pack run log](docs/process/skill-pack-run-log.md).

No pre-existing application code was incorporated. Third-party course files are disclosed above; later implementation uses the pinned open-source libraries in the spec. Planned runtime: on-device Tesseract LSTM OCR and deterministic rules, with no generative model computing deadlines, no account and no uploaded receipt. Only synthetic Juniper Lane Goods data will be used in fixtures and the demo.

The repository stays private until Johan explicitly authorizes release. Video, submission copy, personal learning reflections and public release/submission are later Johan gates.

[MIT License](LICENSE) — Copyright (c) 2026 Jo2234.
