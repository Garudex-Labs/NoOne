#!/usr/bin/env bash
set -euo pipefail
site="${1:-_site/docs}"
pool="${2:-_asset_retention}"
asset_dirs="assets zh-Hans/assets _next mintlify-assets _mintlify"
mkdir -p "$pool"
for directory in $asset_dirs; do
  if [ -d "$site/$directory" ]; then
    mkdir -p "$pool/$directory"
    cp -R "$site/$directory/." "$pool/$directory/"
    # The rolling horizon is measured from publication, not source checkout.
    find "$site/$directory" -type f | while IFS= read -r file; do
      touch "$pool/${file#"$site/"}"
    done
  fi
done
find "$pool" -type f -mmin +180 -delete
find "$pool" -depth -type d -empty ! -path "$pool" -delete
for directory in $asset_dirs; do
  if [ -d "$pool/$directory" ]; then
    mkdir -p "$site/$directory"
    find "$pool/$directory" -type f | while IFS= read -r file; do
      destination="$site/${file#"$pool/"}"
      if [ ! -e "$destination" ]; then
        mkdir -p "$(dirname "$destination")"
        cp "$file" "$destination"
      fi
    done
  fi
done
echo "retention pool:"; du -sh "$pool"
echo "deployed documentation:"; du -sh "$site"
