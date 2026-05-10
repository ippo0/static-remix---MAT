---
name: static-remix
description: Turn a PDF of winning competitor static ads into on-brand recreations of those ads for the user's product, generating images with Nano Banana Pro (Gemini 3 Pro Image Preview). Trigger when the user runs /static-remix or asks to "remix static ads from a PDF" / "recreate competitor static ads for my product." The skill walks a fixed pipeline: extract framework-labelled images from the PDF, ask the four required questions (product URL, total images, variations per concept, per-framework split), fetch and visually describe the actual product photo, write per-concept production briefs, and generate every concept x variation with the product photo attached as a reference image on every API call.
---

# static-remix

You are running the `static-remix` pipeline. Follow the steps in order. Do not skip steps and do not silently default any of the four required user questions in step 3.

The slash command may be invoked with a PDF path as its argument:

    /static-remix /path/to/winning-statics.pdf

If no path was provided, ask the user for the PDF path before doing anything else. Expand `~` to `$HOME`. If the file does not exist, stop and tell the user.

## Required environment

`GEMINI_API_KEY` must be set. If it isn't, stop and tell the user to export it before re-running.

## Helper scripts

All scripts live next to this `SKILL.md` in `scripts/`. Resolve their absolute paths from this file's directory (e.g. `~/.claude/skills/static-remix/scripts/...`). Do not rewrite their logic inline.

- `scripts/extract_pdf_images.py` — extracts every image from the PDF, auto-detects the heading font, labels each image by the nearest heading above it, writes a JSON manifest.
- `scripts/fetch_product.py` — fetches the product page (Shopify-aware via `<url>.json`) and downloads the primary product image.
- `scripts/gemini-image-ref.sh` — calls Nano Banana Pro with a text prompt + optional reference image, decodes the base64 response, saves a PNG.

## Pipeline

### 1. Create the run folder

Compute a local timestamp `YYYYMMDD-HHMM`. Create:

    ~/.claude/skills/static-remix/runs/<YYYYMMDD-HHMM>/
        source/        # extracted PDF images
        product/       # product page + image + visual description
        briefs/        # teardowns + per-concept briefs
        production/    # final generated images

Hold onto the absolute run-folder path; you'll reference it throughout.

### 2. Extract images from the PDF

Run:

    python3 ~/.claude/skills/static-remix/scripts/extract_pdf_images.py "<pdf_path>" "<run_dir>/source"

The script auto-detects the heading font by picking the font that appears in short text spans on the most pages, then labels every extracted image with the nearest heading above it. It writes `<run_dir>/source/manifest.json` and prints a JSON summary including `headings_detected`.

If the script reports `image_count: 0` or every image is `(unlabeled)`, stop and tell the user — the PDF probably doesn't match the expected layout (section heading above each ad).

### 3. Ask the four required questions (use AskUserQuestion)

Ask all four. Never skip and never silently default any of them.

**Q1. Product URL (no default).** Ask in its own AskUserQuestion call. Provide two placeholder options like `Shopify product page` and `Other product page` so the user can hit "Other" and type the URL freely. Validate it starts with `http`.

**Q2. Total images.** Options: `10`, `30`, `50`, `100` (auto-Other lets them type any number).

**Q3. Variations per concept.** Options: `1`, `2 (Recommended)`, `3`. Variations share a framework — only one axis changes between them (camera angle, overlay wording, palette tone, etc.).

**Q4. Per-framework split.** Show the frameworks you got back in `headings_detected`. Offer `Even split across all detected frameworks` plus `Custom (I'll specify counts)`. If the user picks Custom, ask a follow-up where they type counts like `20 US VS THEM, 10 BOLD CLAIM, 10 Before & After, 10 TESTIMONIAL`.

**Validate the math.** `sum(per_framework_counts) * variations_per_concept` must equal `total_images`. If it doesn't, show the mismatch (`expected X concepts × Y variations = Z, got W`) and ask the user to fix it. Loop until the numbers add up. Do not start generating until the math works.

**Compute and confirm cost.** `concepts = total_images / variations`. Estimated cost = `total_images * $0.25`. If the cost exceeds **$10**, confirm with the user before proceeding.

### 4. Fetch the product page + photo

Run:

    python3 ~/.claude/skills/static-remix/scripts/fetch_product.py "<product_url>" "<run_dir>/product"

This writes `<run_dir>/product/product_summary.json` with `title`, `price`, `images`, and `primary_image_path`. For Shopify URLs it also saves `<run_dir>/product/product.json` with the full product payload.

If `primary_image_path` is null, stop and tell the user — every generation needs a product photo as the reference image. Generation cannot start without it.

**Critical step.** Open `primary_image_path` with the **Read** tool and look at it. Then write a concrete visual description to `<run_dir>/product/visual_description.md`:

- Bottle / package shape and color
- Cap color and finish
- Label typography and any prominent label words
- Capsule / softgel / pill color (if visible)
- Brand color palette (3–6 hex-ish colors you actually see)
- Anything else the camera catches: textures, gloss, material

Do **not** describe the product from the page text alone. Viewing the image is what keeps every later generation on-brand. Keep this file open conceptually — every prompt you write later should reuse these details.

### 5. Pick + tear down source examples

Group `manifest.json` images by `heading` (= framework). For each framework you'll be using (per the step-3 split), pick the strongest one or two examples and view each with **Read**. Append a teardown block to `<run_dir>/briefs/teardowns.md`:

    ## <framework> — <source filename>
    - **Framework:** <name>
    - **Why it works:** <psychological hook — contrast, proof, specificity, urgency>
    - **Keep:** <structural elements that transfer (composition, overlay placement, before/after split, etc.)>
    - **Swap:** <what to replace with the user's brand — palette, copy, product photo>

These teardowns inform the briefs in step 6.

### 6. Write per-concept production briefs

Pull pricing, discount %, bundle counts, and any offer copy verbatim from `product_summary.json` and `product.json`. Never invent numbers.

Write `<run_dir>/briefs/concepts.md` with one block per concept, in the count distribution agreed in step 3:

    ## Concept 01 — <framework>
    - **Scene:** <composition, lighting, props, palette pulled from visual_description.md>
    - **Text overlays (exact quoted copy):**
      - Headline: "<exact words>"
      - Sub: "<exact words>"
      - Badge / sticker: "<exact words>"
    - **Headline (the big claim):** "<...>"
    - **Caption (the post body, 1–3 sentences):** <...>
    - **Variation axis:** <one thing that changes between var_01 and var_02 — e.g. camera angle (eye-level → top-down), or overlay wording, or palette tone>

Total concept count = `total_images / variations`. The per-framework counts must match step 3.

### 7. Generate every concept × variation

Default aspect ratio is `1:1`. If the user mentioned a specific placement (Stories → `9:16`, feed portrait → `4:5`), confirm before generating.

For each concept, for each variation, run:

    ~/.claude/skills/static-remix/scripts/gemini-image-ref.sh \
      --prompt "<prompt text>" \
      --aspect "1:1" \
      --reference "<run_dir>/product/<product_image_filename>" \
      --output "<run_dir>/production/concept_<NN>_var_<MM>.png"

Build each prompt by combining: scene description, exact overlay copy in quotes, palette + product details from `visual_description.md`, the variation axis applied. Tell the model the on-pack copy must be rendered legibly and that the bottle must look like the reference image.

**Always pass `--reference` pointing at the product photo.** That's what makes the brand visual consistent across every image. Do not skip it on any call.

Run the calls **sequentially** (no `&` / no parallel). After the full pass, look at stderr from any failed call. If the failure was an HTTP 500, retry that single call once. Other HTTP codes (400/401/403/404/429) are not retried — surface the message to the user and keep going.

Track every output (success/fail) in a list so you can summarize counts in the report.

### 8. Write `report.txt`

Save `<run_dir>/report.txt`. Plain text, no markdown headers needed:

    static-remix run — <timestamp>
    Run folder: <abs path>
    Product: <title> — <product_url>
    Total images requested: <N>   produced: <K>   failed: <K - produced>

    Top 3 concepts to test first:
    1. concept_NN (<framework>) — <one-line reason>
    2. concept_NN (<framework>) — <one-line reason>
    3. concept_NN (<framework>) — <one-line reason>

    Testing playbook:
    - Budget: $25–50/day per creative for the first 48–72h.
    - Kill criteria: kill an ad if CTR < 1% after $50 spend, or 0 purchases after $100 spend.
    - Read early signal from CTR + thumbstop rate before optimising for ROAS.
    - Rotate the variation axis (e.g. camera angle) to find which side of the axis wins, then iterate.

    Per-concept details:
    Concept 01 — <framework>
      Headline: "<...>"
      Caption: "<...>"
      Variation axis: <...>
      Files: production/concept_01_var_01.png, production/concept_01_var_02.png
    Concept 02 — ...

Pick the top 3 by combining: how strong the source teardown was, how on-brief the rendered overlays look, and framework variety (don't pick all three from the same framework unless one framework dominates the run).

### 9. Final chat message

Send a short final message to the user. Do **not** dump the whole report. Three short lines:

    Run: <abs run folder path>
    Images: <produced>/<requested> (<failed> failed)
    Top 3 to test first: concept_NN (<framework>), concept_NN (<framework>), concept_NN (<framework>)

That's it. Stop.

## Notes and failure modes

- The bash helper exits non-zero on any non-200 from the Gemini API. The HTTP code and a snippet of the response body go to stderr — capture stderr to detect 500s for the end-of-run retry pass.
- If you can't view the product image with Read, stop. The skill is only on-brand because you describe what you actually see.
- Don't fabricate prices, discounts, or "as seen in" claims. Only use copy that appears in the product page or in the user's instructions.
- Sequential calls are intentional — parallel calls hit rate limits and obscure failures.
- This skill is invoked manually with `/static-remix`. Don't auto-trigger it from other contexts.
