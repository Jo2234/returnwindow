# Installed model and data provenance — 19 October 2026

Research/integration: original GPT-6.1 Sol HIGH slot1. Baseline main `6b5a58d362d9936d73122a199d77c3217d4fa6f8`; accepted application `b702e4fe5deb639185dea3ea6ff891029aff0aac`. Main was kept clean during the native app-map grant. New scope permits docs/notices integration after its release. No model, lockfile, fixture, application or test was replaced; no OCR/model execution, install, build, full suite or browser run.

## Exact model chain

Read the installed package location recorded by accepted docs/licenses.json, without changing another worktree. Package metadata/index select4.0.0, MIT metadata, no model-specific licence file. Npm registry [version metadata](https://registry.npmjs.org/@tesseract.js-data%2feng/1.0.0) names gitHead `b86746569320a6103cea84cc2b8d9ee74f0f45d3`.

| Representation | Bytes | SHA-256 | Git blob SHA-1 |
|---|---:|---|---|
| Installed gzip | 10923060 | ed350f3752f81ee8f38769edc14d92d997dababe23b565c59879372cc46a2468 | e83c1267675ff3a6641b110002363782db7a1885 |
| Decompressed bytes | 23466654 | daa0c97d651c19fba3b25e81317cd697e9908c8208090c94c3905381c23fc047 | f4744c201359d02ced6914c77f0de68ee9bbdd74 |

Both Git blob IDs were computed over `blob <byteLength>\0<bytes>`, not inferred from the filename. The gzip byte length and ID match the [Naptha API object at npm gitHead](https://api.github.com/repos/naptha/tessdata/contents/4.0.0/eng.traineddata.gz?ref=b86746569320a6103cea84cc2b8d9ee74f0f45d3). The decompressed length and ID match the [official tessdata API object](https://api.github.com/repos/tesseract-ocr/tessdata/contents/eng.traineddata?ref=ced78752cc61322fb554c280d13360b35b8684e4). The local gzip SHA-256 also matches accepted docs/ocr-assets.json and the tested-dist manifest.

The [official pinned README](https://github.com/tesseract-ocr/tessdata/blob/ced78752cc61322fb554c280d13360b35b8684e4/README.md) applies Apache-2.0 to repository data, with the [full licence](https://github.com/tesseract-ocr/tessdata/blob/ced78752cc61322fb554c280d13360b35b8684e4/LICENSE). Naptha's [current pinned README](https://github.com/naptha/tessdata/blob/806cd9adc8c6e8abc11c782db1818c990576bebc/README.md) identifies4.0.0's source as official tessdata and documents the npm distribution. Its current [licence](https://github.com/naptha/tessdata/blob/806cd9adc8c6e8abc11c782db1818c990576bebc/LICENSE) is Apache-2.0 too. The earlier npm-gitHead root LICENSE request returned404; neither inspected root supplied a separate NOTICE endpoint. Those absences do not turn package-MIT into the model licence: the exact official model match and official data-licensing statement establish the source-backed distinction.

Disposition: the former missing model-specific upstream chain is now substantiated at the file/licence level. Preserve package MIT metadata separately, carry the model's Apache-2.0 text/notice, and keep the exact model/fixtures. This is not an audit of training-corpus rights, a legal clearance, a numerical accuracy claim or an assertion of a byte-by-byte second remote model download. GitHub supplied Git SHA-1 content addresses; the installed SHA-256 was computed locally.

## Dependency scope and notices

Read152 installed package metadata records from the accepted inventory, and traversed dependencies/optionalDependencies without executing them. Peer-only links were excluded; source imports, copier and accepted19-file dist manifest were also inspected.

- caniuse-lite1.0.30001816: root dev plugin-react5.2.0 → Babel/core7.29.7 → helper-compilation-targets7.29.7 → Browserslist4.29.3 → caniuse-lite.
- mdn-data2.27.1: root dev jsdom30.1.3 → css-tree3.2.1 → mdn-data.
- No path from the six runtime root dependencies to either dataset appeared in this metadata graph. No src import or OCR-copy entry targets either. They are build/test dependencies here; node_modules and data directories are not tracked or separately copied into the static output. No new linker trace or rebuild of minified bundles is claimed.

The installed caniuse-lite LICENSE (18,651bytes, SHA256 fd3a263fe19ed8faa9068b43abaebafc02c77897b0c6fc09abc04bb592e5f16e) exactly equals [upstream at npm gitHead 6301f4a091b7fe2ea8037c1aceb2b7239072b7d3](https://github.com/browserslist/caniuse-lite/blob/6301f4a091b7fe2ea8037c1aceb2b7239072b7d3/LICENSE). Its source [README](https://github.com/browserslist/caniuse-lite/blob/6301f4a091b7fe2ea8037c1aceb2b7239072b7d3/README.md) requests credit to caniuse.com. The [official Can I Use about page](https://caniuse.com/ciu/about) identifies Alexis Deveria/community and CC BY4.0 support data.

CC BY4.0 [section3(a)](https://creativecommons.org/licenses/by/4.0/legalcode.en#s3a) conditions sharing on retaining supplied creator/copyright/licence/disclaimer/source information, identifying modifications, and providing the licence text/link in a reasonable medium. The root supplementary notice supplies the requested source credit, upstream packaging history, no intentional project dataset changes and the unchanged licence text. CC-BY data status remains explicit; lack of an OSI software label is not recharacterized as a model blocker or relicensed away.

Installed mdn-data LICENSE (6,555bytes, SHA25636ffd9dc085d529a7e60e1276d73ae5a030b020313e6c5408593a6ae2af39673) exactly equals [upstream npm gitHead 8b1079528c02bd3eb6f180e47011cf2075849961](https://github.com/mdn/data/blob/8b1079528c02bd3eb6f180e47011cf2075849961/LICENSE). Its [pinned README](https://github.com/mdn/data/blob/8b1079528c02bd3eb6f180e47011cf2075849961/README.md) identifies MDN-maintained web data. Retain CC0-1.0 scope and the original notice; [CC0](https://creativecommons.org/publicdomain/zero/1.0/legalcode.en) uses a waiver/fallback, not a CC-BY attribution condition. No broad licence upgrades.

## Minimal integration and packaging plan

Integrated docs-only files: docs/licenses.md, root THIRD_PARTY_NOTICES.md, and docs/notices/{eng-traineddata-NOTICE.txt,eng-traineddata-LICENSE-Apache-2.0.txt,eng-model-provenance.json,caniuse-lite-LICENSE-CC-BY-4.0.txt,mdn-data-LICENSE-CC0-1.0.txt,this report}. Original licence texts are unchanged. Source-only notices are reviewable now.

If the lead approves static distribution packaging, the narrow copier amendment is two local source files → public/ocr/eng-traineddata-NOTICE.txt and public/ocr/eng-traineddata-LICENSE-Apache-2.0.txt. Append those two entries to the existing manifest using source paths, byte counts and SHA-256; leave all original11 asset bytes/hashes intact. Link the notice's JSON evidence in the source docs, not as a runtime dependency. This is local notice copying, not fetching/replacing a model. Existing build-tested artifacts/manifest remain their original snapshot until that change is separately authorized and verified.

READY light scope: notice/docs review and (if expressly approved) that two-file copier/manifest update. A fresh bounded asset-generation check would need to use the installed accepted dependency roots; main's node_modules is not newly installed here. No full S3 repetition is justified by this research. No slot2 UI/style/test changes are integrated by this worker.

## Research receipt and limits

Public metadata/notices were fetched with25s/1MiB response bounds; source-cache/fetch receipts and read-only hashing/dependency scripts stay in original worker scratch. No remote model binary, install or executable download was used. Initial npm calls returned406 because a GitHub-specific Accept header was reused; corrected application/json requests succeeded. The failed responses and historical LICENSE404 are retained. No authentication or secret search.

No legal clearance, public release or submission is declared. Human gates and the G4 native missing-download-byte limit remain unchanged.

Notice fidelity: plain `git diff --cached --check` reports the original caniuse-lite LICENSE trailing space at line52. It is intentionally preserved for byte identity with the installed/upstream licence. Authored docs are checked separately with the three verbatim LICENSE files excluded; no persistent Git whitespace configuration is changed.
