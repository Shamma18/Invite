#!/bin/bash
set -eu
cd "$(dirname "$0")"
if ! command -v python3 >/dev/null 2>&1; then
  echo "Python 3 is required. Install it from https://www.python.org/downloads/macos/ and try again."
  read -r -p "Press Return to close. "
  exit 1
fi
printf '\nOpen http://localhost:8080 in your browser.\nKeep this window open. Press Control+C to stop.\n\n'
exec python3 -m http.server 8080 --bind 127.0.0.1
