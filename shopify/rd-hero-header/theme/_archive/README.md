# Archived sections from theme `box` (188412231987)

Byte-exact copies, taken 2026-08-30, of sections that no template, section
group or layout on `box` references. Kept here so any deletion from the theme
is reversible: re-upload the file and restore the template that used it.

| File | Bytes | MD5 | Presets? | Superseded by | Deleted from theme |
|---|---|---|---|---|---|
| `raqi-collection-grid.liquid` | 9320 | `f413ce36bc79a124a5c2ffcc1041160f` | no | `rd-collection` | cleared, not yet deleted |
| `raqi-collections.liquid` | 4827 | `cf19d4d50f2a3216339cfee02d60dc6a` | no | `rd-brands-index` | cleared, not yet deleted |
| `raqi-concept-steps.liquid` | 5702 | `501cbe47f4e9094bc7ef9b4a40383672` | no | `rd-steps` | cleared, not yet deleted |
| `raqi-page-heading.liquid` | 1269 | `f4c62003da9f758a1d112cdd38abb396` | **yes** | — | keep |
| `collection-list-template.liquid` | 8025 | `8957cea039f04e3aaa6e5d211cf18c49` | no | `rd-brands-index` | keep |

> **Nothing has actually been deleted.** `themeFilesDelete` is refused by the
> MCP server's safety policy ("Theme deletion is blocked — it could take down
> the live storefront. Use Shopify admin."). The three files marked *cleared*
> are verified unreferenced and safe for the owner to delete from
> Shopify admin → Themes → box → Edit code. These archived copies make that
> reversible.

`raqi-page-heading` declares `presets`, so it is still addable from the theme
editor even with no template using it. Deleting it would remove that option,
which is a capability change rather than dead-code removal — left in place.

`collection-list-template` is the section the Brands page used before
`rd-brands-index`. It is the rollback path for that change, which is hours old
and not yet reviewed on a real device — left in place until the new page is
signed off.

## Proof of non-reference

Checked against every template on the theme (80 files, both pages of the
Admin API listing), both section groups (`header-group.json`,
`footer-group.json`) and all seven layouts. Section usage in Online Store 2.0
can only arise from a `type` value in a template or section-group JSON, or a
`{% section %}` tag in a layout — all three were searched. Each of the five
appears zero times.
