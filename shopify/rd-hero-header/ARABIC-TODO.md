# Arabic translation inventory — theme `box`

Arabic (`ar`) is a **published** locale on this store and the RTL plumbing is
correct: `layout/theme.liquid` emits `lang="ar"` and `dir="rtl"`, and
`assets/raqi-redesign.css` swaps `--rd-display`/`--rd-body` to Noto Naskh
Arabic / Noto Kufi Arabic under `html[lang="ar"], html[dir="rtl"]`. Verified in
Chromium: an `ar`/`rtl` render of the Brands page resolves the heading font to
Noto Naskh Arabic, not a system fallback.

What is missing is **copy**, in two categories.

## Category A — section settings (201 occurrences, ~158 unique)

Stored as English literals in the JSON templates. These are translatable
through Translate & Adapt once the theme is published — **but not before**:
Shopify only exposes `ONLINE_STORE_THEME_JSON_TEMPLATE` translatable resources
for the *published* theme. Every such resource on this store today is scoped to
`theme_id=188395618611` (`Copy of Raqi box`). There is no resource for `box`
(188412231987), so these strings cannot be translated via the API yet.

The 9 FAQ questions and answers appear three times (homepage, product,
collection) and the 4 ticker items twice, so the unique wording count is lower
than the occurrence count.

## Category B — hard-coded in section markup (not reachable by Translate & Adapt)

These are literals in the Liquid, not settings. No amount of Translate & Adapt
work will localise them; each needs a `{{ '...' | t }}` key plus entries in
`locales/ar.json`, or a new section setting.

| Section | Strings |
|---|---|
| `rd-header` | `Shop`, `Brands`, `Discovery Set`, `Our Story` (the entire primary nav), `Search`, `Bag (`, `Open menu`, `Chat with RAQI on WhatsApp` |
| `rd-collection` | `All`, `Men`, `Women`, `Unisex`, `Niche` (category tabs), `All brands`, `Filter by category`, `Filter by brand` |
| `rd-cart-drawer` | `Image pending` |
| `rd-brands-index` | `Select a collection` (editor-only empty state, never public) |

`rd-header`'s nav is hard-coded deliberately — its own comment explains that
Shopify navigation menus are store-level linklists shared with the live theme,
so reading or editing one would change the live storefront. That reasoning is
sound, but it has an Arabic consequence the comment does not mention: on the
Arabic storefront the primary navigation stays in English.

---


## homepage — `templates/index.json` (107 strings)


### `rd-hero`

- **rd_hero.eyebrow** — RAQI Discovery Set
- **rd_hero.heading** — No one should buy a signature in two minutes.
- **rd_hero.body** — Choose 1 Signature + 2 Discovery fragrances — 15ml each, 45ml total. Experience three original fragrances before committing to a full bottle.
- **rd_hero.step_line** — yes
- **rd_hero.offer_price** — Dhs. 599
- **rd_hero.offer_breakdown** — Three fragrances · 45ml · Individually Dhs. 850
- **rd_hero.cta1.label** — Build Your Set
- **rd_hero.cta2.label** — Learn More

### `rd-trust`

- **rd_trust.t1.text** — 100% Original
- **rd_trust.t1.tone** — ink
- **rd_trust.t2.text** — Sourced from authorised UAE agents
- **rd_trust.t2.tone** — ink
- **rd_trust.t3.text** — Hand-poured in the UAE
- **rd_trust.t3.tone** — ink
- **rd_trust.t4.text** — Filled from full bottles
- **rd_trust.t4.tone** — ink
- **rd_trust.t5.text** — Sealed glass atomisers
- **rd_trust.t5.tone** — grey
- **rd_trust.t6.text** — Batch recorded on every label
- **rd_trust.t6.tone** — grey
- **rd_trust.t7.text** — Ask to see the source bottle
- **rd_trust.t7.tone** — wine

### `rd-steps`

- **rd_steps.heading** — How a decant is made
- **rd_steps.support** — Three steps, unchanged since our first pour. Nothing is diluted, nothing is substituted.
- **rd_steps.s1.title** — Sourced
- **rd_steps.s1.body** — Sealed full bottles bought from authorised channels. Batch codes recorded before a single drop is moved.
- **rd_steps.s1.body_mobile** — Sealed bottles from authorised channels, batch codes recorded.
- **rd_steps.s2.title** — Poured
- **rd_steps.s2.body** — Transferred by hand into pharmaceutical-grade glass, one order at a time, in a controlled space.
- **rd_steps.s2.body_mobile** — By hand into pharmaceutical-grade glass, one order at a time.
- **rd_steps.s3.title** — Sealed
- **rd_steps.s3.body** — Capped, labelled with house and batch, and sealed the same day it ships to you.
- **rd_steps.s3.body_mobile** — Capped, labelled with house and batch, sealed the day it ships.

### `rd-collection`

- **rd_collection.heading** — The collection
- **rd_collection.count_suffix** — fragrances, poured to order
- **rd_collection.count_suffix_short** — fragrances
- **rd_collection.tier_line** — Buy 2, save 5% · Buy 3 or more, save 10%
- **rd_collection.card_tier_label** — Buy 2, save 5%
- **rd_collection.more_label** — View all
- **rd_collection.empty_text** — Nothing matches that combination yet.

### `rd-profiles`

- **rd_profiles.label** — Shop by scent profile
- **rd_profiles.p1.label** — Woody
- **rd_profiles.p2.label** — Fresh
- **rd_profiles.p3.label** — Sweet
- **rd_profiles.p4.label** — Floral
- **rd_profiles.p5.label** — Citrus
- **rd_profiles.p6.label** — Spicy

### `rd-discovery`

- **rd_discovery.eyebrow** — Not sure where to start?
- **rd_discovery.heading** — Three scents. Fifteen millilitres each. One decision made easier.
- **rd_discovery.body** — You choose all three. Pick any three fragrances from the collection and we pour them at 15ml each into the RAQI box — a set you build, not a sampler w…
- **rd_discovery.cta_label** — Arriving soon
- **rd_discovery.aside** — Or answer two questions and we will name a fragrance for you →
- **rd_discovery.finder_label** — Fragrance finder
- **rd_discovery.q1** — Where will you wear it?
- **rd_discovery.q2** — Which profile draws you?
- **rd_discovery.placeholder_text** — Discovery Set imagery pending from the manufacturer
- **rd_discovery.d1.label** — Woody
- **rd_discovery.d2.label** — Fresh
- **rd_discovery.d3.label** — Sweet
- **rd_discovery.d4.label** — Floral
- **rd_discovery.d5.label** — Citrus
- **rd_discovery.d6.label** — Spicy

### `rd-ticker`

- **rd_ticker.label** — Delivery and returns
- **rd_ticker.t1.text** — Free Delivery Over Dhs. 750
- **rd_ticker.t2.text** — 7-Day Return (Damaged/Defective Items)
- **rd_ticker.t3.text** — UAE Delivery — Next Day
- **rd_ticker.t4.text** — 100% Authentic Fragrances

### `rd-why`

- **rd_why.heading** — Why RAQI
- **rd_why.w1.title** — Authentic, always
- **rd_why.w1.body** — Poured from sealed bottles we bought ourselves. No replicas, no reformulated substitutes.
- **rd_why.w1.body_mobile** — Poured from sealed bottles we bought ourselves.
- **rd_why.w2.title** — A size that decides
- **rd_why.w2.body** — 10ml to meet a fragrance, 30ml to live with it through a season before the full bottle.
- **rd_why.w2.body_mobile** — 10ml to meet a fragrance, 30ml to live with it.
- **rd_why.w3.title** — Quiet by design
- **rd_why.w3.body** — No countdowns, no slashed prices. The fragrance is the argument; we stay out of its way.
- **rd_why.w3.body_mobile** — No countdowns, no slashed prices.

### `raqi-selected`

- **raqi_selected.heading** — Selected this season
- **raqi_selected.view_all_label** — View All Perfumes

### `raqi-story-sizes`

- **raqi_story_sizes.story_eyebrow** — Our Story
- **raqi_story_sizes.story_heading_line_1** — Why commit to a fragrance
- **raqi_story_sizes.story_heading_line_2** — before you know it's yours?
- **raqi_story_sizes.story_body_1** — A bottle of Amouage or Roja can cost more than a month's rent — and two minutes with a paper strip under mall lighting won't tell you how it wears on …
- **raqi_story_sizes.story_body_2** — Every fragrance we sell is 100% authentic, bought from authorised agents here in the UAE — never a copy, never an "inspired by". If you ever want to s…
- **raqi_story_sizes.ten_sprays** — ≈ 170 sprays
- **raqi_story_sizes.ten_body** — About six weeks of daily wear, and small enough for a jacket pocket. The right way to get to know something new.
- **raqi_story_sizes.thirty_sprays** — ≈ 360+ sprays
- **raqi_story_sizes.thirty_body** — Four to six months of wear and the lowest price per millilitre we offer. For the one you already know is yours.

### `rd-faq`

- **rd_faq.heading** — Questions, answered
- **rd_faq.q1.question** — What exactly is a decant?
- **rd_faq.q1.answer** — Fragrance transferred by hand from a sealed, authenticated full bottle into a smaller glass atomiser. Same fragrance, same batch, a size you can finis…
- **rd_faq.q2.question** — Is the fragrance authentic?
- **rd_faq.q2.answer** — Yes. Every bottle is bought through authorised UAE agents and its batch code is recorded before we pour. The code is printed on your label so you can …
- **rd_faq.q3.question** — Where do you source your fragrances?
- **rd_faq.q3.answer** — Authorised agents and distributors in the UAE. We never buy unsealed stock and we never buy from unverified resellers.
- **rd_faq.q4.question** — Why buy a decant instead of a full bottle?
- **rd_faq.q4.answer** — A full bottle costs AED 1,000–1,500. A decant lets you wear the fragrance for weeks first. If it is yours, buy the bottle. If it is not, you have spen…
- **rd_faq.q5.question** — Why 10ml and 30ml?
- **rd_faq.q5.answer** — 10ml is about 170 sprays, enough to know. 30ml is about 360+ sprays, enough to wear a fragrance through a season before committing. We do not sell 3ml…
- **rd_faq.q6.question** — How is the fragrance transferred?
- **rd_faq.q6.answer** — By hand, in a controlled space, using sterilised equipment and pharmaceutical-grade glass atomisers. Nothing is diluted, heated, or mixed. Each order …
- **rd_faq.q7.question** — Can I see a photo of the source bottle or batch date?
- **rd_faq.q7.answer** — Yes. Ask us before or after you order and we will send a photo of the bottle your decant was filled from, including its batch code and date.
- **rd_faq.q8.question** — What is the Discovery Set?
- **rd_faq.q8.answer** — Three fragrances you choose yourself, poured at 15ml each into the RAQI box. It is built by you, not a fixed sampler. Arriving soon.
- **rd_faq.q9.question** — How is the Discovery Set different from a normal decant?
- **rd_faq.q9.answer** — A decant is one fragrance at 10ml or 30ml. The Discovery Set is three fragrances at 15ml each in a presentation box, made for deciding between houses …

## product — `templates/product.json` (47 strings)


### `raqi-product`

- **main.breadcrumb_root** — All perfumes
- **main.photo_placeholder** — Product photo
- **main.authentic_decant_label** — Authentic decant
- **main.ten_ml_sprays** — ≈ 170 sprays
- **main.thirty_ml_sprays** — ≈ 360+ sprays
- **main.ten_ml_caption** — Try it
- **main.thirty_ml_caption** — Live with it
- **main.fragrance_notes_label** — Fragrance Notes
- **main.note_top_label** — Top
- **main.note_heart_label** — Heart
- **main.note_base_label** — Base
- **main.add_to_cart_label** — Add to Cart
- **main.photo_proof_text** — Want proof? Ask and we'll send a photo of the bottle yours was poured from, plus the batch date.
- **main.trust_1** — 100% original
- **main.trust_2** — Filled to order
- **main.trust_3** — Ships next day (UAE)
- **main.shipping_returns_label** — Shipping & Returns
- **main.ship_uae_label** — Across the UAE —
- **main.ship_uae_body** — next-day delivery, free over Dhs. 999.
- **main.returns_label** — Returns —
- **main.returns_body** — A customer can request a refund only if they receive a product in a damaged or defective condition. If the reason is genuine, a refund will be issued …
- **main.ship_footnote_pre** — Questions?
- **main.ship_footnote_whatsapp** — Contact us
- **main.ship_footnote_or** — or read the full
- **main.ship_footnote_policy** — Shipping Policy
- **main.product_info_label** — Product Information

### `raqi-related`

- **related.heading** — You may also like
- **related.view_all_label** — View all perfumes

### `rd-faq`

- **rd_faq.heading** — Questions, answered
- **rd_faq.q1.question** — What exactly is a decant?
- **rd_faq.q1.answer** — Fragrance transferred by hand from a sealed, authenticated full bottle into a smaller glass atomiser. Same fragrance, same batch, a size you can finis…
- **rd_faq.q2.question** — Is the fragrance authentic?
- **rd_faq.q2.answer** — Yes. Every bottle is bought through authorised UAE agents and its batch code is recorded before we pour. The code is printed on your label so you can …
- **rd_faq.q3.question** — Where do you source your fragrances?
- **rd_faq.q3.answer** — Authorised agents and distributors in the UAE. We never buy unsealed stock and we never buy from unverified resellers.
- **rd_faq.q4.question** — Why buy a decant instead of a full bottle?
- **rd_faq.q4.answer** — A full bottle costs AED 1,000–1,500. A decant lets you wear the fragrance for weeks first. If it is yours, buy the bottle. If it is not, you have spen…
- **rd_faq.q5.question** — Why 10ml and 30ml?
- **rd_faq.q5.answer** — 10ml is about 170 sprays, enough to know. 30ml is about 360+ sprays, enough to wear a fragrance through a season before committing. We do not sell 3ml…
- **rd_faq.q6.question** — How is the fragrance transferred?
- **rd_faq.q6.answer** — By hand, in a controlled space, using sterilised equipment and pharmaceutical-grade glass atomisers. Nothing is diluted, heated, or mixed. Each order …
- **rd_faq.q7.question** — Can I see a photo of the source bottle or batch date?
- **rd_faq.q7.answer** — Yes. Ask us before or after you order and we will send a photo of the bottle your decant was filled from, including its batch code and date.
- **rd_faq.q8.question** — What is the Discovery Set?
- **rd_faq.q8.answer** — Three fragrances you choose yourself, poured at 15ml each into the RAQI box. It is built by you, not a fixed sampler. Arriving soon.
- **rd_faq.q9.question** — How is the Discovery Set different from a normal decant?
- **rd_faq.q9.answer** — A decant is one fragrance at 10ml or 30ml. The Discovery Set is three fragrances at 15ml each in a presentation box, made for deciding between houses …

## collection/shop — `templates/collection.json` (31 strings)


### `rd-collection`

- **rd_collection.heading** — The collection
- **rd_collection.count_suffix** — fragrances, poured to order
- **rd_collection.count_suffix_short** — fragrances
- **rd_collection.tier_line** — Buy 2, save 5% · Buy 3 or more, save 10%
- **rd_collection.card_tier_label** — Buy 2, save 5%
- **rd_collection.more_label** — View all
- **rd_collection.empty_text** — Nothing matches that combination yet.

### `rd-ticker`

- **rd_ticker.label** — Delivery and returns
- **rd_ticker.t1.text** — Free Delivery Over Dhs. 750
- **rd_ticker.t2.text** — 7-Day Return (Damaged/Defective Items)
- **rd_ticker.t3.text** — UAE Delivery — Next Day
- **rd_ticker.t4.text** — 100% Authentic Fragrances

### `rd-faq`

- **rd_faq.heading** — Questions, answered
- **rd_faq.q1.question** — What exactly is a decant?
- **rd_faq.q1.answer** — Fragrance transferred by hand from a sealed, authenticated full bottle into a smaller glass atomiser. Same fragrance, same batch, a size you can finis…
- **rd_faq.q2.question** — Is the fragrance authentic?
- **rd_faq.q2.answer** — Yes. Every bottle is bought through authorised UAE agents and its batch code is recorded before we pour. The code is printed on your label so you can …
- **rd_faq.q3.question** — Where do you source your fragrances?
- **rd_faq.q3.answer** — Authorised agents and distributors in the UAE. We never buy unsealed stock and we never buy from unverified resellers.
- **rd_faq.q4.question** — Why buy a decant instead of a full bottle?
- **rd_faq.q4.answer** — A full bottle costs AED 1,000–1,500. A decant lets you wear the fragrance for weeks first. If it is yours, buy the bottle. If it is not, you have spen…
- **rd_faq.q5.question** — Why 10ml and 30ml?
- **rd_faq.q5.answer** — 10ml is about 170 sprays, enough to know. 30ml is about 360+ sprays, enough to wear a fragrance through a season before committing. We do not sell 3ml…
- **rd_faq.q6.question** — How is the fragrance transferred?
- **rd_faq.q6.answer** — By hand, in a controlled space, using sterilised equipment and pharmaceutical-grade glass atomisers. Nothing is diluted, heated, or mixed. Each order …
- **rd_faq.q7.question** — Can I see a photo of the source bottle or batch date?
- **rd_faq.q7.answer** — Yes. Ask us before or after you order and we will send a photo of the bottle your decant was filled from, including its batch code and date.
- **rd_faq.q8.question** — What is the Discovery Set?
- **rd_faq.q8.answer** — Three fragrances you choose yourself, poured at 15ml each into the RAQI box. It is built by you, not a fixed sampler. Arriving soon.
- **rd_faq.q9.question** — How is the Discovery Set different from a normal decant?
- **rd_faq.q9.answer** — A decant is one fragrance at 10ml or 30ml. The Discovery Set is three fragrances at 15ml each in a presentation box, made for deciding between houses …

## brands — `templates/list-collections.json` (4 strings)


### `rd-brands-index`

- **main.heading** — The houses
- **main.intro** — Every fragrance we decant comes from a house worth knowing. Start with the one that draws you.
- **main.count_singular** — fragrance
- **main.count_plural** — fragrances

## header — `sections__header-group.json` (2 strings)


### `rd-announcement`

- **rd_announcement.message_1** — Free shipping over Dhs. 750
- **rd_announcement.message_2** — Buy 2, save 5% · Buy 3+, save 10%

## footer — `sections__footer-group.json` (10 strings)


### `footer`

- **footer.design** — footer-1
- **footer.container** — container-fluid
- **footer.copyright** — © 2026 RAQI · United Arab Emirates
- **footer.brand.html** — <div class="raqi-footer-brand"><p class="raqi-footer-brand__logo">RAQI</p><p class="raqi-footer-brand__body">{% if request.locale.iso_code == 'ar' %}ع…
- **footer.customer_service.title** — Customer service
- **footer.customer_service.html** — <ul class="raqi-footer-links"><li><a href="{{ pages['shipping-policy'].url }}">{% if request.locale.iso_code == 'ar' %}سياسة الشحن{% else %}Shipping P…
- **footer.legal.title** — Legal
- **footer.legal.html** — <ul class="raqi-footer-links"><li><a href="{{ pages['terms-of-service'].url }}">{% if request.locale.iso_code == 'ar' %}الشروط والأحكام{% else %}Terms…
- **footer.shop.title** — Shop
- **footer.shop.html** — <ul class="raqi-footer-links"><li><a href="{{ routes.all_products_collection_url }}">{% if request.locale.iso_code == 'ar' %}كل العطور{% else %}All Pe…
