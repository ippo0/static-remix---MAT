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
