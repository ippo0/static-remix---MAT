# RD hero + header applied to theme `box`

Record of copying the Redesign draft theme's hero and header onto the
unpublished theme `box` (`188412231987`).

| | |
|---|---|
| Source | `Raqi box — Redesign (draft)` — `188260155699` |
| Destination | `box` — `188412231987` (unpublished) |

## Files copied

| File | Bytes | MD5 |
|---|---|---|
| `assets/raqi-redesign.css` | 61053 | `a6cb759f55da7bc6a2ccc2ffe5cadc62` |
| `snippets/rd-fonts.liquid` | 636 | `2ce5184a5c2e6462b0c9dbb8f0a06a29` |
| `sections/rd-hero.liquid` | 5374 | `d07152f400e60245e79902f5df367ea0` |
| `sections/rd-header.liquid` | 3905 | `dab79ba62ac05773472ada1a3c4e5a2f` |
| `sections/rd-announcement.liquid` | 1867 | `8bb7266dbdccdf3dd4357e337bae0f77` |
| `sections/rd-cart-drawer.liquid` | 7883 | `d980de05efae940f1da80dc5be593173` |
| `sections/header-group.json` | 876 | `d18b8afb839e42970395b1061d3008c2` |

`templates/index.json` is **not** a straight copy — it is a hybrid: the
Redesign's `rd_hero` section replaces the old `raqi_hero`, and `box`'s own
`raqi_steps` / `raqi_collections` / `raqi_selected` / `raqi_story_sizes`
sections are kept below it, because only the hero was in scope.

## Why the stylesheet is checked in here

`assets/raqi-redesign.css` is the design system for every `rd-*` section —
it is where the hero and header background and colour treatment live, and
without it both render unstyled. The Shopify Admin API has no cross-theme
file copy (`themeFilesCopy` is same-theme only), so the file was committed
here and Shopify was pointed at its raw URL to transfer it byte-for-byte
rather than re-typing 936 lines. It is kept as the record of what was
deployed.

Note this repository is **public**. The file is theme CSS that a live
storefront serves publicly anyway, so nothing secret is exposed by it.

## Verification (2026-08-30)

Every copied file was re-read from `box` after writing and its MD5 compared
against the Redesign source. All seven match byte-for-byte — see the table
above for the shared checksums. `templates/index.json` is a hybrid so has no
source to match; it is 6912 bytes, MD5 `54e9f987c660773447dcd67adc50f16a`.

Confirmed unmodified:

- `box`: `layout/theme.liquid`, `layout/links.liquid`,
  `templates/page.links.liquid`, `sections/footer-group.json` all still carry
  the 13:49:45 duplication timestamp.
- Source theme `188260155699`: all checksums unchanged, no write timestamps
  from this session.
- Live theme `188395618611`: `templates/index.json` and
  `sections/header-group.json` unchanged; it has no `raqi-redesign.css`.

## Known issues in the result

These are faithful to the Redesign source, not defects in the copy, but they
matter before `box` is ever published:

1. **The hero click target 404s.** The whole hero is one link to
   `/pages/discovery-box`, which is unpublished. `sections/rd-hero.liquid`
   says so in its own header comment and cites it as the reason the Redesign
   theme "must not be published yet (§8.1)".
2. **The "Discovery Set" nav link is dead.** `rd-header.liquid` points it at
   `/#discovery-set`, an anchor rendered by the `rd-discovery` section, which
   is part of the Redesign homepage and was out of scope here.
3. **The hero shows a placeholder, not a box photograph.** No image is set on
   the Redesign hero either; the schema notes the photograph is "pending from
   the manufacturer".
4. **Only the hero and header are new.** The rest of the homepage and the
   whole footer are still the old `raqi-*` design.
5. **Two cart drawers are mounted.** `layout/theme.liquid` still renders the
   old `cart-drawer` snippet while `header-group.json` now mounts
   `rd-cart-drawer`. The Redesign theme has the same overlap.

`box` carries `layout/links.liquid` and `templates/page.links.liquid`, so
publishing it will not 404 `raqi.ae/pages/links` or `/box`.

## 2026-08-30 — rd-steps added

`templates/index.json` still referenced the old `raqi_steps`
(`raqi-concept-steps`) section. That was in scope from the start of the
redesign work but out of scope of the hero/header copy, so it was never
swapped. `sections/rd-steps.liquid` did not exist on `box` and was
transferred from the Redesign source.

| File | Bytes | MD5 | Verdict |
|---|---|---|---|
| `sections/rd-steps.liquid` | 3109 | `e4256b77af7fecc472dc8277b515b8b7` | PASS — matches source |

`templates/index.json` is now 7629 bytes, MD5 `3b8d1dbbf38a45318619ba53a8641c81`.
The `raqi_steps` entry is removed entirely; `rd_steps` carries the Redesign's
three step blocks and both settings.

Homepage order is now: `rd_hero`, `rd_steps`, `raqi_collections`,
`raqi_selected`, `raqi_story_sizes`.

In the full approved Redesign order `rd_trust` sits between `rd_hero` and
`rd_steps`. It is not on `box` yet, so `rd_steps` directly follows the hero
for now and `rd_trust` slots between them when it is added.

`rd-steps` needs no new dependencies — it renders `rd-fonts` and styles from
`assets/raqi-redesign.css`, both already present. Its three step images are
unset, so each cell renders an "Image pending" well rather than a photograph;
the section comment states this is deliberate (§10.1, no stock substitutes).
