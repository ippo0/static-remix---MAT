# Shopify theme snapshots — RAQI

These files are **not** part of the `static-remix` skill. They are snapshots of
files edited on the RAQI Shopify store (`waaxj1-6r.myshopify.com` / raqi.ae),
kept here only so the work survives outside an ephemeral session container.

**Shopify is the source of truth.** Editing a file here changes nothing on the
store; it has to be pushed back through the Admin API or the theme editor.

## Themes

Roles move around on this store — check them before assuming. As of
2026-09-03 12:46 UTC:

| Theme | ID | Role | What it is |
|---|---|---|---|
| `box 2` | `188491465011` | Unpublished | The **redesign, current work** — everything in this directory |
| `box` | `188412231987` | **Live (MAIN)** | Same redesign sections, but an **older `rd-header`** (4,334 bytes): no mobile menu panel, no script, broken language link |
| `Copy of Raqi box` | `188395618611` | Unpublished | Older Minimog-based theme, no `rd-*` sections. Was MAIN earlier on 2026-09-03. |

`box` was published at 12:36 UTC on 2026-09-03, replacing `Copy of Raqi box`
as MAIN. **`box 2` has never been published**, so nothing in this directory is
live. The live `rd-header` predates both the mobile-menu build and this
directory's fixes.

## Files

### `sections/rd-header.liquid`

The redesign header and its mobile menu panel — markup, `{% style %}` and the
open/close script in one self-contained file, so `assets/raqi-redesign.css`
stays untouched.

2026-09-03: visual pass on the mobile panel. It opened and closed correctly but
had never been styled against the redesign's own system — `raqi-redesign.css`
has zero `.rd-menu` rules, so it was rendering on Minimog leftovers. Rebuilt on
the §1 tokens (bone `#F3F4EE`, wine `#7B4A56`, ink `#22261F`, panel `#E8EBE2`,
rule `#C7CCBE`, grey `#5C6153`) and the Italiana/Karla faces via `--rd-display`
/ `--rd-body`. See the comment at the top of the file for the full rationale.

2026-09-03c: fixed the عربي language switch. Both links (desktop header and
mobile panel) pointed at `routes.root_url` — the root of the locale you are
*already* in — so tapping عربي reloaded the English homepage and switched
nothing. Rebuilt as a real toggle that preserves the current page and query
string, matching `snippets/raqi-language-switcher.liquid`, which already had
this right but was never called from this section.

Verified against the Admin API:

- `ar` is a **published**, non-primary locale on the store.
- The UAE market (`subfolderSuffix: "ae"`) serves it at **`/ar-ae/`**
  (`rootUrls`: `en → https://raqi.ae/en-ae/`, `ar → https://raqi.ae/ar-ae/`).
- Products, pages, collections and menu links have real Arabic translations.

⚠ The link fix alone does **not** make the theme Arabic. All 13 `rd-*`
sections contain **zero** `| t` translation keys — their chrome is literal
English markup (`Shop`, `Brands`, `Discovery Set`, `Our Story`, `Search`,
`WhatsApp`, `Elsewhere`, `Bag`, the collection filters, the hero step labels).
Those cannot be translated without a code change. The settings-driven copy in
the other sections *is* translatable, but `box 2` has **0** Arabic
translations for any `rd-*` section or for `header-group`.

Verified on write by MD5: `7816057a882014d90d0ec395d53098d0`.

### Translation keys (2026-09-03d)

The redesign's English chrome moved from literal markup to `| t` keys under a
new **`raqi.rd.*`** namespace — prefixed to match the `.rd-` CSS convention and
to avoid colliding with the legacy `raqi.nav.*` / `raqi.catalog.*` keys, whose
Arabic differs (`raqi.catalog.men` is "رجال", the redesign uses "رجالي").

| File | Keys |
|---|---|
| `sections/rd-header.liquid` | `nav.shop`, `nav.brands`, `nav.discovery_set`, `nav.our_story`, `utils.search`, `utils.whatsapp`, `utils.elsewhere`, `utils.bag` |
| `sections/rd-collection.liquid` | `filters.all`, `filters.men`, `filters.women`, `filters.unisex`, `filters.niche` |
| `sections/rd-hero.liquid` | `hero.try_it`, `hero.live_with_it`, `hero.decide` |

English lives in `locales/en.default.json` (committed here).

### ⚠ Arabic is NOT fully applied — one manual step remains

`locales/ar.json` could not be written from here, for two independent reasons:

1. **It does not round-trip.** Fetched via the Admin API it is 319,062 UTF-8
   bytes, but the theme reports `size` 272,779 and a different `checksumMd5`.
   `en.default.json` (pure ASCII) round-trips exactly, so the discrepancy is
   specific to the non-ASCII content. Writing a file that cannot be verified
   risks corrupting 272 KB of existing Arabic used across the whole theme.
2. **It is too large to transmit** in a single `themeFilesUpsert` call, and the
   API has no partial-write.

The API fallback is also exhausted: `translationsRegister` against
`gid://shopify/OnlineStoreThemeLocaleContent/188491465011` accepts at most **2
keys per call** and then fails with `Too many translation keys` — box 2 already
carries **3,400** registered Arabic translations and is at Shopify's cap. Only
2 of the 16 keys landed (`raqi.rd.filters.niche`, `raqi.rd.filters.unisex`).

**To finish:** open `locales/ar.json` in the theme code editor and paste the
block in `locales/ar.PASTE-INTO-ar.json` as a new sibling inside the existing
`"raqi"` object — directly after the `"discovery_box"` object closes. Change:

```json
    }
  }
}
```

to:

```json
    },
    "rd": { ...the block... }
  }
}
```

Until that is done the nav renders **English** on `/ar-ae/` (a clean fallback
to `en.default.json`, not a "translation missing" error).

## Re-applying a file to the theme

```graphql
mutation($themeId: ID!, $files: [OnlineStoreThemeFilesUpsertFileInput!]!) {
  themeFilesUpsert(themeId: $themeId, files: $files) {
    upsertedThemeFiles { filename checksumMd5 }
    userErrors { field code message }
  }
}
```

Compare the returned `checksumMd5` against `md5sum` of the local file before
treating a write as done. Note the Admin API refuses theme-file writes to the
live (MAIN) theme — that guard is why this work goes to `box 2`.

## Pre-launch readiness audit (2026-09-03, later)

Full reachability scan of all 652 theme files — see `UNUSED-FILES.md` (categorised,
with proof class per file) and `unused-files.txt` (plain paths). Result: **250 files
reachable, 402 removable (6.1 MB, 78 % of theme bytes)** — recount after fixing the scanner
to also follow `render`/`sections` tags written inside `{% liquid %}` blocks. Deletion is blocked for the
API tooling, so the list is for manual removal in Admin → Themes → Edit code.

Performance fixes applied to box 2 (all MD5-verified):

| File | Change |
|---|---|
| `snippets/rd-fonts.liquid` | Emptied. Was rendered by all 13 `rd-*` sections → 12× Google Fonts `<link>` + 12× `raqi-redesign.css` per homepage, all in `<body>`. |
| `snippets/custom-code-head.liquid` | Now the single loader: one Google Fonts URL (superset of the two that were requested) + `raqi-redesign.css`, in `<head>`. |
| `layout/theme.liquid` | Removed a `setInterval` that fetched `/cart.js` every 2 s forever (targeted the dead Minimog header's `.m-cart-count-bubble`). Removed the Minimog `cart-drawer` render + `cart.js` — the site was running two cart drawers. |
| `sections/rd-cart-drawer.liquid` | Listens to `cart:refresh` (dispatched by `raqi-product` and the Discovery builder) so Add-to-Bag opens the redesign drawer, not the old one. |
| `snippets/scroll-top-button.liquid` | Hidden ≤900px — it sat at 86–126px, exactly where the WhatsApp float lands (75–127px) on product pages. |
| `sections/rd-header.liquid` | "Our Story" now `pages['about'].url` (locale-aware). `routes.root_url \| append: 'pages/about'` produced `/ar-aepages/about` → 404 on the Arabic storefront. |
