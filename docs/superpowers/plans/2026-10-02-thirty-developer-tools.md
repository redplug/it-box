# Thirty developer tools implementation

Approved in conversation: 30 separate browser-only tools, balanced across data, web/API, text, CSS/color and files/units.

## Constraints

- Existing Vue3/Vite4/TypeScript5.2, registry, lazy loading, search and favorites. No new dependencies.
- Strict JSON. New inputs held in memory only, no storage, URL serialization or network requests.
- Text inputs limited to 2MiB UTF-8; images 10MiB and 16 million pixels; hashes 50MiB.
- JSON tables reject more than 100 columns or 100,000 projected cells before allocation.
- Korean and English UI, Korean usage guides, sitemap registration.
- HTTP tools generate quoted fetch/POSIX curl code without execution. HTML uses detached templates without rendering input.

## Deliverables

- /csv-to-json: Convert CSV or TSV into a JSON array using the first row as headers.
- /json-lines-converter: Convert between JSON arrays and JSONL / NDJSON.
- /json-to-typescript: Generate a TypeScript Root type for nested objects and arrays from a JSON sample.
- /json-to-json-schema: Generate a Draft 2020-12 JSON Schema from a JSON sample.
- /json-merge: Recursively merge two JSON objects with right-side values taking precedence.
- /json-pointer: Look up values in JSON using RFC 6901 JSON Pointer.
- /json-table: View an array of JSON objects as a paginated table with a union of columns.
- /env-to-json: Convert between .env settings and flat JSON objects with string values.
- /query-string-converter: Convert URL query strings and flat string-valued JSON objects while preserving repeated keys.
- /http-headers-parser: Parse pasted HTTP headers into a table and JSON while preserving repeated values.
- /cookie-parser: Split pasted Cookie request headers into name/value pairs without overwriting duplicates.
- /http-request-generator: Generate fetch code and POSIX curl commands from HTTP request details.
- /html-to-text: Extract plain text from HTML while decoding entities and retaining block line breaks.
- /html-link-extractor: Extract href and text as JSON and optionally resolve relative links against a base URL.
- /unicode-normalizer: Normalize text with NFC, NFD, NFKC or NFKD and show whether it changed.
- /invisible-character-detector: Locate control characters, NBSP, zero-width characters and bidirectional markers by code point.
- /line-ending-converter: Convert text line endings to LF, CRLF or CR and download the selected bytes.
- /string-escape-converter: Safely convert between plain text and a JSON string literal.
- /text-set-operations: Calculate union, intersection and difference of two line lists while keeping first-appearance order.
- /word-frequency-counter: Count Unicode letter and number tokens and sort them by frequency.
- /css-gradient-generator: Preview a two-color linear gradient and generate CSS from its colors and angle.
- /css-box-shadow-generator: Adjust offsets, blur, spread, color, and opacity to preview and generate box-shadow CSS.
- /css-border-radius-generator: Set each corner radius independently and generate border-radius CSS with a preview.
- /css-clamp-calculator: Calculate fluid font-size CSS in rem and vw from font sizes at two viewport widths.
- /color-contrast-checker: Check contrast and WCAG AA/AAA text thresholds for opaque foreground and background colors.
- /data-size-converter: Convert bits, bytes, SI, and IEC data sizes and compare every supported unit.
- /duration-converter: Convert fixed durations between milliseconds, seconds, minutes, hours, days, and weeks.
- /image-resizer: Resize local images and download the result as PNG.
- /image-converter: Convert local images to PNG, JPEG or WebP and adjust output quality.
- /file-hash-calculator: Calculate local file SHA-256, SHA-384 and SHA-512 hashes in your browser.

## Verification

Each parser/calculation has Vitest tests covering representative valid/invalid input and boundary behavior. Playwright covers all 30 routes, samples, resets, file downloads, malicious HTML, privacy, language, search, favorites and mobile keyboard interaction. Full unit suite, typecheck, lint, build and existing E2E suite must pass.

Verified on 2026-10-02:

- Full Vitest suite: 86 files, 392 tests passed.
- Full Playwright suite: 297 tests passed across Chromium, Firefox and WebKit, including 114 checks for the new tools.
- Typecheck and production build passed; lint reported zero errors and 33 existing warnings.
- All 30 unique routes have Korean/English titles, usage guides and sitemap entries.
- Code review findings fixed with regressions for curl URL literals, HEAD, empty headers, fetch input validation, contrast symmetry, table resource bounds and consecutive HTML line breaks.
