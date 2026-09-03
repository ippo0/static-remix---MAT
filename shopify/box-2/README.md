# Shopify theme snapshots — RAQI

These files are **not** part of the `static-remix` skill. They are snapshots of
files edited on the RAQI Shopify store (`waaxj1-6r.myshopify.com` / raqi.ae),
kept here only so the work survives outside an ephemeral session container.

**Shopify is the source of truth.** Editing a file here changes nothing on the
store; it has to be pushed back through the Admin API or the theme editor.

## Themes

| Theme | ID | Role | What it is |
|---|---|---|---|
| `box 2` | `188491465011` | Unpublished | The **redesign** — `rd-header`, `rd-announcement`, `rd-cart-drawer`, `assets/raqi-redesign.css` |
| `Copy of Raqi box` | `188395618611` | **Live (MAIN)** | The older Minimog-based theme. Has no `rd-*` sections at all. |

The redesign has **not** been published. Anything under `box-2/` is draft.

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

Verified on write by MD5: `d8703970e6cac3741801df341897126e`.

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
