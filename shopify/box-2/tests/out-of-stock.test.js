const { chromium } = require('playwright');
const path = require('path');

let pass = 0, fail = 0;
function check(name, cond, extra) {
  if (cond) { console.log('  PASS  ' + name); pass++; }
  else { console.log('  FAIL  ' + name + (extra ? '  -> ' + extra : '')); fail++; }
}

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto('file://' + path.resolve('harness.html'));

  const sig = '[data-db-picker="signature"] ';
  const dis = '[data-db-picker="discovery"] ';
  const oosSig = sig + '[data-oos="true"]';
  const okSig1 = sig + '[data-variant-id="101"]';
  const okSig2 = sig + '[data-variant-id="103"]';

  console.log('\n1. Out-of-stock cards are still RENDERED in both grids');
  check('Step 1 grid shows all 3 cards', await page.locator(sig + '[data-db-pick]').count() === 3);
  check('Step 2 grid shows all 3 cards', await page.locator(dis + '[data-db-pick]').count() === 3);
  check('Angels’ Share is present in Step 1', await page.locator(oosSig).count() === 1);
  check('Wind Flowers is present in Step 2', await page.locator(dis + '[data-oos="true"]').count() === 1);

  console.log('\n2. The badge is visible and legible');
  const badge = page.locator(oosSig + ' .raqi-db__pick-oos');
  check('badge element exists', await badge.count() === 1);
  check('badge is visible', await badge.isVisible());
  check('badge reads "Out of stock"', (await badge.innerText()).trim().toLowerCase() === 'out of stock',
        JSON.stringify(await badge.innerText()));
  const bs = await badge.evaluate(el => { const c = getComputedStyle(el); const r = el.getBoundingClientRect();
    return { op: c.opacity, bg: c.backgroundColor, color: c.color, w: r.width, h: r.height }; });
  check('badge is fully opaque (not dimmed with the card)', bs.op === '1', 'opacity=' + bs.op);
  check('badge has real size', bs.w > 20 && bs.h > 8, JSON.stringify(bs));
  check('badge has ink background', bs.bg !== 'rgba(0, 0, 0, 0)', bs.bg);

  console.log('\n3. The out-of-stock card is visually dimmed');
  const imgOp = await page.locator(oosSig + ' .raqi-db__pick-media img').evaluate(el => getComputedStyle(el).opacity);
  check('image is dimmed', parseFloat(imgOp) < 0.5, 'opacity=' + imgOp);
  const nameOp = await page.locator(oosSig + ' .raqi-db__pick-name').evaluate(el => getComputedStyle(el).opacity);
  check('name is dimmed', parseFloat(nameOp) < 0.6, 'opacity=' + nameOp);
  const inStockImgOp = await page.locator(okSig1 + ' .raqi-db__pick-media img').evaluate(el => getComputedStyle(el).opacity);
  check('in-stock card is NOT dimmed', inStockImgOp === '1', 'opacity=' + inStockImgOp);
  check('cursor is not-allowed', await page.locator(oosSig).evaluate(el => getComputedStyle(el).cursor) === 'not-allowed');
  check('aria-disabled is set', await page.locator(oosSig).getAttribute('aria-disabled') === 'true');

  console.log('\n4. Out-of-stock cards CANNOT be selected (click)');
  await page.locator(oosSig).click({ force: true });
  check('OOS card did not become selected', !(await page.locator(oosSig).evaluate(el => el.classList.contains('is-selected'))));
  check('Continue (step 1) is still disabled', await page.locator('#RaqiDbNext1').isDisabled());

  console.log('\n5. Out-of-stock cards CANNOT be selected (keyboard)');
  await page.locator(oosSig).focus();
  await page.keyboard.press('Enter');
  await page.locator(oosSig).focus();
  await page.keyboard.press(' ');
  check('still not selected after Enter and Space', !(await page.locator(oosSig).evaluate(el => el.classList.contains('is-selected'))));
  check('Continue (step 1) still disabled', await page.locator('#RaqiDbNext1').isDisabled());

  console.log('\n6. Notes still work on an out-of-stock card');
  await page.locator(oosSig + ' [data-view-notes]').click({ force: true });
  check('notes modal opened', await page.locator('#RaqiDbNotesModal').isVisible());
  check('modal shows the fragrance name', (await page.locator('#RaqiDbNotesModalTitle').innerText()).includes('Angels'));
  check('opening notes did not select the card', !(await page.locator(oosSig).evaluate(el => el.classList.contains('is-selected'))));
  await page.locator('.raqi-db__notes-modal-close').click();
  check('notes modal closed', !(await page.locator('#RaqiDbNotesModal').isVisible()));

  console.log('\n7. In-stock cards still work normally (no regression)');
  await page.locator(okSig1).click();
  check('in-stock card selects', await page.locator(okSig1).evaluate(el => el.classList.contains('is-selected')));
  check('Continue (step 1) now enabled', await page.locator('#RaqiDbNext1').isEnabled());
  await page.locator(okSig2).click();
  check('selecting another swaps the choice', await page.locator(okSig2).evaluate(el => el.classList.contains('is-selected'))
        && !(await page.locator(okSig1).evaluate(el => el.classList.contains('is-selected'))));

  console.log('\n8. Step 2 behaves the same way');
  await page.locator('#RaqiDbNext1').click();
  await page.waitForTimeout(120);
  check('step 2 is showing', await page.locator('[data-db-panel="2"]').isVisible());
  await page.locator(dis + '[data-oos="true"]').click({ force: true });
  check('OOS discovery card not selected', !(await page.locator(dis + '[data-oos="true"]').evaluate(el => el.classList.contains('is-selected'))));
  check('hint still says 0 selected', (await page.locator('#RaqiDbStep2Hint').innerText()).trim().startsWith('0'));
  check('Continue (step 2) disabled', await page.locator('#RaqiDbNext2').isDisabled());
  await page.locator(dis + '[data-variant-id="201"]').click();
  await page.locator(dis + '[data-variant-id="203"]').click();
  check('two in-stock picks enable Continue', await page.locator('#RaqiDbNext2').isEnabled());
  check('hint says 2 selected', (await page.locator('#RaqiDbStep2Hint').innerText()).trim().startsWith('2'));

  console.log('\n9. A box can only ever be built from in-stock fragrances');
  await page.locator('#RaqiDbNext2').click();
  await page.waitForTimeout(120);
  const review = await page.locator('#RaqiDbReviewList').innerText();
  check('review lists 3 items', (await page.locator('.raqi-db__review-item').count()) === 3);
  check('review contains no out-of-stock fragrance', !review.includes('Angels') && !review.includes('Wind Flowers'), review.replace(/\n/g, ' | '));

  console.log('\n10. No JavaScript errors');
  check('no page errors', errors.length === 0, errors.join('; '));

  console.log('\n' + '='.repeat(48));
  console.log(`${pass} passed, ${fail} failed`);
  await browser.close();
  process.exit(fail ? 1 : 0);
})();
