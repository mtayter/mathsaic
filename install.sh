#!/usr/bin/env bash
# Mathsaic installer — LOCAL-ONLY, no network install, no secrets.
#
# Mathsaic is a pure client-side static site (HTML + CSS + vanilla JS).
# It has NO backend, NO database, NO accounts, NO passwords, NO tokens,
# and NO configuration of any kind. This installer therefore prompts for
# NO sensitive information and writes NO config file — there is nothing
# to configure. (Verified by audit: no secret/config pattern in any
# source file; the only network reference is the public jQuery CDN URL
# in index.html, loaded with a Subresource Integrity hash.)
#
# What this script does:
#   1. Verifies the five static site files are present in this checkout.
#   2. Optionally copies them to an install directory (in-place by default).
#   3. Optionally serves the result locally for a preview.
#
# Idempotent: re-running copies the same files again (overwrite, no
# duplicates, nothing regenerated, no state accumulated).
#
# Usage:
#   ./install.sh [--dir DIR] [--serve] [--port PORT] [--non-interactive] [--help]
#
# Non-interactive mode reads these environment variables:
#   MATHSAIC_INSTALL_DIR  Target directory. Empty/unset = use this checkout
#                         in place (no copy). Example: /var/www/html/mathsaic
#   MATHSAIC_PORT         Port for --serve (default: 8000).
#   MATHSAIC_SERVE        Set to 1 to serve after install (same as --serve).
#
# No `set -x` is used anywhere in this script.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NON_INTERACTIVE=0
SERVE=0
PORT="${MATHSAIC_PORT:-8000}"
INSTALL_DIR="${MATHSAIC_INSTALL_DIR:-}"

usage() {
  sed -n '1,/^#$/p' "$0" | sed 's/^# \{0,1\}//'
  echo "Options:"
  echo "  --dir DIR           Install directory (default: this checkout, in place)"
  echo "  --serve             Start a local preview server after install"
  echo "  --port PORT         Preview port (default: 8000, or \$MATHSAIC_PORT)"
  echo "  --non-interactive   Do not prompt; read env vars (see header)"
  echo "  --help              Show this help and exit"
}

while [ $# -gt 0 ]; do
  case "$1" in
    --dir) INSTALL_DIR="$2"; shift 2 ;;
    --serve) SERVE=1; shift ;;
    --port) PORT="$2"; shift 2 ;;
    --non-interactive) NON_INTERACTIVE=1; shift ;;
    --help) usage; exit 0 ;;
    *) echo "Unknown option: $1" >&2; usage >&2; exit 2 ;;
  esac
done

if [ "${MATHSAIC_SERVE:-0}" = "1" ]; then
  SERVE=1
fi

# --- 1. Verify the static site files ---------------------------------------
REQUIRED_FILES="index.html mathsaic.css mathsaic.js mathsaic.options.js mathsaic.puzzle.js"
missing=0
for f in $REQUIRED_FILES; do
  if [ ! -f "$SCRIPT_DIR/$f" ]; then
    echo "ERROR: missing required file: $SCRIPT_DIR/$f" >&2
    missing=1
  fi
done
if [ "$missing" -ne 0 ]; then
  echo "ERROR: run this script from the mathsaic checkout." >&2
  exit 1
fi
echo "All 5 site files present."

# --- 2. Install directory (prompt only in interactive mode) -----------------
if [ "$NON_INTERACTIVE" -eq 0 ] && [ -z "$INSTALL_DIR" ]; then
  printf "Install directory (leave blank to use this checkout in place, no copy): "
  read -r INSTALL_DIR || INSTALL_DIR=""
fi

TARGET_DIR="$SCRIPT_DIR"
if [ -n "$INSTALL_DIR" ]; then
  # Expand a leading ~ the way a shell user expects.
  case "$INSTALL_DIR" in
    "~"/*) INSTALL_DIR="$HOME/${INSTALL_DIR#~/}" ;;
    "~") INSTALL_DIR="$HOME" ;;
  esac
  mkdir -p "$INSTALL_DIR"
  for f in $REQUIRED_FILES; do
    cp "$SCRIPT_DIR/$f" "$INSTALL_DIR/$f"
    chmod 644 "$INSTALL_DIR/$f"
  done
  TARGET_DIR="$INSTALL_DIR"
  echo "Installed to: $TARGET_DIR"
else
  echo "Using checkout in place (no copy): $TARGET_DIR"
fi

# --- 3. Optional CDN reachability note (best-effort, never fatal) ----------
# The page loads jQuery 3.3.1 from the public code.jquery.com CDN (with an
# SRI hash). A preview without internet will load the page but not run.
if command -v curl >/dev/null 2>&1; then
  if ! curl -sI --max-time 5 "https://code.jquery.com/jquery-3.3.1.js" >/dev/null 2>&1; then
    echo "NOTE: https://code.jquery.com is not reachable right now — the page needs"
    echo "      internet at view time to fetch jQuery (SRI-pinned in index.html)."
  fi
fi

# --- 4. Optional local preview ----------------------------------------------
if [ "$SERVE" -eq 1 ]; then
  if ! command -v python3 >/dev/null 2>&1; then
    echo "ERROR: --serve needs python3 (for 'python3 -m http.server')." >&2
    echo "      Or open $TARGET_DIR/index.html in a browser with internet access." >&2
    exit 1
  fi
  echo "Serving $TARGET_DIR at http://localhost:$PORT/ (Ctrl-C to stop)"
  echo "Open http://localhost:$PORT/index.html in your browser."
  cd "$TARGET_DIR" && exec python3 -m http.server "$PORT"
fi

echo "Done. Serve it with any static web server, e.g.:"
echo "  cd $TARGET_DIR && python3 -m http.server 8000"
echo "Then open http://localhost:8000/index.html"
