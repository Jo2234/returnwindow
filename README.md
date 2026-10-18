# ReturnWindow

ReturnWindow tells you the last day to return each item on a receipt and shows the exact supporting line from the store's supplied policy; it asks about ambiguity and refuses to guess.

Status: G2 text kernel locally verified; OCR/PDF and export stages pending

The paste-text receipt/policy flow, per-item deadlines, uncertainty questions, evidence highlighting and corrections are implemented. The approved planning/build documents are:

- [Scope](devpost/scope.md)
- [Product requirements](devpost/prd.md)
- [Technical spec](devpost/spec.md)
- [Build checklist](devpost/checklist.md) — fast mode; slices 1–2 implemented

## How this was built

This repository started empty on 18 Oct 2026. Its first action was `npx -y skills add challengepost/learn-ai-basics --all -y`; the first commit contains exactly the installer output. The [Devpost Learn Skill Pack](https://github.com/challengepost/learn-ai-basics) is MIT © 2026 Devpost. Installed 1-start → 2-scope → 3-prd → 4-spec and 5-build planning were executed by a Codex GPT-6.1 Sol agent; subsequent Sol work implemented 5-build slices 1–2.

Claude Opus 5.5 HIGH authored the original plan and G1/G2 reviews. GPT-6 Astra HIGH continues specification/review/coordination in the same lead thread after authorized quota fallback; neither lead writes application code or tests. GPT-6.1 Sol HIGH implements the application. The lead plan was written outside this folder on 18 Oct 2026 and [copied in after the skill-generated docs](docs/opus/README.md). Learner-side product answers came from the pre-approved brief; approvals were delegated. Personal answers, hands-on checks and final personal review remain Johan's. See the [skill-pack run log](docs/process/skill-pack-run-log.md).

No pre-existing application code was incorporated. Third-party course files are disclosed above; later implementation uses the pinned open-source libraries in the spec. Planned runtime: on-device Tesseract LSTM OCR and deterministic rules, with no generative model computing deadlines, no account and no uploaded receipt. Only synthetic Juniper Lane Goods data will be used in fixtures and the demo.

The repository stays private until Johan explicitly authorizes release. Video, submission copy, personal learning reflections and public release/submission are later Johan gates.

[MIT License](LICENSE) — Copyright (c) 2026 Jo2234.
