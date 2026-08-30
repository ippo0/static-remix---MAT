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

## 2026-08-30 — rd-collection added

`rd_houses` was never on `box` and is now permanently out of scope — do not
add it.

`sections/rd-collection.liquid` was not on `box` and was transferred, along
with `snippets/rd-product-card.liquid`, which it renders once per product.
Without that snippet the grid renders zero cards.

| File | Bytes | MD5 | Verdict |
|---|---|---|---|
| `sections/rd-collection.liquid` | 6864 | `df42ec08d86a131e83569b082712d412` | PASS — matches source |
| `snippets/rd-product-card.liquid` | 2182 | `974350a7c499fea0afa16dcce75602a2` | PASS — matches source |

`templates/index.json` is now 7250 bytes, MD5 `2d47e9a42564ce3d522a98b9b0f163c3`.
`raqi_collections` removed, `rd_collection` in its place. Order is now
`rd_hero`, `rd_steps`, `rd_collection`, `raqi_selected`, `raqi_story_sizes`.

### Concurrent edit preserved

`templates/index.json` had been edited in the theme editor between the
previous write and this one (7629 → 5197 bytes, the editor re-serialises more
compactly). The change was a photograph set on step 01:
`shopify://shop_images/ChatGPT_Image_Aug_30_2026_07_07_27_PM.png`. The file
was re-read before writing and that setting carried through — never overwrite
`index.json` from a cached copy.

### Brands page unaffected

The Brands page is a different template entirely. Header "Brands" points at
`routes.collections_url` (`/collections` → `templates/list-collections.json`);
individual house pages such as Tom Ford are `/collections/<handle>` →
`templates/collection.json`. Neither is touched by an `index.json` edit.

Verified unchanged, all still at the 13:49:45 duplication timestamp:
`templates/list-collections.json` (`df13ca59…`), `templates/collection.json`
(`8689ce80…`), all 19 `collection.*.json` variants, and
`sections/raqi-collection-grid.liquid` (`f413ce36…`) which those templates
render.

`sections/raqi-collections.liquid` is left on disk but is no longer referenced
by any template — inert, not deleted.

## 2026-08-30 — rd-profiles added below rd-collection

| File | Bytes | MD5 | Verdict |
|---|---|---|---|
| `sections/rd-profiles.liquid` | 1379 | `ea16bc5cead1ac651a93aa18e791f6e9` | PASS — matches source |

`templates/index.json` is now 8482 bytes, MD5 `a1a12804bbda06706d1d89654179ea7b`.
Order: `rd_hero`, `rd_steps`, `rd_collection`, `rd_profiles`, `raqi_selected`,
`raqi_story_sizes`.

All six profile tags were checked against the live catalogue and each returns
at least one product, so no chip lands on an empty page.

### rd-profiles is not an in-place filter

Worth knowing before review: `rd-profiles` renders six plain links to
`/collections/all/profile:<name>`, not filter controls over the grid above it.
Clicking one leaves the homepage for a tag-filtered collection page, which on
`box` still renders in the old design via `templates/collection.json`. The
grid's own in-place filters are the category tabs and brand chips inside
`rd-collection`; profile is not among them, even though `rd-product-card`
does emit a `data-profile` attribute.

### Brands page unaffected

Re-verified after this change. `templates/list-collections.json`
(`df13ca59…`), `templates/collection.json` (`8689ce80…`), all 19
`collection.*.json` variants and `sections/raqi-collection-grid.liquid`
(`f413ce36…`) all still carry the 13:49:45 duplication timestamp with
unchanged checksums.

## 2026-08-30 — rd-ticker (new section, authored not copied)

A new scrolling delivery/policy bar. Unlike every other `rd-*` file here this
one has no Redesign source — it was written for this theme, so `theme/sections/
rd-ticker.liquid` is the authoritative copy.

| File | Bytes | MD5 | Verdict |
|---|---|---|---|
| `sections/rd-ticker.liquid` | 3797 | `a5aee02d7d0aaa4002907ea78d5dc2d4` | PASS — stored copy matches the local original |

`templates/index.json` is now 9317 bytes, MD5 `0d1897d3f43111bd56d611496bceb821`.
Order: `rd_hero`, `rd_steps`, `rd_collection`, `rd_profiles`, `raqi_selected`,
`rd_ticker`, `raqi_story_sizes`.

### Design notes

- Styles live in the section's own `{% style %}` block, **not** in
  `assets/raqi-redesign.css`. That shared stylesheet is byte-verified against
  the Redesign source and was deliberately left untouched.
- Colours and type are design-system tokens only: `--rd-panel` ground,
  `--rd-rule` hairlines top and bottom, `--rd-ink` text, `--rd-wine` ticks,
  `--rd-body` (Karla) at 11px / 0.16em / uppercase — the same type treatment as
  `.rd-announce`, so it reads as a ticker rather than a section.
- Rendered height is 39px desktop, 34px mobile.
- Seamless loop verified by render: the item row is emitted twice and the track
  translated -50%. Measured 1306 + 1306 = 2613px at 1280 wide and 1049 + 1049 =
  2099px at 375, so the second copy lands exactly where the first began.
- The duplicate row is `aria-hidden` and carries no `shopify_attributes`, so
  assistive tech and the theme editor see one set of items, not two.
- Pauses on hover and on focus-within; under `prefers-reduced-motion: reduce`
  the animation is off and the items wrap statically.
- Loop duration is a range setting (15–90s, default 38s); each point is an
  editable block.

### Position

Placed immediately **before** `raqi_story_sizes`, the closing section whose
heading is "Why commit to a fragrance before you know it's yours?" — the
nearest thing on `box` to "Why RAQI".

`rd-why.liquid` is **not** on `box`. Neither is `rd-trust.liquid`; the only
trust-ish file present is `sections/raqi-trust-row.liquid`, a 124-byte stub
that no template references. So no trust bar of any kind currently renders on
this homepage, and there was nothing for `rd-ticker` to be confused with.

When `rd_why` is eventually added it belongs between `rd_profiles` and
`raqi_selected` (mapping the approved Redesign order onto box's). Moving
`rd_ticker` to sit directly after it is then a one-line change to the `order`
array.
