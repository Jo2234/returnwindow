# S4 repository and artifact audit

2026-10-18 13:56:52 SGT. Auditor: original GPT-6.1 Sol HIGH slot1. Scope is local technical preparation for lead review; no publication, legal audit, repository visibility check or security certification is claimed.

## Reachable-history baseline

Audited exact merged main 84e00be46f096e5bb8cb2df512c2e106e94c9a11 before S4 edits, with all four existing branch refs retained. All refs reachable via git rev-list --all were included, not only main's latest diff.

| Measure | Observed count |
|---|---:|
| Reachable commits / objects |29 / 366|
| Unique historical blobs |195|
| Text / binary blobs |191 / 4|
| Total unique blob bytes |2418999|
| Unique historical paths / tracked files at merge |130 / 130|
| Broad credential-word blobs |48|
| Specific credential-pattern candidates (blobs/commit messages) |0 / 0|
| Forbidden generated/private paths in any reachable tree |0|
| Unrelated source-path inventory findings |0|

Method: Node scratch helper s4-audit.cjs invokes git rev-list --all, git rev-list --objects --all, git cat-file --batch-check and --batch; scans every unique blob's bytes (binary classified separately, ASCII credential patterns still scanned), commit messages, and git ls-tree -r historical paths. Specific patterns cover private-key headers, provider/PAT/AWS-shaped keys, JWT-shaped strings and quoted secret assignments. It outputs counts/object IDs only, never matched values. The broad words secret/token/password/api-key are present in copied curriculum privacy guidance, parser/field names and project security prose; this broad bucket alone is not a credential finding. No specific candidate required remediation. Pattern scanning cannot prove arbitrary prose or an unknown credential format safe; provenance/source review and the scoped path inventory complement it.

Before commit, the same helper scanned all 16 intended staged files' index bytes: zero credential-pattern candidates. The updated index contains 139 tracked files, with generated/private paths still excluded. git diff --cached --check and explicit staged-path/diff review apply. Postcommit counts can differ because S4 adds documentation; the full final audit is reported with the worker's final SHA, while this baseline remains reproducible. No history rewrite, deletion, reset, stash or credential-store read.

## Private context, paths and synthetic fixtures

Learner-profile is untracked, git check-ignore -v attributes it to /devpost/learner-profile.md, and no reachable historical tree includes it. .env/.env.* are ignored; the negated secret-free .env.example exception is retained. All user personal answers remain [JOHAN] placeholders and are not copied into the public map. Explicit delegated approvals and Opus/Astra/Sol attribution are preserved.

Historical/current path inventory excludes node_modules, caches, dist, public/ocr, test-results and playwright-report; no related blob was ever tracked on reachable refs. Ignore probes passed for dependencies/build/OCR/test artifacts. The allowed source inventory consists of installed course files, ReturnWindow source/tests/config, synthetic fixtures, samples and project docs; unrelated inventory findings 0.

There are15 tracked fixture files. All four expected JSONs explicitly have synthetic:true; nonblank ground truth names JUNIPER LANE GOODS and 8 Oct 2026, four amounts 8900/4590/1850/1200 and total 16540. Clean/messy HTML is project-written synthetic text with the fictional address; public receipt image/text/policy twins retain fixture bytes. Golden output provenance is the accepted real engine recording, not a new OCR run. The four unique binary blobs are three generated PNGs and a text-layer PDF, previously reviewed in G3/G4. Source/provenance review does not claim a new binary OCR/visual pass. No real receipt, customer identity or unrelated source was introduced.

## Licence and notice review

Root LICENSE is MIT, Copyright (c) 2026 Jo2234. Installed Devpost pack remains MIT © 2026 Devpost. Existing dependency inventory has6 runtime and11 development dependencies across10 reported transitive licence groups. ical.js/MPL-2.0 and jsdom are dev-only independent parsers, not imported by application source.

Read docs/licenses.md, docs/licenses.json, docs/ocr-assets.json and scripts/copy-ocr-assets.mjs; the accepted asset manifest has11 files/31334499 bytes, including3 distribution notice files. The script copies notices/workers/core/WASM/English traineddata from installed packages into ignored public/ocr; S4 did not run it, fetch packages or rehash a new build.

Unresolved flags are retained exactly: caniuse-lite CC-BY-4.0 data; model-specific English traineddata upstream notice/provenance not independently substantiated by installed package metadata; dev-only mdn-data CC0-1.0 data. Existing package MIT/Apache attribution is not new proof of the model-specific notice. No unsupported resolution or public-release clearance.

## App-map static validation

Command from original worker scratch: node s4-static-check.cjs. **PASS: 202 assertions**: balanced234 tags, language/title/viewport, unique IDs,21 valid offline relative/fragment links,11 real source-symbol anchors, exactly three stops, run/snapshot/evidence content, no scripts/event handlers/CSS fetch/import or active embeds, deny-external CSP. Six copied lead records compare byte-identical. Checklist keeps five mechanical slices checked and seven human/wrap-up boxes unchecked.

App-map:10710 UTF-8 bytes. SHA-256:

`3cfd682f37da5c86229c854dd0be0f8086a4774a6efc5c92056fcf713035a1dc`

This is source/HTML validation, not a browser/visual result. [Native preview proposal](s4-appmap-visual-request.md) READY; no browser/server started. Agent viewing later would still not satisfy showing it to Johan.

## Evidence limits retained

G4 native downloads reported success ICS3031 B/HTML473344 B, but paths disappeared after the tab was closed. Native payload read NOT COMPLETED; no retained native copies. Acceptance uses separately passed S3 actual file reads and independent ical.js/HTML/print checks plus live G4 UI observations. No assertion waived or redundant rerun. Raw /tmp/basics-g4-lead-walkthrough/, /tmp/basics-slot2-s3-{shots,grant-1342}/ and prior S2 failures remain untouched.

Optional scanned-PDF browser and separate unmount scenarios remain unexercised; narrow evidence-table final-column wrapping remains a minor accepted visual limitation. All personal hands-on/final review/learning/Calendar/print/video/submission/release gates are pending. No final Astra judging pass. No export or push in this assignment; lead reviews artifacts before exporting.
