const { chromium } = require('playwright');
const fs = require('fs');
let pass = 0, fail = 0;
const check = (n,c,x) => c ? (console.log('  PASS  '+n), pass++) : (console.log('  FAIL  '+n+(x?'  -> '+x:'')), fail++);

const drawerJs = fs.readFileSync('new.js','utf8');   // the fixed drawer
const bagJs    = fs.readFileSync('bag.js','utf8');

function page(withDrawer) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    .rd-cd[hidden]{display:none}
    .rd-cd{position:fixed;inset:0}
    .rd-cd__panel{position:absolute;inset-block:0;inset-inline-end:0;width:380px;background:#F3F4EE}
  </style></head><body>
  <a class="rd-header__bag" href="/cart" data-rd-bag>Bag (<span data-rd-bagcount>3</span>)</a>
  ${withDrawer ? `<div class="rd-cd" id="rd-cart-drawer" data-rd-cd hidden>
    <aside class="rd-cd__panel"><div data-rd-cd-inner>
      <span hidden data-rd-cd-count>3</span>
      <button class="rd-cd__x" data-rd-cd-close>&times;</button>
      <ul class="rd-cd__items"><li class="rd-cd__item" data-rd-cd-qty="1">
        <span class="rd-cd__meta"><button class="rd-cd__rm" data-rd-cd-remove="k1">Remove</button></span>
      </li></ul>
    </div></aside></div>` : ''}
  <script>
    window.__navigated = null;
    window.__LAT = 0;
    window.fetch = function(u){ return Promise.resolve({ ok:true, json:()=>Promise.resolve({}) }); };
  <\/script>
  <script>${drawerJs}<\/script>
  <script>${bagJs}<\/script>
  </body></html>`;
}

(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });

  console.log('\n1. Bag link opens the drawer instead of navigating');
  {
    const p = await b.newPage();
    const errs = []; p.on('pageerror', e => errs.push(String(e)));
    let navigated = false;
    p.on('framenavigated', f => { if (f.url().includes('/cart')) navigated = true; });
    await p.setContent(page(true));
    check('drawer starts hidden', await p.locator('#rd-cart-drawer').evaluate(el => el.hasAttribute('hidden')));
    await p.click('[data-rd-bag]');
    await p.waitForTimeout(250);
    check('drawer is open after tapping Bag',
      await p.locator('#rd-cart-drawer').evaluate(el => !el.hasAttribute('hidden')));
    check('did NOT navigate to /cart', !navigated);
    check('no JS errors', errs.length === 0, errs.join('; '));
    await p.close();
  }

  console.log('\n2. Fallback: no drawer markup on the page -> the href is left alone');
  {
    const p = await b.newPage();
    await p.setContent(page(false));
    const defaultPrevented = await p.evaluate(() => {
      const a = document.querySelector('[data-rd-bag]');
      const ev = new MouseEvent('click', { bubbles: true, cancelable: true });
      a.dispatchEvent(ev);
      return ev.defaultPrevented;
    });
    check('click not intercepted, browser follows /cart', defaultPrevented === false);
    await p.close();
  }

  console.log('\n3. Modified clicks keep native behaviour (open in new tab)');
  {
    const p = await b.newPage();
    await p.setContent(page(true));
    const r = await p.evaluate(() => {
      const a = document.querySelector('[data-rd-bag]');
      const ev = new MouseEvent('click', { bubbles: true, cancelable: true, metaKey: true });
      a.dispatchEvent(ev);
      return { prevented: ev.defaultPrevented, open: !document.getElementById('rd-cart-drawer').hasAttribute('hidden') };
    });
    check('cmd/ctrl-click not intercepted', r.prevented === false);
    check('drawer not opened by a modified click', r.open === false);
    await p.close();
  }

  console.log('\n4. The drawer still opens for Add to Bag (unchanged path)');
  {
    const p = await b.newPage();
    await p.setContent(page(true));
    await p.evaluate(() => document.dispatchEvent(new CustomEvent('cart:refresh', { detail: { open: true } })));
    await p.waitForTimeout(150);
    check('cart:refresh still opens the drawer',
      await p.locator('#rd-cart-drawer').evaluate(el => !el.hasAttribute('hidden')));
    await p.close();
  }

  console.log('\n' + '='.repeat(46));
  console.log(`${pass} passed, ${fail} failed`);
  await b.close();
  process.exit(fail ? 1 : 0);
})();
