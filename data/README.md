# Demo data

`demo-content.json` is a small, self-contained dataset used by `pnpm seed`.

`demo-tone.mp3` is a generated sine-wave audio file used to verify the audio
upload and player workflow. Both are released under CC0 1.0.

`demo-assets/` holds the tiny placeholder files the seed uploads so the demo
site can show every content type without shipping real media:

- `demo-checklist.pdf`, `demo-style-guide.pdf` — one-page PDFs (~2 KB each) for
  the `download-assets` collection. `download-assets` only accepts zip/pdf, so
  plain `.txt`/`.md` files cannot be used there.
- `comic/page-1.png` … `page-3.png` — 600×900 palette PNGs (~7–8 KB each) for
  the `comicReader` block. All chapters reuse these three pages; replace them
  with real artwork before a client demo.

Everything here is CC0 1.0 and safe to delete: the seed skips a content type
(with a console warning) when its placeholder file is missing.
