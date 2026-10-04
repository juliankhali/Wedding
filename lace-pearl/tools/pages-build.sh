#!/bin/sh
# Copies the live site into ./docs so GitHub Pages can serve it (Settings -> Pages -> Deploy from a branch -> /docs).
set -e
rm -rf docs && mkdir -p docs
cp lace-pearl/index.html lace-pearl/style.css lace-pearl/app.js docs/
cp -r lace-pearl/fonts lace-pearl/img docs/
touch docs/.nojekyll
echo "docs ready: $(du -sk docs | cut -f1) KB"
