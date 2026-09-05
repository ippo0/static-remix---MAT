const { chromium } = require('playwright');
const fs = require('fs');
const { page } = require('./harness.js');

let pass = 0, fail = 0;
const check = (n, c, x) => c ? (console.log('  PASS  ' + n), pass++)
                             : (console.log('  FAIL  ' + n + (x ? '  -> ' + x : '')), fail++);

const HTML = page(fs.readFileSync('new.js','utf8'), fs.readFileSync('new.css','utf8'), true);

async function fresh(browser, lat) {
  const p = await browser.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push(String(e)));
  await p.setContent(HTML);
  await p.evaluate(l => { window.__LAT = l; }, lat);
  p.__errs = errs;
  return p;
}

(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });

  console.log('\n1. Optimistic removal is immediate, and reconciles with the server');
  {
    const p = await fresh(b, 400);
    await p.click('[data-rd-cd-remove="k2"]');
    await p.waitForTimeout(60);
    check('row is collapsing before either request returns',
      await p.locator('[data-rd-cd-remove="k2"]').count() === 1
      && await p.locator('.rd-cd__item[data-rd-cd-removing]').count() === 1);
    check('bag count already updated (4 -> 2)',
      (await p.locator('[data-rd-bagcount]').innerText()).trim() === '2');
    check('subtotal marked pending', await p.locator('[data-rd-cd-inner][data-rd-cd-pending]').count() === 1);
    await p.waitForTimeout(1200);
    check('after reconcile the row is gone from the DOM', await p.locator('[data-rd-cd-remove="k2"]').count() === 0);
    check('other two rows survive', await p.locator('.rd-cd__item').count() === 2);
    check('pending state cleared', await p.locator('[data-rd-cd-inner][data-rd-cd-pending]').count() === 0);
    check('subtotal is the server figure', (await p.locator('.rd-cd__subval').innerText()).includes('760'),
      await p.locator('.rd-cd__subval').innerText());
    check('no JS errors', p.__errs.length === 0, p.__errs.join('; '));
    await p.close();
  }

  console.log('\n2. Checkout is blocked while the total is stale');
  {
    const p = await fresh(b, 600);
    await p.click('[data-rd-cd-remove="k1"]');
    await p.waitForTimeout(80);
    const pe = await p.locator('.rd-cd__checkout').evaluate(el => getComputedStyle(el).pointerEvents);
    check('checkout not clickable mid-removal', pe === 'none', 'pointer-events=' + pe);
    await p.waitForTimeout(1500);
    const pe2 = await p.locator('.rd-cd__checkout').evaluate(el => getComputedStyle(el).pointerEvents);
    check('checkout usable again once reconciled', pe2 !== 'none');
    await p.close();
  }

  console.log('\n3. A FAILED removal puts the row back (optimism is not a lie)');
  {
    const p = await fresh(b, 200);
    await p.evaluate(() => { window.__FAIL = true; });
    await p.click('[data-rd-cd-remove="k2"]');
    await p.waitForTimeout(80);
    check('row disappears optimistically', await p.locator('.rd-cd__item[data-rd-cd-removing]').count() === 1);
    await p.waitForTimeout(1200);
    check('row is restored after the failure', await p.locator('[data-rd-cd-remove="k2"]').count() === 1);
    check('restored row is visible again',
      await p.locator('[data-rd-cd-remove="k2"]').evaluate(el => el.closest('.rd-cd__item').getBoundingClientRect().height) > 10);
    check('all three rows present', await p.locator('.rd-cd__item').count() === 3);
    check('bag count back to 4', (await p.locator('[data-rd-bagcount]').innerText()).trim() === '4');
    check('pending cleared', await p.locator('[data-rd-cd-inner][data-rd-cd-pending]').count() === 0);
    await p.close();
  }

  console.log('\n4. Two rapid removals — the earlier re-render must not resurrect the later row');
  {
    const p = await fresh(b, 350);
    await p.click('[data-rd-cd-remove="k1"]');
    await p.waitForTimeout(40);
    await p.click('[data-rd-cd-remove="k3"]');
    await p.waitForTimeout(2000);
    check('both rows gone', await p.locator('[data-rd-cd-remove="k1"]').count() === 0
                         && await p.locator('[data-rd-cd-remove="k3"]').count() === 0);
    check('the untouched row remains', await p.locator('[data-rd-cd-remove="k2"]').count() === 1);
    check('exactly one row left', await p.locator('.rd-cd__item').count() === 1);
    check('bag count is 2', (await p.locator('[data-rd-bagcount]').innerText()).trim() === '2');
    check('no JS errors', p.__errs.length === 0, p.__errs.join('; '));
    await p.close();
  }

  console.log('\n5. Removing the last line shows the empty state');
  {
    const p = await fresh(b, 150);
    for (const k of ['k1','k2','k3']) { await p.click(`[data-rd-cd-remove="${k}"]`); await p.waitForTimeout(500); }
    await p.waitForTimeout(800);
    check('empty state rendered', await p.locator('.rd-cd__empty').count() === 1);
    check('no rows left', await p.locator('.rd-cd__item').count() === 0);
    check('bag count is 0', (await p.locator('[data-rd-bagcount]').innerText()).trim() === '0');
    await p.close();
  }

  console.log('\n6. Double-tapping Remove fires one request, not two');
  {
    const p = await fresh(b, 400);
    const btn = p.locator('[data-rd-cd-remove="k2"]');
    await btn.click();
    await btn.click({ force: true });
    await p.waitForTimeout(1400);
    const changes = await p.evaluate(() => window.__calls.filter(c => c.url.indexOf('/cart/change.js') === 0).length);
    check('exactly one /cart/change.js call', changes === 1, 'got ' + changes);
    await p.close();
  }

  console.log('\n7. Add to Bag still works and still opens the drawer');
  {
    const p = await fresh(b, 300);
    await p.evaluate(() => document.getElementById('rd-cart-drawer').setAttribute('hidden',''));
    await p.evaluate(() => window.RDCart.add(999, 1));
    await p.waitForTimeout(400);
    check('drawer opened after one round trip',
      await p.locator('#rd-cart-drawer').evaluate(el => !el.hasAttribute('hidden')));
    await p.waitForTimeout(800);
    check('no JS errors', p.__errs.length === 0, p.__errs.join('; '));
    await p.close();
  }

  console.log('\n8. An unchanged re-render does not rebuild the panel');
  {
    const p = await fresh(b, 100);
    const before = await p.evaluate(() => {
      const img = document.querySelector('.rd-cd__media img');
      img.__marked = true;                    // survives only if the node is not replaced
      return true;
    });
    await p.evaluate(() => window.RDCart.refresh());
    await p.waitForTimeout(600);
    check('image nodes reused when nothing changed',
      await p.evaluate(() => !!document.querySelector('.rd-cd__media img').__marked));
    await p.close();
  }

  console.log('\n' + '='.repeat(52));
  console.log(`${pass} passed, ${fail} failed`);
  await b.close();
  process.exit(fail ? 1 : 0);
})();
