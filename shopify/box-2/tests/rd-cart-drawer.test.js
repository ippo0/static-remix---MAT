// Real Chromium DOM; Shopify cart + Section Rendering API mocked in-page.
const { chromium } = require('playwright');
const fs = require('fs');
const script = fs.readFileSync('fix/drawer.js', 'utf8');
const SID = 'sections--77__rd_cart_drawer';

// Mirrors the Liquid in rd-cart-drawer.liquid closely enough to exercise the JS.
const renderInner = (cart) => {
  const count = cart.items.reduce((n, i) => n + i.quantity, 0);
  const total = cart.items.reduce((n, i) => n + i.price * i.quantity, 0);
  const money = (c) => 'Dhs. ' + (c / 100).toFixed(2);
  let body;
  if (count === 0) body = `<div class="rd-cd__empty"><p class="rd-cd__emptyline">Nothing in your bag yet.</p></div>`;
  else body = `<ul class="rd-cd__items">${cart.items.map(i => `
      <li class="rd-cd__item"><span class="rd-cd__name">${i.title}</span> <span class="rd-cd__var">Qty ${i.quantity}</span>
      <span class="rd-cd__price">${money(i.price * i.quantity)}</span>
      <button class="rd-cd__rm" type="button" data-rd-cd-remove="${i.key}">Remove</button></li>`).join('')}</ul>
      <div class="rd-cd__foot"><span class="rd-cd__subval">${money(total)}</span></div>`;
  return `<span hidden data-rd-cd-count>${count}</span><header class="rd-cd__head"><h2>Your bag</h2><button class="rd-cd__x" data-rd-cd-close>×</button></header>${body}`;
};

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await browser.newPage(); page.setDefaultTimeout(4000);
  const log = [];
  page.on('console', m => { if (!m.text().startsWith('PASS') && !m.text().startsWith('FAIL')) log.push(m.text()); });

  // server state
  let cart = { items: [
    { key: 'k1:aaa', title: 'RAQI Discovery Box', price: 59900, quantity: 1 },
    { key: 'k2:bbb', title: 'Creed Aventus 10ml', price: 15000, quantity: 2 },
  ]};
  const calls = [];
  await page.route('**/cart/change', async (route) => {
    const body = JSON.parse(route.request().postData());
    calls.push(body);
    cart.items = cart.items.map(i => i.key === body.id ? { ...i, quantity: body.quantity } : i).filter(i => i.quantity > 0);
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(cart) });
  });
  await page.route('**/?sections=*', async (route) => {
    const url = new URL(route.request().url());
    const id = url.searchParams.get('sections');
    const json = {}; json[id] = id === SID ? `<div id="shopify-section-${SID}" class="shopify-section"><div class="rd-scope"><div class="rd-cd" id="rd-cart-drawer" data-rd-cd hidden><div data-rd-cd-inner>${renderInner(cart)}</div></div></div></div>` : null;
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(json) });
  });

  const html = `<!doctype html><html><head><style>.rd-cd[hidden]{display:none}</style></head><body>
    <a data-rd-bag>Bag (<span data-rd-bagcount>3</span>)</a>
    <div class="rd-scope"><div class="rd-cd" id="rd-cart-drawer" data-rd-cd hidden>
      <button class="rd-cd__scrim" data-rd-cd-close></button>
      <aside class="rd-cd__panel"><div data-rd-cd-inner>${renderInner(cart)}</div></aside>
    </div></div>
    <script>${script}</script></body></html>`;
  await page.route('http://raqi.test/', r => r.fulfill({ status: 200, contentType: 'text/html', body: html }));
  await page.goto('http://raqi.test/', { waitUntil: 'load' });

  const state = async () => page.evaluate(() => ({
    hidden: document.getElementById('rd-cart-drawer').hidden,
    items: [...document.querySelectorAll('.rd-cd__item .rd-cd__name')].map(e => e.textContent),
    subtotal: document.querySelector('.rd-cd__subval')?.textContent ?? null,
    empty: !!document.querySelector('.rd-cd__empty'),
    bag: document.querySelector('[data-rd-bagcount]').textContent,
    RDCart: typeof window.RDCart,
  }));
  const results = [];
  const check = (name, cond) => { const l = `${cond ? 'PASS' : 'FAIL'}  ${name}`; results.push(l); console.log(l); };

  let s = await state();
  check('script initialised (window.RDCart present)', s.RDCart === 'object');
  check('drawer starts closed', s.hidden === true);

  // Scenario A: Add to Bag → cart:refresh opens drawer immediately, then refreshes
  await page.evaluate(() => document.dispatchEvent(new CustomEvent('cart:refresh', { detail: { open: true } })));
  s = await state();
  check('cart:refresh opens the drawer synchronously', s.hidden === false);
  await page.waitForTimeout(150); s = await state();
  check('refresh used the correct section id and re-rendered (2 items, Dhs. 899.00)', s.items.length === 2 && s.subtotal === 'Dhs. 899.00');

  // Scenario B: remove one of two → remaining item + new subtotal
  await page.click('[data-rd-cd-remove="k1:aaa"]');
  await page.waitForTimeout(150); s = await state();
  check('POST /cart/change sent {id: key, quantity: 0}', calls.length === 1 && calls[0].id === 'k1:aaa' && calls[0].quantity === 0);
  check('drawer shows the remaining item only', s.items.length === 1 && s.items[0] === 'Creed Aventus 10ml');
  check('subtotal updated to Dhs. 300.00', s.subtotal === 'Dhs. 300.00');
  check('header bag count updated to 2', s.bag === '2');
  check('drawer stayed open', s.hidden === false);

  // Scenario C: remove the only remaining item → empty state
  await page.click('[data-rd-cd-remove="k2:bbb"]');
  await page.waitForTimeout(150); s = await state();
  check('second removal sent for the right key', calls.length === 2 && calls[1].id === 'k2:bbb');
  check('drawer shows the empty state', s.empty && s.items.length === 0);
  check('header bag count is 0', s.bag === '0');

  // Scenario D: double-tap protection + server error path
  cart.items = [{ key: 'k3:ccc', title: 'Xerjoff Torino 21', price: 20000, quantity: 1 }];
  await page.evaluate(() => window.RDCart.refresh()); await page.waitForTimeout(100);
  await page.unroute('**/cart/change');
  await page.route('**/cart/change', r => r.fulfill({ status: 422, contentType: 'application/json', body: JSON.stringify({ description: 'Cart Error' }) }));
  await page.click('[data-rd-cd-remove="k3:ccc"]'); await page.waitForTimeout(150); s = await state();
  check('on a 422 the drawer re-renders the server truth (item still there) instead of hanging', s.items.length === 1);
  check('failure is logged as a warning, not thrown', log.some(l => l.includes('[rd-cart-drawer] change failed')));

  // Scenario E: close controls
  await page.click('[data-rd-cd-close]'); s = await state();
  check('close button hides the drawer', s.hidden === true);

  console.log(`\n${results.filter(r => r.startsWith('PASS')).length}/${results.length} passed`);
  await browser.close();
  process.exit(results.some(r => r.startsWith('FAIL')) ? 1 : 0);
})();
