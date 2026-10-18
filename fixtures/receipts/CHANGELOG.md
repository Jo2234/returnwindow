# Synthetic receipt fixture changelog

Ground truth was written before rendering or OCR. Only Juniper Lane Goods synthetic data is used. Golden OCR files are generated from actual engine output and never hand-edited.

Iteration 1 outcome: actual messy date `05/10/2026`, parsed as `2026-10-05`, field/line confidence 92, date-word confidence 80, `needsCheck: true` (day/month ambiguity). The intended `06/10/2026` misread was not obtained. No retry or additional iteration was authorized or performed. Both clean and messy extractions retained all four exact item amounts and the 16540-cent total. PNG sizes: clean 39,917 bytes; messy 351,671 bytes; blank 3,001 bytes. Text PDF: 27,440 bytes. Real O1–O4 plus nine adapter checks passed (13/13) under grant `heavy-basics-s2a-slot2-20261018-1258`.

- Draft iteration 1: clean 600×800 receipt, 18px Courier New at 32px line height, exact receipt-demo.txt content. Messy version uses a 1.5° rotation, deterministic SVG paper noise, .15px blur, and a faded/masked upper-right of the purchase date’s 8. Target misread: 06/10/2026. **Not rendered or OCR-tested yet; master grant required.**

- 2026-10-18T05:00:46.569Z: rendered iteration 1; OCR not inferred from appearance. 13:00  up 9 days,  1:44, 3 users, load averages: 2.96 3.10 4.51

- 2026-10-18T05:00:47.605Z: real OCR recorded by script. receipt-demo-clean, iteration 1: 842 ms; 13:00  up 9 days,  1:44, 3 users, load averages: 2.96 3.10 4.51; OCR date line {"text":"Order date: 08/10/2026 14:32","confidence":95,"bbox":{"x0":39,"y0":143,"x1":349,"y1":156},"words":[{"text":"Order","confidence":94,"bbox":{"x0":39,"y0":144,"x1":91,"y1":155}},{"text":"date:","confidence":96,"bbox":{"x0":104,"y0":144,"x1":153,"y1":155}},{"text":"08/10/2026","confidence":95,"bbox":{"x0":169,"y0":143,"x1":274,"y1":156}},{"text":"14:32","confidence":95,"bbox":{"x0":299,"y0":143,"x1":349,"y1":155}}]}.

- 2026-10-18T05:00:48.466Z: real OCR recorded by script. receipt-demo-messy, iteration 1: 854 ms; 13:00  up 9 days,  1:44, 3 users, load averages: 2.96 3.10 4.51; OCR date line {"text":"Order date: 05/10/2026 14:32","confidence":92,"bbox":{"x0":40,"y0":137,"x1":351,"y1":157},"words":[{"text":"Order","confidence":96,"bbox":{"x0":40,"y0":137,"x1":92,"y1":150}},{"text":"date:","confidence":96,"bbox":{"x0":105,"y0":139,"x1":154,"y1":152}},{"text":"05/10/2026","confidence":80,"bbox":{"x0":170,"y0":140,"x1":275,"y1":155}},{"text":"14:32","confidence":96,"bbox":{"x0":300,"y0":144,"x1":351,"y1":157}}]}.
