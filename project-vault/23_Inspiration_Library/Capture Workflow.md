# Capture Workflow

How screenshots get from the internet into the [[Inspiration Library Index]].

## Your half

**Drop everything into `web design inspirations/` at the repo root.** That folder is the inbox.
No naming discipline required, no sorting, no notes — browse fast and save whatever strikes you.

Two things worth doing while you browse, because neither can be recovered later:

1. **Capture the section that struck you *and* one full-page shot** of the same site. The detail is
   what you liked; the full page is what makes it judgeable.
2. **Capture mobile too.** DevTools device toolbar at 390px. Mobile is where the current site is
   worst — a 24,164px-tall homepage — so mobile references are worth more here than desktop ones.

If the domain is easy to type into the filename (`vitsoe-home.png`), do it. Otherwise don't bother;
most sites are identifiable from the screenshot, and anything genuinely ambiguous gets asked about
in one batch at the end of an ingest, never one question at a time.

**Full-page capture:** Chrome DevTools → `Cmd+Shift+P` → "Capture full size screenshot". Or the
GoFullPage extension.

## My half — "ingest"

Say **"ingest"** and everything in the inbox is:

1. read and identified,
2. renamed to `ref-NNN-slug.ext` and moved into `attachments/` — see the trap below,
3. written up as a light note in `Refs/`, tagged from all five facets in [[Tag Vocabulary]],
4. added to every board it belongs on,
5. reported back: what came in, how it clubbed, and which ones look worth a deep dive.

Then say **"deep dive 014"** on anything worth it, and that note gains the mechanism, why it works,
how it translates to our surfaces, and what breaks if it's copied straight.

## ⚠️ The rename is not cosmetic

macOS screenshot filenames contain a **narrow no-break space (U+202F)** before `AM`/`PM` — it looks
exactly like a normal space and is not one:

```
Screenshot 2026-08-12 at 1.52.42 PM.jpg
                            ↑ U+202F, not U+0020
```

It silently breaks file reads and any tool that takes a literal path. Every file is renamed to an
ASCII-safe slug on the way in. This is why ingest is a step rather than dragging files into the
vault yourself.

## Volume

**Aim for 40–80 captures before we sort seriously.** Under about 30 the boards can't support a
real comparison and the direction choice slides back into prose — which is the exact failure this
library exists to prevent.

## What to keep in mind while browsing

* **Modern modular, not traditional-Indian.** The product is modern; a heritage-Indian aesthetic
  was already tried and rejected.
* **Don't lean on Nolte.** They may commission their own Jaipur site. Mrida is what stays ours.
* The standing bans still apply: no eyebrow/kicker labels above headings, no section numbers
  (01/02/03), no grids of same-size icon+heading+text cards, no glassmorphism, neon, or dark-tech,
  no heavy motion. See [[Forbidden Patterns]].
* Saving something that **breaks** a rule is fine and useful — tag it `#verdict/avoid` and it lands
  on [[Board - Avoid]] as evidence.

## Related

* [[Sources To Browse]] — where to look
* [[Tag Vocabulary]] — how it gets filed
