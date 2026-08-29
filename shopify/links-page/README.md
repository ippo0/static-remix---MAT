# RAQI links page (`raqi.ae/pages/links`)

Record of the QR-code landing page deployed to the RAQI Shopify store. The QR
code is printed on Discovery Box packaging, so the URL cannot change after
production.

## Deployed state

| | |
|---|---|
| Page | `Links` — handle `links` — Page ID `160326517043` |
| URL | `raqi.ae/pages/links` |
| Status | Published |
| Template | template suffix `links` → `templates/page.links.liquid` |
| Redirects | `/box` → `/pages/links` (ID `558951629107`)<br>`/links` → `/pages/links` (ID `558951694643`) |

`links-page.html` is the page body exactly as stored in Shopify. Editing this
file does **not** update the store — the page body is the source of truth and
must be updated through the Admin API or the Shopify admin.

## Button destinations

| Button | Destination | Handle shown |
|---|---|---|
| Shop all fragrances | `https://raqi.ae/collections/all` | — |
| WhatsApp | `https://wa.me/message/5GLLZ5OXO7YDF1` | — |
| Instagram | `https://www.instagram.com/raqi.scents/` | `@raqi.scents` |
| TikTok | `https://www.tiktok.com/@raqi.ae` | `@raqi.ae` |

Instagram and TikTok genuinely use different handles. Do not harmonise them.

## Standalone layout

The page renders with no store chrome — no header, footer, announcement bar,
navigation, cart icon, breadcrumb or page title. Two files under `theme/`
provide this, mirroring what is deployed:

- `layout/links.liquid` — a bare layout. Keeps only `content_for_header`
  (required by Shopify) plus a few lines of centring CSS. Skips
  `header-group`, `footer-group`, `main.css`, `raqi-theme.css`, `vendor.js`
  and `theme-global.js`.
- `templates/page.links.liquid` — a Liquid template that outputs
  `{{ page.content }}` through that layout.

Vertical centring uses `margin:auto` on a `.rl-shell` wrapper inside a flex
body. Unlike `align-items:center`, this never clips the top when the content
is taller than the viewport (which happens at 320 px).

> **These files live on the draft theme `188099166515` only.** The live theme
> `Raqi box` (`188008038707`) does not have them, so `raqi.ae/pages/links`
> keeps rendering with full chrome until that draft theme is published. The
> template suffix is store-level, so the live theme simply falls back to its
> default `templates/page.json`.
>
> Preview before publishing:
> `raqi.ae/pages/links?preview_theme_id=188099166515`

## Notes

- The page body is self-contained: scoped CSS, inline SVG icons, no JavaScript.
  The one external asset is a Google Fonts stylesheet for Karla, Italiana and
  Noto Naskh Arabic, none of which the live theme loads.
- `.m-page-header{display:none}` suppresses the theme's injected page heading
  and breadcrumb, which would otherwise render a duplicate "Links" title above
  the RAQI mark. The rule is safe because this stylesheet loads only on this page.
- CSS selectors are scoped under `.raqi-links` so the theme's `.rte a` rules
  cannot re-underline or recolour the buttons.
- Arabic strings live in the markup itself. This page is deliberately **not**
  managed by Translate & Adapt.
- The WhatsApp button uses the WhatsApp Business short link
  `wa.me/message/5GLLZ5OXO7YDF1`, not a phone number. That code is **resettable**
  from the WhatsApp Business app (QR code screen → Reset), and resetting it
  breaks this link. Nothing printed depends on it — the printed URL is
  `raqi.ae/box` — but if the code is ever reset, this page must be updated.

## Deploying a change

```graphql
mutation UpdateLinksPage($id: ID!, $page: PageUpdateInput!) {
  pageUpdate(id: $id, page: $page) {
    page { id handle isPublished }
    userErrors { field message code }
  }
}
```

with `id: "gid://shopify/Page/160326517043"` and `page: { body: "<contents of links-page.html>" }`.

Shopify normalises the stored HTML on write: `viewBox` is lowercased to
`viewbox` and self-closing SVG tags are expanded. Both are corrected by the
HTML parser at render time, so the icons are unaffected.

`preview-375px.png` is a local render at 375 px wide inside a simulated theme
wrapper.
