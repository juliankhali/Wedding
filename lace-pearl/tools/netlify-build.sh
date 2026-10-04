#!/bin/sh
# Copies only what the live site needs into ./dist (run from the repo root by Netlify).
set -e
rm -rf dist && mkdir -p dist
cp lace-pearl/index.html lace-pearl/style.css lace-pearl/app.js dist/
cp -r lace-pearl/fonts lace-pearl/img lace-pearl/save-the-date dist/
echo "dist ready: $(du -sk dist | cut -f1) KB"
