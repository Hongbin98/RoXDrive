# RoXDrive project page

This directory contains the public project page published at
https://hongbin98.github.io/RoXDrive/.

The GitHub Pages workflow builds this static site when `project-page/` changes.
The source media in `public/` are web-ready versions only; lossless working
files and per-frame source material are not part of this repository.

To preview locally, run `npm ci` and `npm run dev`. To check the static export,
run `npm run build` followed by `node scripts/prepare-pages.mjs`; the Pages
artifact is `dist/client/`.
