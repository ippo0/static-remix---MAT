# box 2 (188491465011) — files with zero live references

Generated 2026-09-03 from a full reachability scan of all 652 theme files.
Roots: layout/theme.liquid, layout/password.liquid, every template a store resource actually uses,
config/*, locales/*. Edges: section `type` values inside JSON templates/section groups, `render`/`include`/
`section`/`sections`/`layout` tags (both `{% %}` and bare-in-`{% liquid %}` forms), `| asset_url` and literal
asset filenames; comments stripped first.

Total 652 files / 7802 KB · reachable 234 · **removable 418 files / 6264 KB (80 % of theme bytes)**

Three proof classes:

- **A. Unused alternate template** — no product/collection/page/blog carries that `templateSuffix` (checked via Admin API).
- **B. Zero references anywhere** — filename/type never appears in any other file, live or dead.
- **C. Referenced only from dead files** — every referrer is itself in this list. Safe once the referrers go too; delete as one batch (templates → sections → snippets → assets).

## Minimog stock (unused features) — 215 files, 1773 KB

| file | KB | proof | referenced only by |
|---|---:|:-:|---|
| `assets/announcement-bar.js` | 1.0 | C | annoucement.liquid |
| `assets/ask-question.js` | 2.1 | C | main-product-blocks.liquid |
| `assets/blog-post.css` | 0.2 | C | blog-posts.liquid |
| `assets/brands-list.css` | 0.4 | C | brands-list.liquid |
| `assets/brands-list.js` | 1.5 | C | brands-list.liquid |
| `assets/cascading-parallax.js` | 4.6 | C | cascading-collection.liquid, cascading-product.liquid |
| `assets/cascading.css` | 0.8 | C | cascading-collection.liquid, cascading-product.liquid |
| `assets/collage-tabs.css` | 1.6 | C | collage-tabs.liquid |
| `assets/collage-tabs.js` | 0.8 | C | collage-tabs.liquid |
| `assets/collection-header.css` | 2.2 | C | collection-page-header.liquid |
| `assets/collection-image-showcase.css` | 3.3 | C | collection-image-showcase.liquid |
| `assets/collection-image-showcase.js` | 2.8 | C | collection-image-showcase.liquid |
| `assets/collection-list.css` | 3.9 | C | collection-list.liquid |
| `assets/collection-list.js` | 4.3 | C | collection-list.liquid |
| `assets/collection-showcase.css` | 3.3 | C | collection-showcase.liquid |
| `assets/collection-showcase.js` | 4.7 | C | collection-showcase.liquid |
| `assets/collection-tabs.css` | 3.0 | C | collection-tabs.liquid |
| `assets/collection-tabs.js` | 3.7 | C | collection-tabs.liquid |
| `assets/compare-product.js` | 5.3 | C | theme.gempages.blank.liquid, theme.gempages.footer.liquid, theme.gempages.header.liquid |
| `assets/component-cascading-collection-card.css` | 0.3 | C | cascading-collection.liquid |
| `assets/component-cascading-product-card.css` | 0.9 | C | cascading-product.liquid |
| `assets/component-collection-card.css` | 3.1 | C | collection-list-template.liquid, collection-list.liquid, header-main-menu-container.liquid … |
| `assets/component-image-card.css` | 2.4 | C | custom-content.liquid, featured-collection-banner.liquid, image-with-text-1.liquid … |
| `assets/component-photoswipe.css` | 2.1 | C | main-product.liquid, product-quickview.liquid |
| `assets/countdown-timer.css` | 0.5 | C | countdown-timer.liquid |
| `assets/custom.css.liquid` | 7.1 | B |  |
| `assets/featured-collection-banner.css` | 1.0 | C | featured-collection-banner.liquid |
| `assets/featured-collection.css` | 1.9 | C | featured-collection.liquid |
| `assets/featured-collection.js` | 10.4 | C | featured-collection.liquid |
| `assets/featured-product-slider.js` | 2.7 | C | featured-product-slider.liquid |
| `assets/featured-slider.css` | 2.7 | C | featured-product-slider.liquid |
| `assets/find-a-store.css` | 2.0 | C | page-find-a-store.liquid |
| `assets/foxkit-flash-sale.js` | 1.9 | C | main-collection-product-grid.liquid |
| `assets/foxkit-flashsale-countdown.js` | 4.2 | C | main-collection-product-grid.liquid |
| `assets/gallery.css` | 2.2 | C | gallery.liquid |
| `assets/google-maps.css` | 1.7 | C | maps.liquid |
| `assets/handpicked-products.js` | 3.7 | C | custom-content.liquid |
| `assets/hero.css` | 4.1 | C | image-with-text-2.liquid, video-hero.liquid |
| `assets/hotspots-image.css` | 2.0 | C | hotspots-image.liquid |
| `assets/hotspots-image.js` | 3.3 | C | hotspots-image.liquid |
| `assets/icon-box.css` | 0.7 | C | icon-box.liquid |
| `assets/icon-box.js` | 3.3 | C | icon-box.liquid |
| `assets/image-cards.css` | 1.7 | C | image-with-text-1.liquid |
| `assets/image-layer.js` | 1.2 | C | image-with-text.liquid |
| `assets/image-with-text.css` | 1.1 | C | image-with-text.liquid |
| `assets/iwt-carousel.js` | 3.5 | C | multiple-image-with-text.liquid |
| `assets/lookbook-hero.js` | 3.0 | C | lookbook-hero.liquid |
| `assets/lookbook-slider.js` | 5.1 | C | lookbook-card-slider.liquid |
| `assets/lookbook.css` | 11.2 | C | custom-content.liquid, lookbook.liquid |
| `assets/maps.js` | 4.2 | C | maps.liquid |
| `assets/multiple-iwt.css` | 0.8 | C | multiple-image-with-text.liquid |
| `assets/newsletter.css` | 2.4 | C | newsletter.liquid |
| `assets/parallax.js` | 2.0 | C | collection-page-header.liquid, custom-content.liquid, image-with-text-2.liquid |
| `assets/photoswipe.css` | 4.5 | C | main-product.liquid, product-quickview.liquid |
| `assets/photoswipe.js` | 75.8 | C | main-product.liquid |
| `assets/pickup-availability.css` | 0.5 | C | main-product-blocks.liquid |
| `assets/pickup-availability.js` | 4.1 | C | main-product-blocks.liquid |
| `assets/press.css` | 1.7 | C | press.liquid |
| `assets/press.js` | 3.1 | C | press.liquid |
| `assets/price-per-item.js` | 4.9 | C | main-product.liquid, new-featured-product.liquid, product-quickview.liquid |
| `assets/product-bundles.css` | 0.6 | C | product-bundles.liquid |
| `assets/product-bundles.js` | 8.7 | C | custom-content.liquid, product-bundles.liquid |
| `assets/product-complementary.css` | 2.8 | C | main-product-blocks.liquid |
| `assets/product-details-tabs.js` | 0.6 | C | product-details-tabs.liquid |
| `assets/product-page.css` | 165.9 | B |  |
| `assets/product-tabs.css` | 2.3 | C | product-tabs.liquid |
| `assets/product-tabs.js` | 9.7 | C | product-tabs.liquid |
| `assets/promotion-banner.css` | 1.6 | C | promotion-banner.liquid |
| `assets/promotion-countdown-timer.css` | 0.5 | C | promotion-countdown-timer.liquid |
| `assets/quick-order-list.css` | 2.5 | C | quick-order-list.liquid |
| `assets/quick-order-list.js` | 8.8 | C | quick-order-list.liquid |
| `assets/recipient-form.js` | 5.5 | C | gift-card-recipient-form.liquid |
| `assets/rich-text.css` | 1.8 | C | rich-text.liquid |
| `assets/scrolling-promotion.css` | 2.7 | C | scrolling-promotion.liquid |
| `assets/scrolling-promotion.js` | 1.3 | C | scrolling-promotion.liquid |
| `assets/sharing.js` | 1.4 | C | main-product-blocks.liquid |
| `assets/show-more.js` | 1.2 | C | main-product.liquid, new-featured-product.liquid, product-quickview.liquid |
| `assets/slideshow.css` | 10.2 | C | banner-with-slider.liquid, slider.liquid |
| `assets/slideshow.js` | 3.2 | C | slider.liquid |
| `assets/sticky-add-to-cart.css` | 2.2 | C | sticky-atc.liquid |
| `assets/sticky-atc.js` | 8.3 | C | sticky-atc.liquid |
| `assets/stl-card.js` | 1.3 | C | lookbook.liquid |
| `assets/swiper.css` | 5.3 | B |  |
| `assets/swiper.js` | 91.0 | B |  |
| `assets/tabs.css` | 1.0 | C | collage-tabs.liquid, product-details-tabs.liquid, product-tabs.liquid … |
| `assets/tags-filters.js` | 4.3 | C | filter-by-tags.liquid |
| `assets/testimonials.css` | 14.8 | C | testimonials.liquid |
| `assets/testimonials.js` | 6.7 | C | testimonials.liquid |
| `assets/video.css` | 2.3 | C | custom-content.liquid, video.liquid |
| `assets/visitors-counter.js` | 1.7 | C | main-product-blocks.liquid |
| `assets/wishlist.js` | 6.5 | C | theme.gempages.blank.liquid, theme.gempages.footer.liquid, theme.gempages.header.liquid |
| `layout/theme.gempages.blank.liquid` | 8.8 | C | page.gp-template-604508745682125793.json |
| `layout/theme.gempages.footer.liquid` | 8.9 | B |  |
| `layout/theme.gempages.header.liquid` | 8.5 | B |  |
| `sections/annoucement.liquid` | 6.1 | B |  |
| `sections/apps.liquid` | 3.2 | C | product.bof.json, product.collagen-drops.json, product.collagen.json … |
| `sections/blog-posts.liquid` | 11.9 | B |  |
| `sections/brands-list.liquid` | 12.4 | B |  |
| `sections/breadcrumb.liquid` | 2.3 | C | page.faqs.json, product.custom-layout-1.json, product.custom-layout-2.json … |
| `sections/cart-count.liquid` | 0.2 | B |  |
| `sections/cart-drawer.liquid` | 0.0 | B |  |
| `sections/cart-gift-wrapping.liquid` | 2.6 | B |  |
| `sections/cascading-collection.liquid` | 8.3 | B |  |
| `sections/cascading-product.liquid` | 8.3 | B |  |
| `sections/collage-tabs.liquid` | 14.5 | B |  |
| `sections/collapsible-tabs.liquid` | 16.0 | C | product.gem-1769844747-template.json, product.gem-backup-default.json, product.grid-1-column.json … |
| `sections/collection-image-showcase.liquid` | 8.8 | B |  |
| `sections/collection-list-template.liquid` | 7.8 | B |  |
| `sections/collection-list.liquid` | 23.8 | C | collection.custom-content-banner.json |
| `sections/collection-page-header.liquid` | 11.3 | C | collection.canvas-sidebar.json, collection.custom-content-banner.json, collection.filter-by-tags.json … |
| `sections/collection-showcase.liquid` | 17.5 | B |  |
| `sections/collection-tabs.liquid` | 11.6 | B |  |
| `sections/contact-form.liquid` | 7.8 | B |  |
| `sections/countdown-timer.liquid` | 12.2 | B |  |
| `sections/country-options.liquid` | 0.2 | B |  |
| `sections/custom-code.liquid` | 0.7 | C | page.find-a-store.json, product.custom-layout-1.json, product.custom-layout-2.json … |
| `sections/custom-liquid.liquid` | 0.5 | C | product.matt.json, product.old-product-page.json |
| `sections/empty-space.liquid` | 2.8 | C | collection.custom-content-banner.json, product.grid-1-column.json, product.grid-mix-columns.json |
| `sections/featured-collection-banner.liquid` | 17.0 | B |  |
| `sections/featured-collection.liquid` | 22.7 | B |  |
| `sections/featured-product-slider.liquid` | 15.8 | B |  |
| `sections/featured-section.liquid` | 19.7 | C | page.campaigns-dentaguard.json, page.campaigns-petlyra.json |
| `sections/flash-sale.liquid` | 1.1 | C | collection.flash-sale.json |
| `sections/foxkit-json.liquid` | 0.4 | B |  |
| `sections/foxkit-related-product.liquid` | 0.5 | B |  |
| `sections/gallery.liquid` | 16.3 | B |  |
| `sections/horizontal-ticker.liquid` | 11.3 | C | index.gem-1769844747-template.json, index.gem-1770999669-template.json, index.gem-backup-default.json … |
| `sections/hotspots-image.liquid` | 11.9 | C | product.grid-mix-columns.json |
| `sections/icon-box.liquid` | 21.1 | C | product.custom-layout-5.json, product.grid-2-columns.json, product.grid-mix-columns.json |
| `sections/image-with-text-1.liquid` | 12.1 | B |  |
| `sections/image-with-text-2.liquid` | 16.4 | B |  |
| `sections/image-with-text.liquid` | 14.5 | C | product.collagen-drops.json, product.glove-2.json, product.grid-1-column.json … |
| `sections/legal-footer.liquid` | 15.9 | C | page.campaigns-dentaguard.json, page.campaigns-petlyra.json |
| `sections/lookbook.liquid` | 32.3 | B |  |
| `sections/main-collection-product-grid.liquid` | 19.8 | C | collection.canvas-sidebar.json, collection.custom-content-banner.json, collection.filter-by-tags.json … |
| `sections/main-product.liquid` | 70.5 | C | product.bof.json, product.collagen-drops.json, product.collagen.json … |
| `sections/maps.liquid` | 9.5 | B |  |
| `sections/multiple-image-with-text.liquid` | 12.9 | B |  |
| `sections/newsletter.liquid` | 13.6 | B |  |
| `sections/page-about-us.liquid` | 0.0 | B |  |
| `sections/page-contact.liquid` | 2.5 | B |  |
| `sections/page-faqs.liquid` | 11.1 | C | page.faqs.json |
| `sections/page-find-a-store.liquid` | 6.9 | C | page.find-a-store.json |
| `sections/page-product-compare.liquid` | 0.5 | C | page.product-compare.json |
| `sections/page-wishlist.liquid` | 0.8 | C | page.wishlist.json |
| `sections/pickup-availability.liquid` | 6.4 | B |  |
| `sections/predictive-search.liquid` | 6.8 | B |  |
| `sections/press.liquid` | 7.9 | C | product.grid-2-columns.json |
| `sections/product-bundles.liquid` | 13.5 | B |  |
| `sections/product-details-tabs.liquid` | 7.8 | C | product.bof.json, product.collagen-drops.json, product.collagen.json … |
| `sections/product-json.liquid` | 0.6 | B |  |
| `sections/product-quickview.liquid` | 8.0 | B |  |
| `sections/product-recommendations.liquid` | 9.1 | C | product.custom-layout-1.json, product.custom-layout-2.json, product.custom-layout-3.json … |
| `sections/product-tabs.liquid` | 26.3 | B |  |
| `sections/promotion-banner.liquid` | 12.6 | B |  |
| `sections/promotion-countdown-timer.liquid` | 10.4 | B |  |
| `sections/quick-order-list.liquid` | 12.0 | B |  |
| `sections/rich-text.liquid` | 10.3 | C | product.gem-1769844747-template.json, product.gem-backup-default.json, product.old-product-page.json |
| `sections/scrolling-promotion.liquid` | 12.6 | C | product.gem-1769844747-template.json, product.gem-backup-default.json, product.grid-mix-columns.json … |
| `sections/slider.liquid` | 34.0 | C | index.gem-1769844747-template.json, index.gem-1770999669-template.json, index.gem-backup-default.json … |
| `sections/testimonials.liquid` | 12.4 | C | product.grid-1-column.json |
| `sections/video.liquid` | 12.7 | B |  |
| `snippets/agree-terms-checkbox.liquid` | 1.1 | C | main-product-blocks.liquid, product-form.liquid |
| `snippets/article-card-placeholder.liquid` | 1.0 | C | blog-posts.liquid, custom-content.liquid |
| `snippets/cart-line-item.liquid` | 22.6 | B |  |
| `snippets/cascade-collection-card.liquid` | 1.6 | C | cascading-collection.liquid |
| `snippets/cascade-product-card-placeholder.liquid` | 0.6 | C | cascading-product.liquid |
| `snippets/cascade-product-card.liquid` | 1.5 | C | cascading-product.liquid |
| `snippets/cascade.liquid` | 6.2 | C | cascading-collection.liquid, cascading-product.liquid |
| `snippets/collection-card.liquid` | 8.0 | C | collection-list-template.liquid, collection-list.liquid |
| `snippets/collection-sidebar.liquid` | 5.3 | C | main-collection-product-grid.liquid |
| `snippets/collection-tab.liquid` | 5.2 | C | collection-tabs.liquid |
| `snippets/filter-by-tags.liquid` | 11.6 | C | collection-sidebar.liquid |
| `snippets/footer-block__menu.liquid` | 0.5 | B |  |
| `snippets/form__ask-a-question.liquid` | 1.6 | C | main-product-blocks.liquid |
| `snippets/gift-card-recipient-form.liquid` | 7.9 | C | main-product-blocks.liquid |
| `snippets/icon-3d-model.liquid` | 0.5 | C | product-thumbnail.liquid |
| `snippets/icon-play.liquid` | 0.4 | C | product-thumbnail.liquid |
| `snippets/icon-testimonials.liquid` | 6.1 | C | scrolling-promotion.liquid |
| `snippets/image-card.liquid` | 8.6 | C | custom-content.liquid, featured-collection-banner.liquid, image-with-text-1.liquid … |
| `snippets/index-section-header.liquid` | 3.3 | C | apps.liquid, banner-with-slider.liquid, blog-posts.liquid … |
| `snippets/lookbook-card-slider.liquid` | 11.5 | C | lookbook.liquid |
| `snippets/lookbook-card.liquid` | 4.1 | C | custom-content.liquid, lookbook.liquid |
| `snippets/lookbook-hero.liquid` | 10.1 | C | lookbook.liquid |
| `snippets/main-product-blocks.liquid` | 69.0 | C | main-product.liquid, new-featured-product.liquid |
| `snippets/mm-socialshopwave-widget-recommends.liquid` | 1.4 | B |  |
| `snippets/mm-ssw-widget-avg-rate-listing.liquid` | 2.6 | B |  |
| `snippets/product-card-bundle.liquid` | 14.2 | C | custom-content.liquid, product-bundles.liquid |
| `snippets/product-data.liquid` | 3.3 | C | main-product.liquid, new-featured-product.liquid |
| `snippets/product-form.liquid` | 17.4 | C | custom-content.liquid, product-quickview.liquid |
| `snippets/product-icons.liquid` | 4.9 | C | main-product-blocks.liquid |
| `snippets/product-intro-tag.liquid` | 0.8 | C | main-product-blocks.liquid |
| `snippets/product-media.liquid` | 9.6 | C | main-product.liquid, new-featured-product.liquid, product-quickview.liquid |
| `snippets/product-qty-input.liquid` | 2.1 | C | main-product-blocks.liquid, product-card-bundle.liquid, product-form.liquid … |
| `snippets/product-tags.liquid` | 1.6 | C | main-product-blocks.liquid |
| `snippets/product-thumbnail.liquid` | 5.8 | C | favorite-product-slider.liquid, product-media.liquid |
| `snippets/product-variant-options.liquid` | 13.2 | C | product-variant-picker.liquid |
| `snippets/product-variant-picker.liquid` | 5.5 | C | main-product-blocks.liquid, product-form.liquid |
| `snippets/quick-order-list-row.liquid` | 15.3 | C | quick-order-list.liquid |
| `snippets/sales-items.liquid` | 4.5 | B |  |
| `snippets/selected-tags-filter.liquid` | 1.4 | C | main-collection-product-grid.liquid |
| `snippets/shop-this-look.liquid` | 12.4 | C | lookbook.liquid |
| `snippets/sticky-atc.liquid` | 7.6 | C | main-product.liquid |
| `snippets/swatch-input.liquid` | 2.6 | C | product-variant-options.liquid |
| `snippets/testimonials-1.liquid` | 2.3 | C | testimonials.liquid |
| `snippets/testimonials-2.liquid` | 2.4 | C | testimonials.liquid |
| `snippets/testimonials-4.liquid` | 2.0 | C | testimonials.liquid |
| `snippets/testimonials-5.liquid` | 2.6 | C | testimonials.liquid |
| `snippets/testimonials-6.liquid` | 3.0 | C | testimonials.liquid |
| `snippets/testimonials-7.liquid` | 3.4 | C | testimonials.liquid |
| `snippets/testimonials-8.liquid` | 3.6 | C | testimonials.liquid |
| `snippets/text-with-review.liquid` | 1.3 | C | main-product-blocks.liquid |
| `snippets/theme-info.liquid` | 0.1 | B |  |
| `snippets/trustpilot.liquid` | 13.0 | C | main-product-blocks.liquid |
| `snippets/video-card.liquid` | 5.9 | C | custom-content.liquid |

## Previous store (Petlyra/DentaGuard) & one-offs — 91 files, 1827 KB

| file | KB | proof | referenced only by |
|---|---:|:-:|---|
| `assets/Copernicus.woff2` | 0.0 | B |  |
| `assets/CopernicusTrial-Medium.woff2` | 9.3 | B |  |
| `assets/banner-with-slider.css` | 3.3 | C | banner-with-slider.liquid |
| `assets/banner-with-slider.js` | 1.8 | C | banner-with-slider.liquid |
| `assets/compaign-v1.css` | 61.7 | B |  |
| `assets/compaign.css` | 140.5 | B |  |
| `assets/compaignv-v2.css` | 3.6 | B |  |
| `assets/custom-content.css` | 2.3 | C | custom-content.liquid |
| `assets/discovery_box_size_test.txt` | 0.1 | B |  |
| `assets/favorite-product-slider.css` | 1.7 | C | favorite-product-slider.liquid |
| `assets/favorite-product-slider.js` | 4.4 | C | favorite-product-slider.liquid |
| `assets/image-comparison.css` | 4.5 | C | custom-content.liquid, image-comparison.liquid |
| `assets/image-comparison.js` | 2.2 | C | custom-content.liquid, image-comparison.liquid |
| `assets/index.css` | 0.0 | B |  |
| `assets/instafee.css` | 6.6 | B |  |
| `assets/instafeed.js` | 5.3 | B |  |
| `assets/raqi-test-probe.txt` | 0.0 | B |  |
| `assets/scaling-logo.js` | 2.7 | C | scaling-logo.liquid |
| `sections/animated-heading.liquid` | 6.8 | C | product.gem-1769844747-template.json, product.gem-backup-default.json, product.matt.json … |
| `sections/as-seen-on.liquid` | 10.1 | C | product.bof.json, product.collagen-drops.json, product.collagen.json … |
| `sections/backgorund-images.liquid` | 15.7 | C | index.gem-1769844747-template.json, index.gem-1770999669-template.json, index.gem-backup-default.json … |
| `sections/banner-with-slider.liquid` | 52.2 | B |  |
| `sections/before-and-after.liquid` | 59.4 | C | product.collagen-drops.json, product.glove-2.json |
| `sections/comparison-2.liquid` | 25.5 | C | page.campaigns-dentaguard.json, product.bof.json, product.collagen-drops.json … |
| `sections/comparison-section.liquid` | 8.5 | C | product.bof.json, product.collagen-drops.json, product.collagen.json … |
| `sections/custom-content.liquid` | 166.6 | C | page.faqs.json, product.custom-layout-1.json, product.custom-layout-2.json … |
| `sections/custom-hero-section.liquid` | 18.4 | B |  |
| `sections/custom-slideshow.liquid` | 0.0 | B |  |
| `sections/custom-social-feeds.liquid` | 31.9 | B |  |
| `sections/directions-for-use.liquid` | 15.2 | C | product.collagen-drops.json |
| `sections/dog-weight.liquid` | 10.6 | C | page.campaigns-dentaguard.json, page.campaigns-petlyra.json |
| `sections/expert-testimonial.liquid` | 10.9 | C | product.bof.json, product.collagen-drops.json, product.collagen.json … |
| `sections/favorite-product-slider.liquid` | 17.1 | B |  |
| `sections/feature.liquid` | 11.8 | C | product.gem-1769844747-template.json, product.gem-backup-default.json, product.old-product-page.json |
| `sections/gif-section.liquid` | 5.2 | C | product.custom-layout-1.json, product.gem-1769844747-template.json, product.gem-backup-default.json … |
| `sections/hero-features.liquid` | 23.7 | C | page.campaigns-dentaguard.json, page.campaigns-petlyra.json |
| `sections/hero-section.liquid` | 48.2 | C | index.gem-1769844747-template.json, index.gem-1770999669-template.json, index.gem-backup-default.json … |
| `sections/image-comparison.liquid` | 11.7 | C | product.glove-2.json, product.grid-1-column.json |
| `sections/ingredients.liquid` | 9.7 | C | product.bof.json, product.collagen-drops.json, product.collagen.json … |
| `sections/instafeed-2.liquid` | 37.2 | C | product.gem-1769844747-template.json, product.gem-backup-default.json, product.old-product-page.json |
| `sections/new-featured-product.liquid` | 17.3 | B |  |
| `sections/offer-bar.liquid` | 1.3 | B |  |
| `sections/offer-hero-banner.liquid` | 4.2 | B |  |
| `sections/petlyra-footer.liquid` | 10.3 | C | product.collagen-drops.json, product.glove-2.json, product.matt.json |
| `sections/product-hover.liquid` | 32.1 | C | index.gem-1769844747-template.json, index.gem-1770999669-template.json, index.gem-backup-default.json … |
| `sections/product-reviews.liquid` | 2.0 | C | product.custom-layout-2.json, product.custom-layout-4.json, product.custom-layout-5.json |
| `sections/product-videos.liquid` | 41.9 | C | product.matt.json |
| `sections/questions-section.liquid` | 11.0 | C | page.campaigns-dentaguard.json, page.campaigns-petlyra.json |
| `sections/quiz-benefits.liquid` | 9.7 | C | product.bof.json, product.collagen-drops.json, product.collagen.json … |
| `sections/quiz-cta.liquid` | 12.5 | C | product.bof.json, product.collagen-drops.json, product.collagen.json … |
| `sections/quiz-expert.liquid` | 13.8 | C | product.bof.json, product.collagen-drops.json, product.collagen.json … |
| `sections/quiz-footer.liquid` | 9.5 | C | product.bof.json, product.collagen-drops.json, product.collagen.json … |
| `sections/quiz-quility.liquid` | 8.0 | C | product.bof.json, product.collagen-drops.json, product.collagen.json … |
| `sections/quiz-reviews.liquid` | 15.8 | C | product.bof.json, product.collagen-drops.json, product.collagen.json … |
| `sections/quiz-routine.liquid` | 10.3 | C | product.bof.json, product.collagen-drops.json, product.collagen.json … |
| `sections/raqi-ingredients.liquid` | 3.5 | B |  |
| `sections/reviews-heading.liquid` | 4.6 | C | product.bof.json, product.collagen-drops.json, product.collagen.json … |
| `sections/reviews.liquid` | 8.9 | B |  |
| `sections/scaling-logo.liquid` | 6.6 | B |  |
| `sections/signs.liquid` | 8.4 | B |  |
| `sections/simple-image-2.liquid` | 4.9 | C | product.gem-1769844747-template.json, product.gem-backup-default.json, product.old-product-page.json |
| `sections/simple-image.liquid` | 9.4 | C | product.custom-layout-1.json, product.gem-1769844747-template.json, product.gem-backup-default.json … |
| `sections/sliding-headings.liquid` | 9.9 | C | index.gem-1769844747-template.json, index.gem-1770999669-template.json, index.gem-backup-default.json … |
| `sections/social-feeds.liquid` | 34.0 | C | index.gem-1769844747-template.json, index.gem-1770999669-template.json, index.gem-backup-default.json … |
| `sections/ss-ingrdients.liquid` | 48.4 | C | product.gem-1769844747-template.json, product.gem-backup-default.json, product.old-product-page.json |
| `sections/ss-simple-faq.liquid` | 6.1 | C | product.matt.json |
| `sections/stats-block.liquid` | 28.0 | C | product.bof.json, product.collagen-drops.json, product.collagen.json … |
| `sections/sticky-navigation-bar.liquid` | 16.1 | C | page.campaigns-dentaguard.json, page.campaigns-petlyra.json |
| `sections/study-section.liquid` | 15.3 | C | page.campaigns-dentaguard.json, page.campaigns-petlyra.json |
| `sections/testimonials-3.liquid` | 73.6 | C | index.gem-1769844747-template.json, index.gem-1770999669-template.json, index.gem-backup-default.json … |
| `sections/try.liquid` | 17.7 | C | product.bof.json, product.collagen-drops.json, product.collagen.json … |
| `sections/two-step.liquid` | 13.0 | C | product.bof.json, product.collagen-drops.json, product.collagen.json … |
| `sections/usp-section.liquid` | 15.5 | C | product.custom-layout-1.json |
| `sections/video-hero.liquid` | 15.6 | B |  |
| `sections/videos.liquid` | 7.9 | B |  |
| `sections/what-makes.liquid` | 11.6 | C | product.collagen-drops.json |
| `sections/what-sign.liquid` | 16.0 | C | page.campaigns-dentaguard.json, page.campaigns-petlyra.json |
| `snippets/ar-upload-probe.liquid` | 0.0 | B |  |
| `snippets/product-reviews-app__snippet.liquid` | 5.0 | C | product-details-tabs.liquid, product-reviews.liquid |
| `snippets/raqi-ingredients.liquid` | 3.1 | B |  |
| `snippets/testimonials-3.liquid` | 2.5 | C | testimonials.liquid |
| `templates/collection.custom-content-banner.json` | 5.7 | A |  |
| `templates/page.campaigns-dentaguard.json` | 17.6 | A |  |
| `templates/page.campaigns-petlyra.json` | 16.7 | A |  |
| `templates/product.bof.json` | 45.2 | A |  |
| `templates/product.collagen-drops.json` | 54.6 | A |  |
| `templates/product.collagen.json` | 43.0 | A |  |
| `templates/product.glove-2.json` | 44.6 | A |  |
| `templates/product.glove.json` | 43.4 | A |  |
| `templates/product.magic-brush.json` | 43.4 | A |  |
| `templates/product.matt.json` | 81.3 | A |  |

## GemPages (gp-/gem-) — 55 files, 2293 KB

| file | KB | proof | referenced only by |
|---|---:|:-:|---|
| `assets/gp-global.css` | 68.0 | C | gp-head.liquid |
| `layout/theme.gem-layout-none.liquid` | 6.8 | B |  |
| `sections/gp-section-604508780276744879.liquid` | 144.1 | C | page.gp-template-604508745682125793.json |
| `sections/gp-section-604539707010843617.liquid` | 55.8 | B |  |
| `sections/gp-section-604539707581268797.liquid` | 46.1 | B |  |
| `sections/gp-section-604539707866481323.liquid` | 29.3 | B |  |
| `sections/gp-section-604539707866481469.liquid` | 6.4 | B |  |
| `sections/gp-section-604539707883258539.liquid` | 41.5 | B |  |
| `sections/gp-section-604539707967144765.liquid` | 18.5 | B |  |
| `sections/gp-section-604539708269134817.liquid` | 32.9 | B |  |
| `sections/gp-section-604539708285912033.liquid` | 63.3 | B |  |
| `sections/gp-section-604539708403352545.liquid` | 33.0 | B |  |
| `sections/gp-section-604539708436906671.liquid` | 67.9 | B |  |
| `sections/gp-section-604539708436972207.liquid` | 89.8 | B |  |
| `sections/gp-section-604539708722119339.liquid` | 109.6 | B |  |
| `sections/gp-section-604539708755673771.liquid` | 196.4 | B |  |
| `sections/gp-section-604539708957000509.liquid` | 133.7 | B |  |
| `sections/gp-section-604539710131405793.liquid` | 64.7 | B |  |
| `sections/gp-section-604660734659396413.liquid` | 14.5 | B |  |
| `sections/gp-section-604661448378942269.liquid` | 14.5 | B |  |
| `sections/gp-section-604661448379007805.liquid` | 14.5 | B |  |
| `sections/gp-section-604661465491702443.liquid` | 18.0 | B |  |
| `sections/gp-section-604661465508479805.liquid` | 15.1 | B |  |
| `sections/gp-section-604663387489567549.liquid` | 6.7 | B |  |
| `sections/gp-section-604684347668169387.liquid` | 14.3 | B |  |
| `sections/gp-section-604684840884765665.liquid` | 18.6 | B |  |
| `sections/gp-section-604711426933654191.liquid` | 20.1 | B |  |
| `sections/gp-section-604712757148779179.liquid` | 82.8 | B |  |
| `sections/gp-section-604713087089509039.liquid` | 14.2 | B |  |
| `sections/gp-section-604715600987554479.liquid` | 91.9 | B |  |
| `sections/gp-section-604716651291607723.liquid` | 91.7 | B |  |
| `sections/gp-section-604717759376393021.liquid` | 13.9 | B |  |
| `sections/gp-section-604722904462000811.liquid` | 15.8 | C | page.gp-template-604508745682125793.json |
| `sections/gp-section-604722904462001121.liquid` | 14.4 | B |  |
| `sections/gp-section-604728122109068093.liquid` | 15.0 | B |  |
| `sections/gp-variant-selected.liquid` | 0.9 | B |  |
| `snippets/gp-head.liquid` | 1.8 | B |  |
| `snippets/gp-section-604508780276744879-0.liquid` | 27.7 | B |  |
| `snippets/gp-section-604508780276744879-1.liquid` | 6.6 | B |  |
| `snippets/gp-section-604539708722119339-0.liquid` | 163.9 | C | gp-section-604539708722119339.liquid |
| `snippets/gp-section-604539708755673771-0.liquid` | 58.9 | C | gp-section-604539708755673771.liquid |
| `snippets/gp-section-604539708755673771-1.liquid` | 58.9 | C | gp-section-604539708755673771.liquid |
| `templates/collection.gem-1769844748-template.json` | 3.0 | A |  |
| `templates/collection.gem-1770999672-template.json` | 3.0 | A |  |
| `templates/collection.gem-backup-default.json` | 3.0 | A |  |
| `templates/collection.gp-template-bk-default.json` | 3.4 | A |  |
| `templates/index.gem-1769844747-template.json` | 26.0 | A |  |
| `templates/index.gem-1770999669-template.json` | 26.1 | A |  |
| `templates/index.gem-backup-default.json` | 26.0 | A |  |
| `templates/index.gp-template-bk-default.json` | 26.2 | A |  |
| `templates/page.gp-template-604508745682125793.json` | 23.2 | A |  |
| `templates/product.gem-1769844747-template.json` | 32.5 | A |  |
| `templates/product.gem-1770999671-template.json` | 42.9 | A |  |
| `templates/product.gem-backup-default.json` | 32.5 | A |  |
| `templates/product.gp-template-bk-default.json` | 42.9 | A |  |

## Unused alternate templates — 30 files, 215 KB

| file | KB | proof | referenced only by |
|---|---:|:-:|---|
| `templates/collection.canvas-sidebar.json` | 3.1 | A |  |
| `templates/collection.filter-by-tags.json` | 5.7 | A |  |
| `templates/collection.filter-left-sidebar.json` | 3.1 | A |  |
| `templates/collection.filter-right-sidebar.json` | 3.0 | A |  |
| `templates/collection.flash-sale.json` | 0.8 | A |  |
| `templates/collection.full-width.json` | 3.0 | A |  |
| `templates/collection.grid-2-columns.json` | 3.1 | A |  |
| `templates/collection.grid-3-columns.json` | 3.1 | A |  |
| `templates/collection.grid-4-columns.json` | 3.1 | A |  |
| `templates/collection.grid-5-columns.json` | 3.1 | A |  |
| `templates/collection.hidden-sidebar.json` | 3.1 | A |  |
| `templates/collection.infinite-scroll.json` | 3.1 | A |  |
| `templates/collection.load-more-button.json` | 3.0 | A |  |
| `templates/collection.view-list.json` | 3.1 | A |  |
| `templates/page.faqs.json` | 4.7 | A |  |
| `templates/page.find-a-store.json` | 14.3 | A |  |
| `templates/page.product-compare.json` | 0.1 | A |  |
| `templates/page.wishlist.json` | 0.1 | A |  |
| `templates/product.compare.liquid` | 5.4 | A |  |
| `templates/product.custom-layout-1.json` | 20.9 | A |  |
| `templates/product.custom-layout-2.json` | 12.7 | A |  |
| `templates/product.custom-layout-3.json` | 13.9 | A |  |
| `templates/product.custom-layout-4.json` | 10.3 | A |  |
| `templates/product.custom-layout-5.json` | 10.5 | A |  |
| `templates/product.grid-1-column.json` | 16.7 | A |  |
| `templates/product.grid-2-columns.json` | 9.6 | A |  |
| `templates/product.grid-card-item.liquid` | 0.5 | A |  |
| `templates/product.grid-mix-columns.json` | 12.3 | A |  |
| `templates/product.old-product-page.json` | 38.0 | A |  |
| `templates/search.foxkit.liquid` | 2.0 | A |  |

## Minimog header (replaced by rd-header) — 15 files, 147 KB

| file | KB | proof | referenced only by |
|---|---:|:-:|---|
| `assets/header.css` | 19.7 | C | header.liquid |
| `assets/header.js` | 3.4 | C | header.liquid |
| `assets/mega-menu.js` | 11.8 | C | header.liquid |
| `sections/header.liquid` | 43.1 | B |  |
| `snippets/header-logo.liquid` | 3.4 | C | header.liquid, search-popup.liquid |
| `snippets/header-main-menu-container.liquid` | 20.3 | C | header.liquid |
| `snippets/header-menu-drawer.liquid` | 19.7 | C | header.liquid |
| `snippets/header-option-item__account.liquid` | 1.4 | C | header.liquid, search-popup.liquid |
| `snippets/header-option-item__compare.liquid` | 2.1 | C | header.liquid, search-popup.liquid |
| `snippets/header-option-item__search.liquid` | 2.7 | C | header.liquid |
| `snippets/header-option-item__wishlist.liquid` | 2.6 | C | header.liquid, search-popup.liquid |
| `snippets/header__topbar.liquid` | 5.1 | C | header.liquid |
| `snippets/mega-menu-customer.liquid` | 2.1 | C | header-menu-drawer.liquid |
| `snippets/mega-menu-link.liquid` | 1.7 | C | header-menu-drawer.liquid |
| `snippets/search-popup.liquid` | 7.8 | C | header.liquid |

## Superseded raqi-* (RAQI v1) — 12 files, 9 KB

| file | KB | proof | referenced only by |
|---|---:|:-:|---|
| `assets/raqi-catalog-product.css` | 0.1 | B |  |
| `assets/raqi-theme-footer-home.css` | 0.3 | B |  |
| `assets/raqi-theme-logo-fix.css` | 0.1 | B |  |
| `assets/raqi-theme-overrides.css` | 0.1 | B |  |
| `sections/raqi-best-picks.liquid` | 0.1 | B |  |
| `sections/raqi-explore-taste.liquid` | 0.6 | B |  |
| `sections/raqi-gender-tabs.liquid` | 0.1 | B |  |
| `sections/raqi-hero.liquid` | 5.3 | B |  |
| `sections/raqi-page-heading.liquid` | 1.2 | B |  |
| `sections/raqi-size-guide.liquid` | 0.1 | B |  |
| `sections/raqi-trust-row.liquid` | 0.1 | B |  |
| `snippets/raqi-db-summary-fix.liquid` | 0.4 | B |  |

## Keep (reachable) — for reference

Sections: 404-template.liquid, age-verifier-popup.liquid, article.liquid, blog-template.liquid, cart-template.liquid, footer-group.json, footer.liquid, header-group.json, main-account.liquid, main-activate-account.liquid, main-addresses.liquid, main-login.liquid, main-order.liquid, main-register.liquid, main-reset-password.liquid, mobile-sticky-bar.liquid, page-search.liquid, page.liquid, password-template.liquid, petlyra-policy.liquid, raqi-about.liquid, raqi-contact.liquid, raqi-discovery-box.liquid, raqi-product.liquid, raqi-related.liquid, raqi-selected.liquid, raqi-story-sizes.liquid, rd-announcement.liquid, rd-brands-index.liquid, rd-cart-drawer.liquid, rd-collection.liquid, rd-discovery.liquid, rd-faq.liquid, rd-header.liquid, rd-hero.liquid, rd-profiles.liquid, rd-steps.liquid, rd-ticker.liquid, rd-trust.liquid, rd-why.liquid, recent-viewed-products.liquid

Snippets: article-card.liquid, blog-sidebar.liquid, breadcrumb.liquid, cart-addons.liquid, cart-discount-item.liquid, cart-drawer-item.liquid, cart-drawer.liquid, cart.liquid, collection-filters-facets.liquid, collection-page-toolbar.liquid, cookie-banner.liquid, countdown-timer.liquid, country-selector.liquid, critical-css.liquid, currency-switcher.liquid, custom-code-body.liquid, custom-code-head.liquid, customer-challenge-style.liquid, customer-navs.liquid, customer-orders.liquid, font-face.liquid, footer-block__html.liquid, footer-block__text.liquid, footer-blocks.liquid, footer-design.liquid, form__error.liquid, form__success.liquid, foxkit-preorder-badge.liquid, get_swatch_texture.liquid, icon.liquid, language-switcher.liquid, mm-judgeme-widgets.liquid, mm-ssw-widget-faveicon.liquid, new-locale.liquid, newsletter-form.liquid, other-review-app-snippet.liquid, page-title.liquid, page-transition.liquid, pagination.liquid, payment-icons.liquid, product-card-1.liquid, product-card-2.liquid, product-card-3.liquid, product-card-4.liquid, product-card-5.liquid, product-card-option.liquid, product-card-quick-add-btn.liquid, product-prices.liquid, product-reviews-app__badge.liquid, raqi-delivery-line.liquid, raqi-free-shipping-bar.liquid, raqi-language-switcher.liquid, raqi-product-card.liquid, raqi-structured-data.liquid, raqi-whatsapp-float.liquid, rd-fonts.liquid, rd-product-card.liquid, responsive-image.liquid, script-tags.liquid, scroll-top-button.liquid, slider-controls.liquid, social-media-links.liquid, social-meta-tags.liquid, social-sharing.liquid, sort-by-mobile.liquid, storefront-filters.liquid, style-tags.liquid, theme-data.liquid, tooltip.liquid

Assets: about-us.css, age-verifier.css, age-verifier.js, animations.js, ar-down.svg, arrow-down-white.svg, arrow-down.svg, article.css, blog-sidebar.css, blog.css, cart.css, cart.js, collection.css, collection.js, component-article-card.css, component-countdown-timer.css, component-newsletter.css, component-product-bundles.css, component-product-inventory.css, component-quantity-popover.css, component-volume-pricing.css, cookie-banner.css, countdown-timer.js, custom-style.css, custom.css, customer.css, customer.js, facet-remove.js, filter_color1.png, filter_color2.png, footer.css, footer.js, gift-wrapping.css, gift-wrapping.js, giftcard.css, localization-form.js, main.css, mobile-sticky-bar.css, password.css, predictive-search.js, price-range.js, product-card-swatch.js, product-info.js, product-list.js, product-media.js, product-model.js, product-quick-view.js, product.css, quantity-popover.js, raqi-redesign.css, raqi-theme.css, recently-viewed-products.js, rtl.css, storefont-filters.js, theme-editor.js, theme-global.js, tpo-integration.css, variant-picker.js, vendor.css, vendor.js
