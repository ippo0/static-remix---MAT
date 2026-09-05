// Builds the drawer DOM exactly as the Liquid renders it, mocks the two
// Shopify endpoints with a configurable per-request latency, and measures the
// wall-clock gap between tapping Remove and the row leaving the layout.
const fs = require('fs');

function itemHTML(l) {
  return `<li class="rd-cd__item"${l.qtyAttr ? ` data-rd-cd-qty="${l.qty}"` : ''}>
  <span class="rd-cd__media"><img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="${l.title}" width="120" height="120" loading="lazy"></span>
  <span class="rd-cd__meta">
    <span class="rd-cd__brand">${l.vendor}</span>
    <span class="rd-cd__name">${l.name}</span>
    <span class="rd-cd__var">${l.variant} &middot; Qty ${l.qty}</span>
    <span class="rd-cd__price">${l.price}</span>
    <button class="rd-cd__rm" type="button" data-rd-cd-remove="${l.key}" aria-label="Remove ${l.title}">Remove</button>
  </span>
</li>`;
}

function innerHTML(lines, qtyAttr) {
  const count = lines.reduce((a, l) => a + l.qty, 0);
  if (!lines.length) {
    return `<span hidden data-rd-cd-count>0</span>
<header class="rd-cd__head"><h2 class="rd-cd__h2" id="rd-cd-h">Your bag</h2>
<button class="rd-cd__x" type="button" data-rd-cd-close aria-label="Close">&times;</button></header>
<div class="rd-cd__empty"><p class="rd-cd__emptyline">Nothing in your bag yet.</p>
<a class="rd-cd__cont" href="/collections/all">Browse fragrances</a></div>`;
  }
  return `<span hidden data-rd-cd-count>${count}</span>
<header class="rd-cd__head"><h2 class="rd-cd__h2" id="rd-cd-h">Your bag</h2>
<button class="rd-cd__x" type="button" data-rd-cd-close aria-label="Close">&times;</button></header>
<ul class="rd-cd__items" role="list">${lines.map(l => itemHTML({ ...l, qtyAttr })).join('')}</ul>
<div class="rd-cd__foot">
  <div class="rd-cd__sub"><span class="rd-cd__sublabel">Subtotal</span><span class="rd-cd__subval">Dhs. ${lines.reduce((a,l)=>a+l.amount,0)}.00</span></div>
  <p class="rd-cd__note">Shipping and taxes calculated at checkout.</p>
  <form action="/cart" method="post"><button class="rd-cd__checkout" type="submit" name="checkout">Checkout</button></form>
</div>`;
}

const LINES = [
  { key: 'k1', vendor: 'Creed',   name: 'Aventus',       title: 'Creed Aventus',   variant: '10ml', qty: 1, amount: 240, price: 'Dhs. 240.00' },
  { key: 'k2', vendor: 'Kilian',  name: "Angels' Share", title: "Kilian Angels' Share", variant: '10ml', qty: 2, amount: 410, price: 'Dhs. 410.00' },
  { key: 'k3', vendor: 'Amouage', name: 'Reflection Man',title: 'Amouage Reflection Man', variant: '30ml', qty: 1, amount: 520, price: 'Dhs. 520.00' },
];

function page(js, css, qtyAttr) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
:root{--rd-bone:#F3F4EE;--rd-wine:#7B4A56;--rd-ink:#22261F;--rd-panel:#E8EBE2;--rd-rule:#C7CCBE;--rd-body:sans-serif;}
body{margin:0;font-family:sans-serif;background:var(--rd-bone);}
.rd-cd[hidden]{display:none;}
.rd-cd{position:fixed;inset:0;z-index:100;}
.rd-cd__panel{position:absolute;inset-block:0;inset-inline-end:0;inline-size:380px;background:var(--rd-bone);overflow:auto;}
.rd-cd__item{display:flex;gap:12px;padding:14px 16px;border-bottom:1px solid var(--rd-rule);}
.rd-cd__media img{width:60px;height:60px;object-fit:cover;background:var(--rd-panel);}
.rd-cd__meta{display:flex;flex-direction:column;gap:2px;}
.rd-cd__rm{background:none;border:none;color:var(--rd-wine);text-decoration:underline;cursor:pointer;padding:0;text-align:start;}
.rd-cd__foot{padding:16px;}
${css}
</style></head><body>
<span data-rd-bagcount>4</span>
<div class="rd-scope"><div class="rd-cd" id="rd-cart-drawer" data-rd-cd>
  <button class="rd-cd__scrim" type="button" data-rd-cd-close tabindex="-1" aria-label="Close"></button>
  <aside class="rd-cd__panel" role="dialog" aria-modal="true" aria-labelledby="rd-cd-h">
    <div data-rd-cd-inner>${innerHTML(LINES, qtyAttr)}</div>
  </aside>
</div></div>
<script>
// ---- mocked Shopify endpoints -------------------------------------------
window.__LAT = 0;
window.__cart = ${JSON.stringify(LINES)};
window.__qtyAttr = ${qtyAttr};
window.__calls = [];
window.__FAIL = false;      // when true, /cart/change.js answers 422 and the cart is untouched
const itemHTML = ${itemHTML.toString()};
const innerHTML = ${innerHTML.toString()};
function wait(ms){ return new Promise(r => setTimeout(r, ms)); }
window.fetch = function (url, opts) {
  const started = performance.now();
  window.__calls.push({ url: String(url), t: started });
  return wait(window.__LAT).then(function () {
    if (String(url).indexOf('/cart/change.js') === 0) {
      if (window.__FAIL) {
        return { ok: false, status: 422, json: () => Promise.resolve({ description: 'Cart error' }) };
      }
      const body = JSON.parse(opts.body);
      if (body.quantity === 0) window.__cart = window.__cart.filter(l => l.key !== body.id);
      const count = window.__cart.reduce((a,l)=>a+l.qty,0);
      return { ok: true, json: () => Promise.resolve({ item_count: count, items: window.__cart }) };
    }
    if (String(url).indexOf('sections=') > -1) {
      const html = '<div class="rd-scope"><div class="rd-cd" id="rd-cart-drawer" data-rd-cd><aside class="rd-cd__panel"><div data-rd-cd-inner>'
        + innerHTML(window.__cart, window.__qtyAttr) + '</div></aside></div></div>';
      return { ok: true, json: () => Promise.resolve({ 'sections--123__rd_cart_drawer': html }) };
    }
    return { ok: true, json: () => Promise.resolve({}) };
  });
};
<\/script>
<script>${js}<\/script>
</body></html>`;
}

module.exports = { page, LINES };
