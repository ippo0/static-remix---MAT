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
| Template | default page template (no template suffix) |
| Redirects | `/box` → `/pages/links` (ID `558951629107`)<br>`/links` → `/pages/links` (ID `558951694643`) |

`links-page.html` is the page body exactly as stored in Shopify. Editing this
file does **not** update the store — the page body is the source of truth and
must be updated through the Admin API or the Shopify admin.

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
