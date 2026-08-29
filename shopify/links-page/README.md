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

## Print constraints for the QR code

The QR code printed on Discovery Box packaging encodes `raqi.ae/box`. These
constraints are set by the brand owner and are not negotiable by whoever
produces the artwork:

- **Print in ink or foil. Never deboss or emboss the code.** A debossed code
  carries no colour contrast and will not scan.
- **The clear margin around the code is part of the artwork.** Do not crop it
  and do not print anything inside it.
- **Never scale the code below 20 mm.**

Two things for the print vendor to watch, neither of which overrides the
above:

- Foil is permitted but is specular. Under direct light a foil code can throw
  glare across the modules and fail to scan even though the contrast is
  nominally fine. Test the actual foil on the actual substrate under hard
  light before signing off a run.
- Keep the code dark-on-light. Inverted codes (light modules on a dark
  ground) are optional in the spec and a number of phone cameras will not
  read them.

`raqi.ae/box` is deliberately short. Fewer characters means a lower-density
symbol with larger modules at any given size, which is what makes 20 mm
viable at all. Repointing the destination later is a redirect change, never a
reprint — see the redirects table above.

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

> ### The template suffix and the published theme must be changed together
>
> The template suffix is stored on the **page**, not the theme, so it applies
> to whichever theme is live. **Shopify does not fall back to the default
> template when the suffix's template is missing from the published theme —
> the URL 404s.** This was confirmed the hard way on 2026-08-29: setting the
> suffix to `links` while the live theme lacked `templates/page.links.liquid`
> took `raqi.ae/pages/links` (and therefore `raqi.ae/box`) to a 404 until the
> suffix was removed.
>
> So the safe order is always **file first, suffix second**:
>
> 1. Get `layout/links.liquid` and `templates/page.links.liquid` into the
>    theme that is about to be published.
> 2. Publish that theme. The page still renders, with chrome, because the
>    suffix is unset — nothing breaks.
> 3. Set the page's template suffix to `links`. The page goes bare
>    immediately.
>
> Rolling back is step 3 in reverse: unset the suffix and the page returns to
> the default template. Never set the suffix while the live theme lacks the
> template.

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
