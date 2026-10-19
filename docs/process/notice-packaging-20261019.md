# Model notice packaging — bounded light check, 19 October 2026

Original GPT-6.1 Sol HIGH slot1. Lead source review accepted the pinned model disposition and explicitly authorized the two-local-file copier/manifest amendment. No model, lockfile, fixture, application/style or test change. No install, build, OCR, full suite or browser command.

## Implemented scope

- scripts/copy-ocr-assets.mjs appends a local-only notice-copy block after the original package assets. Removing that block yields the original accepted script byte-for-byte.
- docs/ocr-assets.json preserves all original11 entries exactly and appends the following two entries. Total13 files/31,347,373bytes, including12,874 added notice bytes.
- The pair was copied to ignored public/ocr locally. The notice explicitly points to the source-repository JSON evidence, which is not an extra runtime asset.

```json
[
  {
    "file": "/ocr/eng-traineddata-NOTICE.txt",
    "source": "docs/notices/eng-traineddata-NOTICE.txt",
    "bytes": 1516,
    "sha256": "bd25056b2ebb52f824e4abbbfec58a9d56651d56b53c23beef9c52fa57c20926"
  },
  {
    "file": "/ocr/eng-traineddata-LICENSE-Apache-2.0.txt",
    "source": "docs/notices/eng-traineddata-LICENSE-Apache-2.0.txt",
    "bytes": 11358,
    "sha256": "cfc7749b96f63bd31c3c42b5c471bf756814053e847c10f3eb003417bc523d30"
  }
]
```

## Commands and actual outcomes

- `node --check scripts/copy-ocr-assets.mjs`: PASS (syntax only).
- `node provenance-20261019/check-notice-copier.cjs` from original worker scratch: PASS13 assertions. Runs only the added notice fragment twice, checks fixed expected entries/totals and copied byte identity, writes the amended tracked manifest; original package/model copier is not executed.
- Existing original public/ocr asset files in main:0. No fresh hash/rebuild of the original11 is claimed; their manifest and original copier code are unchanged, and no original asset is written by this light check.
- Accepted application/style/test/fixture/package/lock content remains at the6b5a58d baseline. Unchanged S3 checks were not repeated.

## Pre0909 handoff (historical; completed outcome below)

Do not merge slot2 at this point. Deliver the exact main commits to existing slot2 (ready87441c5) via lead coordination, so its ONE fresh build validates both the evidence-table layout and these added notices. The lead will request a revised combined frozen-source grant. READY only; no command is authorized by this receipt or an old grant. The fresh run should verify both generated /ocr notice files against these source hashes and unchanged original11 entries, then retain its already planned bounded layout/browser evidence. Full-suite/TZ/OCR repetition is not proposed.

The former upstream model chain is substantiated; static packaging verification is pending. No legal clearance, release, publication, submission or Johan personal/learning sign-off.

Follow-up document integration checker: PASS118 assertions /62 relative Markdown links, unchanged map CSS/tag/attribute structure, unchanged seven unchecked human gates, two exact control-record copies and preserved attributed-draft placeholders. Its first expanded-scope invocation failed because the scratch-only path allowlist omitted the newly authorized root THIRD_PARTY_NOTICES.md; that harness allowlist was corrected and the check passed. No application test was changed. `git diff --check` passed for this amendment; the earlier verbatim upstream CC BY licence whitespace exception is recorded in the provenance investigation.

## Completed combined packaging comparisons

The later6cd7b5c build under0909 verified all13 public/dist files against the original11 accepted entries and the exact two source notice hashes above. Static packaging verification is completed at that source. The raw harness remains FAIL/exit1 for its group-not-empty cleanup snapshot; later post-root-exit identity/port observations separately resolved process state, and master released0909. See [review](evidence-notice-review-20261019.md), [raw result](evidence-notice-0909-result.json) and [master closure](master-0909-closure.json). No retry/waiver/new run here; earlier light-check limitations remain their historical snapshot.
