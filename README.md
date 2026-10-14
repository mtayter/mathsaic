# Mathsaic

Mathsaic is a small puzzle generator: pick a short word (up to 4 letters),
choose arithmetic operations, a difficulty level, and two colors, and it
renders the word as a mosaic of arithmetic problems. Each cell's problem
evaluates to a number in the key; the two colors encode the key's parity
pattern, so solving the problems reveals the word. A print stylesheet
hides the options panel so only the puzzle prints.

It is a **pure client-side static site**: HTML + CSS + vanilla JavaScript.
There is no backend, no database, no account, and no stored state — every
puzzle is generated in the browser on the spot.

## Files

| File | Role |
| --- | --- |
| `index.html` | Page shell; loads jQuery (CDN, SRI-pinned) and the scripts below |
| `mathsaic.js` | Entry point: builds the options + puzzle panes |
| `mathsaic.options.js` | Options panel: word, operations, negatives, level, colors |
| `mathsaic.puzzle.js` | Puzzle generator: letter bitmaps, key, problem generation |
| `mathsaic.css` | Layout + print stylesheet |
| `install.sh` | Installer (copy to a web directory + optional local preview) |

## Dependencies

- **A static web server** (or just a browser) — no build step, no
  package manager, no runtime dependencies of its own.
- **Internet access at view time** for jQuery 3.3.1, loaded from the
  public `code.jquery.com` CDN with a Subresource Integrity hash in
  `index.html`. Everything else is local to this checkout.
- **Python 3** (optional) — only needed for the `--serve` preview mode
  in `install.sh`, which uses `python3 -m http.server`.

## Install

```sh
./install.sh
```

By default this verifies the site files and uses the checkout in place.
To copy the site somewhere else (e.g. a web server document root):

```sh
./install.sh --dir /var/www/html/mathsaic
```

Then serve that directory with any static web server and open
`index.html`. For a quick local preview without installing anywhere:

```sh
./install.sh --serve --port 8000
# open http://localhost:8000/index.html
```

Non-interactive use (for scripts): `./install.sh --non-interactive`
reads `MATHSAIC_INSTALL_DIR` (empty = in place), `MATHSAIC_PORT`
(default `8000`), and `MATHSAIC_SERVE` (`1` = serve after install).
Re-running the installer is safe: it overwrites the same files, creates
nothing duplicate, and regenerates nothing.

## Configuration

**None.** Mathsaic collects no configuration: no hostname, no username,
no password, no token, no API key. The installer prompts for nothing
sensitive because there is nothing sensitive to collect. There is no
config file to create, and nothing in this repo needs to be kept secret.

## Use

1. Type a word of up to 4 letters (only letters a–z; the word's letters
   must exist in the letter set, which is the full alphabet).
2. Check at least one operation (addition, subtraction, multiplication,
   division, plain number).
3. Optionally allow negatives; pick a difficulty level (easy / medium /
   hard).
4. Pick a background and a foreground color.
5. Click **Create Puzzle**. The key row shows the solution numbers; each
   cell shows a problem whose answer is one of those numbers.
