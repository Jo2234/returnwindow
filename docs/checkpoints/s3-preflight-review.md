# S3 preflight review — GPT-6 Astra HIGH, 18 October 2026

This is a review finding for the upcoming export stage, not an application change or a completed test. Resolve through the existing lead plan/spec reconciliation and installed skill flow before S3 implementation.

## F3: relative all-day alarm does not guarantee 09:00 Singapore

The product plan §2 promises 09:00 SGT on the preceding day, but §10.6 and the generated spec request `TRIGGER;RELATED=START:-PT15H` on a DATE-only event. RFC 5545 §3.8.6.3 specifies that this relative trigger uses the calendar user's configured timezone (UTC if absent). It therefore cannot guarantee Singapore time.

Source checked 18 October 2026: https://www.rfc-editor.org/rfc/rfc5545#section-3.8.6.3 (relative DATE alarms and absolute UTC triggers).

Recommended correction, within the accepted Singapore convention: keep DTSTART/DTEND all-day dates; use an absolute UTC DATE-TIME trigger representing 09:00 Asia/Singapore on the preceding civil day. For the 24 Oct 2026 deadline, the independent expected value is `TRIGGER;VALUE=DATE-TIME:20261023T010000Z`. For 7 Nov: `20261106T010000Z`; for 29 Oct: `20261028T010000Z`. Do not include RELATED with an absolute DATE-TIME trigger. Independent ical.js and raw checks must confirm these values and DATE-only event boundaries. Add a month/year boundary case. This is a specification correction, not permission to weaken tests silently. Calendar-app import remains Johan's hands-on check.

Other S3 precision checks: I1's title-case example conflicts with its explicit rule to use store field verbatim; use the actual stored value and document the reconciliation. §14's Start over then reload cannot restore a deliberately cleared sample; use the scarf refusal beat or reload the sample, reapply its corrections and answer before export. Avoid claiming automatic restoration after Start over.

## G3 review checklist

- Real OCR output recorded, ground truth written before OCR; no hand-edited golden data.
- Real local worker/core/language assets; production CSP; requests include worker activity and stay same-origin.
- Abort/cancel terminates work, revokes resources and cannot let late results overwrite newer inputs. Test a cancelled/replaced receipt path.
- PDF text reading order and malformed/scanned fallback are explicit; no claim beyond actual tests.
- Input limits apply before extraction; failure/manual/paste recovery usable.
- Four clean/PDF items and exact amounts; failed blank image; actual messy output and check flag.
- All heavyweight runs named in master grants; exact checkout/SHA and results recorded.
