# Shopify theme snapshots — RAQI

These files are **not** part of the `static-remix` skill. They are snapshots of
files edited on the RAQI Shopify store (`waaxj1-6r.myshopify.com` / raqi.ae),
kept here only so the work survives outside an ephemeral session container.

**Shopify is the source of truth.** Editing a file here changes nothing on the
store; it has to be pushed back through the Admin API or the theme editor.

## Themes

Roles move around on this store — check them before assuming. As of
2026-09-03 19:36 UTC:

| Theme | ID | Role | What it is |
|---|---|---|---|
| `box 2` | `188491465011` | **Live (MAIN)** | The redesign — everything in this directory |
| `box` | `188412231987` | Unpublished | Same redesign sections, but an **older `rd-header`** (4,334 bytes): no mobile menu panel, no script, broken language link |
| `Copy of Raqi box` | `188395618611` | Unpublished | Older Minimog-based theme, no `rd-*` sections. Was MAIN earlier on 2026-09-03. |

`box 2` was published by the merchant on 2026-09-03, so this directory is now
the live theme. Two consequences: the Admin API **refuses theme-file writes to
MAIN**, so further changes to these files have to go through Admin → Edit code
by hand; and any mistake here is customer-visible immediately.

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
with proof class per file) and `unused-files.txt` (plain paths). Result: **234 files reachable, 418 removable (6.1 MB, 80 % of theme bytes)**.
Deletion is blocked for the
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

### Cart drawer did not open after the Discovery Set "Add to Bag" (2026-09-03, fix)

Root cause in `sections/rd-cart-drawer.liquid`, two compounding faults:

1. `refresh()` requested `?sections=rd_cart_drawer`. That is the section's **key** in
   `header-group.json`, not its **ID**. Shopify IDs a section-group section as
   `sections--<group-id>__rd_cart_drawer` (Liquid: `section.id`), so the Section
   Rendering API answered `{"rd_cart_drawer": null}` on every call and the drawer's
   contents were never re-rendered.
2. The `cart:refresh` listener called `open()` only after `refresh()` resolved, and
   `refresh()` had no `.catch` — any rejection (non-200, non-JSON) silently ended the
   chain before `open()`.

Fix: `SECTION = {{ section.id | json }}`; open **first**, then refresh; `refresh()` is
fetched against `routes.root_url` and always resolves (errors logged, never thrown);
if the drawer markup is absent the page falls back to `/cart`. Same ordering applied to
`RDCart.add()`. MD5 `d72016dbad8f6a65106e4361c660f9f1`.

### Cart drawer "Remove" did nothing (2026-09-03, fix)

Same root as the Add-to-Bag bug: the button was wired and called a valid endpoint
(`/cart/change.js`, quantity 0), so the line *was* removed server-side — but the
re-render used the wrong section ID, so the drawer never updated and it looked like
nothing happened. Two hardening changes on top: removal now targets the **line-item
key** (`line.key` → `{id, quantity: 0}`) instead of the 1-based index — an index is
only correct when the visible list is current, which it never was — and `change()`
uses `routes.cart_change_url`, checks `r.ok`, never rejects, and always re-renders
the server's truth afterwards. Double-taps are ignored while a removal is in flight.

Tested in headless Chromium with a mocked Shopify cart + Section Rendering API
(`tests/rd-cart-drawer.test.js`): Add-to-Bag opens + refreshes; remove one of two →
remaining item, subtotal and bag count update; remove the last → empty state; a 422
re-renders truth and logs a warning; close works. 15/15 pass.
MD5 `18afce431da3f2fcc3a4cf48ac630592`.

## Catalogue conventions (Shopify data, not theme code)

Recorded here because they are re-derived from scratch every session otherwise.
Shopify remains the source of truth; this is a note, not a mirror.

### Stock is handled by product status, never by inventory

**Every** fragrance in the catalogue has `inventoryItem.tracked = false`.
`inventoryQuantity` is 0 across the board and negative on a few
(Creed Aventus 30ml is −2, Sospiro Vibrato 10ml is −1) — they all still sell,
because Liquid's `variant.available` is unconditionally `true` for an untracked
variant. Only `RAQI Discovery Box` is tracked (`998`, policy `CONTINUE`).

So **setting quantity to 0 does nothing** — it is already 0. The established
way to take a fragrance off sale is **status → DRAFT**, which is what the
pre-existing draft products use (LV Ombre Nomade, LV Spell on You, Creed
Absolu, PDM Herod, Mancera Roses Vanille, Givenchy Garçon Manqué).

DRAFT **hides**, it does not label. There is no "Out of Stock" / "Sold Out"
string anywhere in the redesign:

| Surface | Availability logic |
|---|---|
| `snippets/rd-product-card.liquid` | **None.** No badge, no `available` check. |
| `sections/raqi-discovery-box.liquid` | **None.** Both picker grids filter `collections['all'].products` by the `Signature` / `Discovery` tag only. |
| `sections/raqi-product.liquid` | Honours `available` — it `disabled`s the size radios, the sticky size buttons and both Add-to-Cart buttons. But the label still reads "Add to Cart — Dhs. N"; nothing says why it is dead. And it can never fire while `tracked` is false. |

A labelled "Out of Stock" state would need a badge in `rd-product-card`, a
label swap in `raqi-product`, a dimmed/unclickable state in the builder grids,
**and** `tracked: true` on the affected variants. Four changes, on the live
theme. Not done — flagged as available follow-up work.

`collections['all'].products` (what both builder grids and the collection grid
iterate) contains only products published to the Online Store channel, so DRAFT
removes a product from the storefront, both builder steps, and every rule-based
collection at once, with no code change.

2026-09-03: Creed Wind Flowers (`RAQI-39`) and Kilian Angels' Share (`RAQI-11`)
set to DRAFT — out of stock. Verified `onlineStoreUrl: null` and
`resourcePublicationsCount: 0` on both.

### SKUs

`RAQI-<n>-<size>`, `n` allocated sequentially per product, `size` ∈ {10, 30}.
Highest as of 2026-09-03 is **RAQI-43** (Parfums de Marly Haltane). **RAQI-33 is
an unused gap.** Some older products have no SKU at all (the five Tom Ford rows,
RAQI Discovery Box).

⚠ **Duplicate SKU:** Kilian Angels' Share carries `RAQI-11-10` on *both* its
10ml and its 20ml variant, and Maison Crivelli Oud Maracuja carries
`RAQI-15-10` on two of its three. Not fixed here — flagged.

### Product record shape

Recent additions carry **notes only** — no `raqi.scent_family`, and
`descriptionHtml` is empty. Metafields are `raqi.notes_top` / `notes_heart` /
`notes_base` (`single_line_text_field`), plus `global.title_tag` /
`global.description_tag` written from the `seo` field.

**Arabic notes are metafield *translations*, not separate `_ar` fields.**
Register them against the metafield GID with `translationsRegister` (locale
`ar`, key `value`, with the content digest). House format is a bare list with
definite articles and the Arabic comma `،` — **no** `المقدمة:` / `القلب:` /
`القاعدة:` prefix, because the theme renders those labels itself from
`raqi.product.note_top` / `note_heart` / `note_base`.

Tags: tier (`Signature` | `Discovery`) + `gender:<men|women|unisex>` +
`profile:<woody|sweet|fresh|citrus|floral|spicy>`, plus optional `Niche`.
`productType` mirrors the gender tag. Parfums de Marly is **not** tagged
`Niche` on any product.

## Out-of-stock badges (2026-09-03, later) — theme `box 3`

Reverses the approach recorded above. Taking a fragrance off sale by setting it
to DRAFT works, but it makes the product **vanish** from the Discovery Set
builder rather than showing it as unavailable — which reads as "we never
carried it" instead of "not right now". The merchant wants it visible, badged
and unselectable.

### Why DRAFT made it disappear (not `product.available`)

`sections/raqi-discovery-box.liquid` has **no availability logic at all**. Both
picker grids loop `collections['all'].products` and filter on nothing but the
`Signature` / `Discovery` tag. `collections['all']` contains only products
published to the Online Store, so a DRAFT product is not in the loop and no
card is emitted. Nothing was filtering on `product.available` — it could not
have been, because every fragrance had `tracked: false`, which makes
`variant.available` unconditionally true.

### The mechanism now

Products stay **ACTIVE** with `inventoryItem.tracked: true`, policy `DENY`,
quantity `0`. That is the only combination that makes `product.available` false
in Liquid, and it also makes Shopify itself refuse the line at `/cart/add.js` —
a real guard, not just a UI state. This is a **new** pattern for this catalogue
(every other product is untracked); it applies to out-of-stock products only.

⚠ Kilian Angels' Share's 20ml variant was `CONTINUE`, which would have kept
`product.available` true on its own. It is now `DENY`.

### Written to `box 3` (188518138163), a duplicate of live `box 2`

The Admin API refuses theme-file writes to the live theme, so the work went to a
duplicate. Every file MD5-verified on write:

| File | MD5 | What changed |
|---|---|---|
| `sections/raqi-discovery-box.liquid` | `7cca68d0710d9b1b2c96be980fc7a9db` | Both grids compute `oos`; card gets `.is-oos`, `data-oos`, `aria-disabled`; badge span; CSS; `isPickable()` guard in `wireGrid` |
| `snippets/rd-product-card.liquid` | `13a59621dff39fea98615e7d65403fe0` | Homepage + collection grid card badge |
| `snippets/raqi-product-card.liquid` | `23af44cce4fdb22ca2610fb6d35fa9c6` | Product-page related row card badge |
| `sections/raqi-selected.liquid` | `27a6cc6e912cb3d4a4a3be6f323a45b8` | Homepage carousel — inlines its own card markup, so the badge is repeated here |
| `sections/raqi-product.liquid` | `fea3d231b22815b2786b1567459746cf` | Add-to-Cart + sticky CTA say "Out of stock" instead of a dead "Add to Cart — Dhs. N"; mobile JS no longer overwrites that label. Also re-indented the `{% liquid %}` label block (was escalating to 140 columns; whitespace-only change) |
| `snippets/custom-code-head.liquid` | `e26a114bd575686dc255265e99da5b00` | One shared CSS rule set for all four card surfaces |

**Four card surfaces, not one.** `raqi-selected` (homepage "Selected this
season") hard-codes `kilian-angels-share` as a block in `templates/index.json`,
so an out-of-stock fragrance cannot drop out of that row the way it does from a
tag-driven grid. It needs the badge or it shows as purchasable.

**No locale change needed.** `products.product.out_of_stock` ("Out of stock")
already exists in `locales/en.default.json` — a Shopify/Minimog default key, so
`locales/ar.json` (which is mostly bulk-translated Shopify defaults) very likely
already carries the Arabic. Worth reading once on `/ar-ae` to confirm; if it is
missing the fallback is the English string, not an error.

**Badge is a sibling of the image, never a child.** The dimming is an `opacity`,
and opacity on a parent fades its children with it — a badge nested inside the
media would be the one element guaranteed to go unreadable.

**Selection is blocked in JS, not by `aria-disabled`.** `aria-disabled` is
advisory: a real browser still delivers the click. `isPickable()` in `wireGrid`
is the actual guard, and it covers click and keyboard from one place. The notes
button deliberately still works on an out-of-stock card.

Tested in headless Chromium against the section's real script and CSS —
`tests/out-of-stock.test.js`, 35 assertions, all passing: cards still render in
both grids, badge visible/opaque/correct text, card dimmed and in-stock cards
not, click and Enter/Space both refused, Continue stays disabled, notes modal
still opens, in-stock selection unaffected, and a completed box can never
contain an out-of-stock fragrance.

### Remaining steps (in this order)

1. Publish `box 3`. Until then the live theme has no badges.
2. Set both products back to **Active** (they are DRAFT right now, deliberately
   — activating before the publish would put them back in the builder fully
   selectable on a theme with no badge).
3. Reload `/pages/discovery-box` and confirm.

### SUPERSEDED (2026-09-03, final) — badges not adopted

The merchant chose the simple route: out-of-stock fragrances just disappear.
Marketing visibility for them is not a priority. **Ignore the "Remaining steps"
above — `box 3` was not published and must not be.**

Final state: Creed Wind Flowers and Kilian Angels' Share are **DRAFT**, and
their inventory config is back to the catalogue convention (`tracked: false`,
Angels' Share 20ml back to `CONTINUE`). The tracked/deny/0 setup existed only to
make `product.available` false for the badge logic; left in place it would have
made the products ACTIVE-but-unbuyable on restock, unlike every other product
here where restocking is a single status flip.

`box 3 — out-of-stock badges (draft)` (`188518138163`) still exists, unpublished
and inert. The badge work is preserved in this directory if it is ever wanted;
the theme itself can be deleted at any time.

**To restock either product: set status to Active. That is the whole procedure.**

## Cart drawer "Remove" felt slow (2026-09-05)

### Root cause: two serial round trips with no feedback in between — not the re-render

Tapping Remove ran `POST /cart/change.js`, waited for it, then ran the Section
Rendering API re-render, waited for that, and only then did anything move on
screen. Nothing acknowledged the tap in the meantime.

Measured in headless Chromium against mocked Shopify endpoints
(`tests/cart-remove-timing.js`), time from tap to the row leaving the layout:

| Simulated latency per request | Before | After | First visible change (before → after) |
|---|---|---|---|
| 0 ms | 10 ms | 12 ms | 10 ms → 12 ms |
| 150 ms | 317 ms | 215 ms | 317 ms → **48 ms** |
| 400 ms | 816 ms | 215 ms | 816 ms → **48 ms** |
| 800 ms | 1602 ms | 216 ms | 1602 ms → **33 ms** |

At 0 ms latency the whole interaction cost 10 ms, so the DOM work and the
re-render were never the problem: the delay tracked network latency almost
exactly 2×. The `215 ms` "after" figure is the collapse *animation* finishing —
the row starts moving within ~40 ms regardless of connection speed.

**Against Add to Bag:** Add opens the drawer after **one** round trip and so
confirms itself (163 ms / 413 ms / 811 ms at the same latencies). Remove needed
**two** before showing anything. So it was genuinely ~2× slower to acknowledge,
*and* its feedback was a row quietly vanishing rather than a panel sliding in.

### Fix — optimistic removal, reconciled against the server

- The row collapses out of the layout on tap, before any request.
- The bag count is decremented immediately by that line's own quantity
  (`data-rd-cd-qty`). Integers only — money is never computed in JS.
- The subtotal is dimmed and **checkout is genuinely blocked** while the figure
  on screen is one removal out of date.
- `/cart/change.js`'s own `item_count` corrects the optimistic count a full
  round trip before the section re-render lands.
- `refresh()` still replaces the panel with Liquid's render, so a **failed**
  removal reappears — the optimism is never a lie.
- An `inflight` counter stops an earlier re-render from resurrecting a row
  removed by a later tap.
- A re-render whose HTML is unchanged no longer rebuilds the panel (it was
  destroying and recreating every `<img>` and dropping focus to `<body>`).
- Focus moves to the close button when the replaced subtree held it.
- `prefers-reduced-motion` skips the animation.

28 assertions in `tests/cart-remove-perf.test.js`, all passing: optimistic
removal and reconciliation, checkout blocked then released, failed removal
restores the row and the count, two rapid removals with no resurrection, empty
state, double-tap firing one request, Add to Bag unaffected, and image nodes
reused on a no-op re-render.

### ⚠ Not yet on the live theme

`box 2` is MAIN, and the Admin API refuses theme-file writes to it (and refuses
`themeFilesCopy` even when live is only the *source*). The new file is
`sections/rd-cart-drawer.liquid` in this directory, MD5
**`a35840010fdfa9c9705b252b03f1bf87`**, 16,360 bytes.

**To apply:** Admin → Themes → `box 2` → Edit code → `sections/rd-cart-drawer.liquid`
→ replace the whole file with this one. Shopify validates Liquid on save, and
this exact file was already accepted by the API with no errors.

Note: `box 3` now also carries this file (it was uploaded there to validate the
Liquid before handing it over, and the restore path was blocked). `box 3` is
still **not for publishing** — it carries the abandoned out-of-stock badge work.

## Header "Bag" link navigated to /cart instead of opening the drawer (2026-09-05)

### Theme roles moved again

`box 4 — OOS badges (draft)` was MAIN at the previous check and has since been
**deleted**. `box 2` (`188491465011`) is MAIN again. `box 3` remains an
unpublished draft carrying the abandoned badge work plus the fixed cart drawer.

### Cause

`sections/rd-header.liquid` renders:

```liquid
<a class="rd-header__bag" href="{{ routes.cart_url }}" data-rd-bag>…</a>
```

The `data-rd-bag` hook was already there, but **nothing ever listened to it** —
this section's only script handles the burger menu. So the browser just followed
the href. Not a broken handler; a handler that was never written.

### Fix — one script block, no markup change

The anchor keeps its real `href="/cart"`, so it still works with JavaScript off
(the same progressive-enhancement pattern as the product form). When JS runs, the
click is intercepted and raises the identical event Add to Bag raises:

```js
document.dispatchEvent(new CustomEvent('cart:refresh', { detail: { open: true } }));
```

The drawer's existing listener does the rest — and it already falls back to
`window.location.href = CART_URL` when the drawer markup is absent, so the
fallback comes for free rather than needing to be duplicated.

Guards: modified clicks (cmd/ctrl/shift/alt, non-primary button) keep native
behaviour so open-in-new-tab still works; if `#rd-cart-drawer` is not on the page
the href is left alone; and `CustomEvent` construction is wrapped so an
exception navigates rather than swallowing the tap.

Source: `snippets/rd-header-bag-handler.js.txt`. 8 assertions in
`tests/header-bag-opens-drawer.test.js`, all passing.

**Not yet live** — `box 2` is MAIN and the API refuses writes to it. Insert the
block in Admin → Themes → box 2 → Edit code → `sections/rd-header.liquid`,
directly after the existing `</script>` and before `{% schema %}`. It contains no
Liquid, so there is nothing for Shopify to mis-parse.

### "Recently Viewed Products" is NOT on product pages

Checked rather than assumed. `templates/product.json`
(`d176827f05b23cfae3bfe402b0eff1fb`, unchanged) renders exactly three sections:

```
order: main (raqi-product) -> related (raqi-related) -> rd_faq
```

`sections/recent-viewed-products.liquid` does exist in the theme (12,093 bytes, a
Minimog leftover) but no template references it and `layout/theme.liquid` does not
render it, so it never appears. It was never wired into the product page in this
project. Adding it would be new work, not a repair.

## box 3 brought up to date (2026-09-05)

`box 4` was deleted; `box 2` is MAIN again. Since the API refuses writes to MAIN,
the approved fixes were applied to **`box 3` (`188518138163`, unpublished)**,
each MD5-verified on write:

| File | MD5 | State |
|---|---|---|
| `sections/rd-cart-drawer.liquid` | `a35840010fdfa9c9705b252b03f1bf87` | ✅ optimistic-removal fix |
| `sections/rd-header.liquid` | `db07a9ac57f755865fbca2aff097e967` | ✅ Bag link opens the drawer |

The header change is a pure insertion — one `<script>` block after the existing
one, before `{% schema %}`. Nothing else in the file moved (verified by diff
against the byte-exact original, `d5c56672f2efe051018b34b070ba90be`).

### ⚠ box 3 still carries the abandoned out-of-stock badge work

Six files still differ from live for that reason alone:

| File | box 3 | box 2 (live) |
|---|---|---|
| `sections/raqi-discovery-box.liquid` | `7cca68d0…` | `9a017735…` |
| `sections/raqi-product.liquid` | `fea3d231…` | `27855106…` |
| `sections/raqi-selected.liquid` | `27a6cc6e…` | `c4c17a9d…` |
| `snippets/rd-product-card.liquid` | `13a59621…` | `02f7d923…` |
| `snippets/raqi-product-card.liquid` | `23af44cc…` | `a30d3ddb…` |
| `snippets/custom-code-head.liquid` | `e26a114b…` | `1322b248…` |

Publishing box 3 as it stands would put the badges back on the storefront —
the opposite of the "just DRAFT the products, no badges" decision. Reverting
those six to the live versions would make box 3 exactly *live + the two
approved fixes*. Byte-exact originals for all six are held locally.

## Raw Liquid leaked onto product pages (2026-09-05) — my bug, fixed

Product pages on `box 3` printed a wall of raw Liquid above the content, starting
mid-sentence with "so this is # the same code, only readable…".

**Cause — self-inflicted.** When `sections/raqi-product.liquid` was re-indented,
the explanatory comment added inside the `{%- liquid … -%}` tag contained the
literal text `{% liquid %}`:

```
  # Whitespace carries no meaning inside a {% liquid %} block, so this is
```

Liquid scans for the first `%}` to close a tag. The `%}` inside that sentence
closed the outer `{%- liquid` tag early, so everything after it — the rest of the
comment and all fourteen `assign`/`if`/`endif` triples — became literal template
output. That also left every `lbl_*` variable and `raqi_ship_threshold` unset, so
the size-selector label, notes labels, trust row and shipping line rendered blank.

Exactly the class of bug this file's own header already warns about: Liquid's
lexer does not care that a delimiter is inside prose.

**Fix:** the sentence no longer contains tag delimiters —
"Whitespace carries no meaning inside a liquid tag". One line, no logic touched.
`sections/raqi-product.liquid` is now `d2c7899a7b48d7b03bff9e8aa4039690`
(35,950 bytes), MD5-verified on write.

**Swept the other seven files** for the same class of fault and for structural
soundness (delimiters inside a `liquid` tag body, nested comment tags, unbalanced
`if`/`for`/`unless`/`case`/`form`/`paginate`/`style`/`schema`/`capture`, comment
bodies excluded from the count). All clean; nothing else to fix.

Lesson for this repo: never put `{%` or `%}` inside a `#` comment within a
`{% liquid %}` tag. Inside a `{% comment %}` block it is safe — the header of this
same file quotes `{% paginate %}` and renders fine.
