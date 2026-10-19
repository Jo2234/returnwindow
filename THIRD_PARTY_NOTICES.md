# Supplementary model and data notices

Prepared by GPT-6.1 Sol HIGH, 19 October 2026. This supplements [the dependency inventory](docs/licenses.md); it does not replace other upstream notices or assert legal clearance. ReturnWindow project code is MIT. Third-party assets keep their own terms.

## English OCR model — Apache-2.0 data

The installed `@tesseract.js-data/eng@1.0.0/4.0.0/eng.traineddata.gz` is unchanged. The npm package labels itself MIT; its decompressed model matches official Tesseract tessdata content at revision `ced78752cc61322fb554c280d13360b35b8684e4`. The model's applicable upstream data licence is Apache-2.0, supported by the pinned [README](https://github.com/tesseract-ocr/tessdata/blob/ced78752cc61322fb554c280d13360b35b8684e4/README.md) and [LICENSE](https://github.com/tesseract-ocr/tessdata/blob/ced78752cc61322fb554c280d13360b35b8684e4/LICENSE).

Credits: Tesseract tessdata contributors and the Naptha/Tesseract.js data-package maintainers. ReturnWindow does not train, retune or modify the model. Preserve the [model notice](docs/notices/eng-traineddata-NOTICE.txt), [complete Apache-2.0 licence](docs/notices/eng-traineddata-LICENSE-Apache-2.0.txt) and [content-identity record](docs/notices/eng-model-provenance.json) with distributions containing the model. No project MIT label is applied to those model bytes.

## caniuse-lite 1.0.30001816 — CC BY 4.0 data

Browser-compatibility data source: [caniuse.com](https://caniuse.com/). Credit Can I Use / Alexis Deveria and contributors, plus caniuse-lite contributors (npm package author: Ben Briggs). caniuse-lite reduces/packs the upstream database; that prior transformation is described in its [pinned README](https://github.com/browserslist/caniuse-lite/blob/6301f4a091b7fe2ea8037c1aceb2b7239072b7d3/README.md). ReturnWindow makes no intentional changes to the installed dataset.

Data is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/); the [full installed licence text](docs/notices/caniuse-lite-LICENSE-CC-BY-4.0.txt) is retained unchanged. It includes the disclaimer of warranties. No endorsement is implied. The upstream attribution request is to identify caniuse.com as the source; this notice does so. If redistributing package/data bytes, retain supplied credits/notices, source/licence links, disclaimer and modification history as applicable under section 3(a). Do not represent this data as project-MIT.

In this project it is a development/build dependency through plugin-react → Babel → Browserslist, not an application runtime dependency. Neither node_modules nor this dataset is committed. Keep this notice with any fuller distribution that does include it.

## mdn-data 2.27.1 — CC0-1.0 data

Credit: Mozilla Developer Network / MDN contributors. Source: [mdn/data at the npm gitHead](https://github.com/mdn/data/tree/8b1079528c02bd3eb6f180e47011cf2075849961). The unchanged [installed CC0 text](docs/notices/mdn-data-LICENSE-CC0-1.0.txt) is retained for provenance. CC0 uses a rights waiver/fallback rather than CC BY's attribution condition; keeping the source/notice does not relabel it as project-MIT.

This is development/test data through jsdom → css-tree. No application source imports it, and the OCR copier does not copy it.

## Distribution status

This source tree carries the supplementary notices. The historical S3 build had no separate model-data notice pair; the new combined6cd7b5c build under0909 includes both. All13 public/dist asset comparisons completed, including exact source byte/SHA matches for the pair and unchanged original11. The raw harness remains FAIL/exit1 at cleanup; separate post-exit cleanup and master release are recorded in [the review](docs/process/evidence-notice-review-20261019.md). [The research report](docs/notices/provenance-investigation-20261019.md) and [bounded copy receipt](docs/process/notice-packaging-20261019.md) preserve the earlier light checks and the now-completed packaging comparisons separately from the substantiated upstream model licence chain.
