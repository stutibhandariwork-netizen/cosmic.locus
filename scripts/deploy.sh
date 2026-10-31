#!/bin/sh
# Builds the static site and publishes it to the gh-pages branch, which GitHub Pages serves at
# https://stutibhandariwork-netizen.github.io/cosmic.locus/
set -e
cd "$(dirname "$0")/.."
npm run build
touch out/.nojekyll # Pages must not run Jekyll, or it hides the _next folder
remote=$(git remote get-url origin)
cd out
rm -rf .git
git init -q -b gh-pages
git add -A
git -c user.name="$(git -C .. config user.name)" -c user.email="$(git -C .. config user.email)" commit -q -m "Deploy $(git -C .. rev-parse --short HEAD)"
git push -q --force "$remote" gh-pages
rm -rf .git
echo "Published: https://stutibhandariwork-netizen.github.io/cosmic.locus/"
