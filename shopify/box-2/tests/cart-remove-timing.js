const { chromium } = require('playwright');
const fs = require('fs');
const { page } = require('./harness.js');
const LAT = [0, 150, 400, 800];

async function run(browser, jsFile, cssFile, qtyAttr) {
  const js = fs.readFileSync(jsFile, 'utf8');
  const css = cssFile ? fs.readFileSync(cssFile, 'utf8') : '';
  const html = page(js, css, qtyAttr);
  const rows = [];
  for (const lat of LAT) {
    const p = await browser.newPage();
    await p.setContent(html);
    await p.evaluate(l => { window.__LAT = l; }, lat);
    const r = await p.evaluate(async () => {
      const btn = document.querySelector('[data-rd-cd-remove="k2"]');
      const li = btn.closest('.rd-cd__item');
      const h0 = li.getBoundingClientRect().height;
      const t0 = performance.now();
      btn.click();
      let first = -1, gone = -1;
      await new Promise(res => {
        const dl = performance.now() + 8000;
        (function c() {
          const attached = document.body.contains(li);
          const h = attached ? li.getBoundingClientRect().height : 0;
          if (first < 0 && (!attached || h < h0 - 0.5)) first = performance.now() - t0;
          if (!attached || h < 1) { gone = performance.now() - t0; return res(); }
          if (performance.now() > dl) return res();
          requestAnimationFrame(c);
        })();
      });
      return { first, gone, count: document.querySelector('[data-rd-bagcount]').textContent };
    });
    rows.push({ lat, ...r });
    await p.close();
  }
  return rows;
}

(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const before = await run(b, 'old.js', null, false);
  const after  = await run(b, 'new.js', 'new.css', true);
  console.log('Time from tapping Remove to the FIRST visible change on screen');
  console.log('  latency/req |    before |     after |  improvement');
  for (let i = 0; i < LAT.length; i++) {
    const bf = Math.round(before[i].first), af = Math.round(after[i].first);
    const imp = bf > 0 ? (bf / Math.max(af, 1)).toFixed(1) + 'x' : '—';
    console.log(`  ${String(LAT[i]).padStart(5)} ms   | ${String(bf).padStart(6)} ms | ${String(af).padStart(6)} ms |  ${imp}`);
  }
  console.log('\nTime until the row has fully left the layout');
  console.log('  latency/req |    before |     after');
  for (let i = 0; i < LAT.length; i++) {
    console.log(`  ${String(LAT[i]).padStart(5)} ms   | ${String(Math.round(before[i].gone)).padStart(6)} ms | ${String(Math.round(after[i].gone)).padStart(6)} ms`);
  }
  console.log('\nBag count immediately after the interaction settles (was 4, removing a qty-2 line -> 2)');
  for (let i = 0; i < LAT.length; i++) {
    console.log(`  ${String(LAT[i]).padStart(5)} ms   | before: ${before[i].count}  after: ${after[i].count}`);
  }
  await b.close();
})();
