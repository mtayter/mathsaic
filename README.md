# Mathsaic

Mathsaic is a scavenger hunt maker built on a small math-mosaic puzzle
generator. In a Mathsaic puzzle, a letter is rendered as a mosaic of
arithmetic problems: each cell's problem evaluates to a number in the key,
and the key's two colors encode which cells belong to the letter, so solving
the problems reveals the letter.

To make a hunt, you enter the players (each with their own puzzle settings —
operations, negatives, difficulty level, and a color theme) and a list of
clue words. Each word is a clue as to where the next word (or the final
prize) can be found. The generator divides the letters of each word
randomly, and as evenly as possible, among the players — when a word's
letters don't divide evenly, the extras rotate to whoever has received the
fewest letters so far, so overall totals stay within one letter of each
other — and produces a printable set of pages: one puzzle page per letter
(pages ordered by word, letters within a word in random order, each page
footered with `[word number]-[player name]`), plus a final page with
instructions and an answer key that lists each word acrostic-style with
the page footer for every letter, alongside where that word's envelope
goes.

Each color theme pairs a very light background with a much darker
foreground of the same hue, and key numbers print black-on-light /
white-on-dark, so puzzles stay legible even when printed in greyscale.

It is a **pure client-side static site**: HTML + CSS + vanilla JavaScript.
There is no backend, no database, no account, and no stored state — every
hunt is generated in the browser on the spot.

## Files

| File | Role |
| --- | --- |
| `index.html` | Page shell; loads jQuery (CDN, SRI-pinned) and the scripts below |
| `mathsaic.js` | Entry point: builds the options + puzzle panes |
| `mathsaic.options.js` | Hunt maker form (players, words), letter distribution, and printable hunt output |
| `mathsaic.puzzle.js` | Puzzle generator: letter bitmaps, key, problem generation |
| `mathsaic.css` | Layout + print stylesheet (one puzzle per printed page) |
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

1. Choose how many players there are. For each player, enter their name
   and their Mathsaic settings: at least one operation (addition,
   subtraction, multiplication, division, plain number), whether negatives
   are allowed, a difficulty level (easy / medium / hard), and a color
   theme (a light background paired with a dark foreground, so the
   puzzles survive greyscale printing).
2. Choose how many words the hunt has, and enter them (letters a–z only).
   Each word is a clue as to where the next word (or final prize) can be
   found — e.g. if the envelope after the first belongs in the attic, the
   first word is `attic`.
3. Click **Create Scavenger Hunt**. The letters of each word are divided
   randomly, and as evenly as possible, between the players (extras rotate
   to the players with the fewest letters so far), with each letter
   generated using its player's settings.
4. Print the result. Each letter gets its own page, footered
   `[word number]-[player name]` (e.g. `2-Hannah`); pages are ordered by
   word number, with the letters within a word in random order. The last
   page has the instructions (numbered envelopes; place them per the
   answer key; put a prize in the last word's location) and the answer
   key — next to each word it says what to do with that word's envelope —
   so keep it for yourself.

## License

This project is licensed under the MIT License — see [LICENSE](LICENSE).
