# Project notes — RAQI Shopify store (`petlyra` / raqi.ae)

## 🔒 RULE 1 — `/pages/links` is off limits, permanently

**The QR-code landing page must never be modified, styled, or touched by any
theme change.** It is a personal, direct-share page the owner sends manually to
specific people. It stays exactly as it is, isolated from every site-wide design
change — including the WhatsApp float, the header, the footer, and any component
added in future.

Do not edit, restyle, "bring in line with", add anything to, or remove anything
from any of these:

| What | Where |
|---|---|
| Bare layout | `layout/links.liquid` |
| Template | **`templates/page.links.liquid`** |
| Page body | Shopify Page ID `160326517043`, handle `links` |
| Template suffix | `links`, stored on the page record |
| Repo record | `shopify/links-page/` |

> **The file is `templates/page.links.liquid` — a `.liquid` template, not JSON.**
> There is no `templates/page.links.json` on the theme; verified 2026-08-30
> against the full template listing. A rule naming the `.json` path would
> protect nothing.

This applies to site-wide work by default. If a task says "add X to every page",
"apply Y site-wide", or "make Z consistent across the store", `/pages/links` is
excluded unless the owner names it explicitly in that same request.

### The isolation is structural, not just policy

`layout/links.liquid` does not call `sections 'header-group'` or
`sections 'footer-group'`. So the header, footer, announcement bar, cart drawer
and the floating WhatsApp button physically cannot reach this page — anything
rendered from those groups stops at the layout boundary. Two consequences:

- A site-wide component added via the header or footer group is automatically
  safe. No action needed.
- A site-wide component added to `layout/theme.liquid` is **also** safe, because
  this page uses `layout/links.liquid` instead. Do not "fix" that asymmetry.

If a future change makes something appear on this page, that is the bug — not
the isolation.

### Also do not

- Run the page through Translate & Adapt, or add it to a translation sync. Its
  Arabic strings live in the markup by design.
- Change the four button destinations without the owner's explicit say-so. The
  Instagram handle (`@raqi.scents`) and TikTok handle (`@raqi.ae`) genuinely
  differ — do not "harmonise" them.
- Change the `/box` or `/links` redirects. A QR code printed on packaging
  depends on `raqi.ae/box` resolving.

Full detail, including QR print constraints, in `shopify/links-page/README.md`.

---

## Standing rules for theme work

- **Theme `box` (188412231987) only.** Never write to any other theme.
  `Copy of Raqi box` (188395618611) is **live** — never touch. Never publish.
  Never duplicate a theme unprompted.
- **MD5-verify every write.** Reconstruct the original locally, confirm its
  checksum matches the stored file, edit mechanically against unique anchors,
  transfer, then read back and confirm the stored checksum equals the local one.
- **Section file before template, as two separate calls.** Shopify validates a
  JSON template's section settings against the section's `{% schema %}` and
  silently drops unknown keys — with no `userErrors` and a success response.
  A setting written in the same batch as the section that declares it is lost.
- **`themeFilesUpsert` gives no usable success signal.** It returned an empty
  `upsertedThemeFiles` array on every successful write in this project. Only a
  read-back proves anything.
- **Check `templates/index.json` for concurrent edits before writing it.** The
  owner edits it directly in the theme editor.
- **Theme file deletion is blocked** by the MCP safety policy. Deletions must be
  done by the owner in Shopify admin.

## Adding products — check the sales channel, not just the status

`status: ACTIVE` is **not** enough for a product to exist on the storefront. It
must also be published to the **Online Store** channel
(`gid://shopify/Publication/286006542643`).

On 2026-09-02 seven Active products — Creed Centaurus, Creed Aventus for Her,
Creed Wind Flowers, Creed Silver Mountain Water, Creed Queen of Silk, Dior
Elixir (Sauvage), Bleu de Chanel EDT — turned out to be published **only** to
"Microsoft Copilot" (`292840243507`). They were absent from `collections['all']`,
so their product pages did not resolve and they never appeared in the Discovery
Set Builder, even though the admin showed them Active and correctly tagged.

Whatever route created them defaults to Copilot only. So after adding products:

```graphql
resourcePublications(first: 6) { nodes { isPublished publication { name } } }
```

and confirm **Online Store** is in the list. `productsCount` and `status` will
both look right while the storefront shows nothing.

This bites anything that reads `collections['all']` — the Discovery Set Builder
(both tier grids), `rd-collection`, and the brand collections, which are smart
collections on VENDOR and therefore also storefront-scoped.
