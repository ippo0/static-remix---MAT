
(function () {
  if (window.RDCart) return;
  // A section-group section's ID is NOT its key in header-group.json: Shopify
  // gives it the form sections--<group-id>__rd_cart_drawer, and that is what
  // the Section Rendering API expects in ?sections=. section.id is exactly that.
  var SECTION  = "sections--77__rd_cart_drawer";
  var ROOT     = "/";
  var CART_URL = "/cart";
  var CHANGE_URL = "/cart/change";

  function root() { return document.getElementById('rd-cart-drawer'); }

  function open() {
    var d = root(); if (!d) return;
    d.removeAttribute('hidden');
    document.documentElement.classList.add('rd-cd-open');
    var x = d.querySelector('.rd-cd__x'); if (x) x.focus();
  }
  function close() {
    var d = root(); if (!d) return;
    d.setAttribute('hidden', '');
    document.documentElement.classList.remove('rd-cd-open');
  }

  function paintCount(scope) {
    var src = scope.querySelector('[data-rd-cd-count]');
    if (!src) return;
    var n = src.textContent.trim();
    document.querySelectorAll('[data-rd-bagcount]').forEach(function (el) { el.textContent = n; });
  }

  // Re-render through the Section Rendering API. Requested against the
  // locale root rather than the current path: the drawer lives in
  // header-group, which every page carries, and the root is the one URL that
  // can never be a 404 or a non-theme route. A failed refresh must never block
  // the drawer from opening, so this always resolves (see listener below).
  function refresh() {
    var url = ROOT + (ROOT.indexOf('?') === -1 ? '?' : '&') + 'sections=' + SECTION;
    return fetch(url, { headers: { 'Accept': 'application/json' }, credentials: 'same-origin' })
      .then(function (r) { if (!r.ok) throw new Error('sections ' + r.status); return r.json(); })
      .then(function (j) {
        var html = j && j[SECTION];
        if (!html) return;
        var tmp = document.createElement('div');
        tmp.innerHTML = html;
        var fresh = tmp.querySelector('[data-rd-cd-inner]');
        var cur = document.querySelector('[data-rd-cd-inner]');
        if (fresh && cur) {
          cur.innerHTML = fresh.innerHTML;
          paintCount(cur);
        }
      })
      .catch(function (e) { if (window.console) console.warn('[rd-cart-drawer] refresh failed:', e); });
  }

  function add(id, qty, props) {
    var item = { id: id, quantity: qty || 1 };
    if (props) item.properties = props;
    return fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ items: [item] })
    }).then(function (r) {
      if (!r.ok) { return r.json().then(function (e) { throw new Error(e.description || e.message || 'add failed'); }); }
      return r.json();
    }).then(function () {
      open();              // confirm first — the customer must see it
      return refresh();    // then bring the contents up to date
    });
  }

  // Remove / change quantity by line-item KEY, not by 1-based index. The
  // index only means something if the drawer's list is current; before the
  // section-ID fix above the list was always stale, so an index could have
  // removed the wrong line. The key is stable and unambiguous.
  function change(key, qty) {
    return fetch(CHANGE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ id: key, quantity: qty })
    }).then(function (r) {
      if (!r.ok) { return r.json().catch(function () { return {}; }).then(function (e) { throw new Error(e.description || e.message || ('change ' + r.status)); }); }
      return r.json();
    }).catch(function (e) {
      if (window.console) console.warn('[rd-cart-drawer] change failed:', e);
    }).then(function () {
      return refresh();   // always re-render from the server's truth, success or not
    });
  }

  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t || !t.closest) return;
    if (t.closest('[data-rd-cd-close]')) { e.preventDefault(); close(); return; }
    var rm = t.closest('[data-rd-cd-remove]');
    if (rm) {
      e.preventDefault();
      if (rm.getAttribute('aria-busy') === 'true') return;   // ignore double taps
      rm.setAttribute('aria-busy', 'true'); rm.disabled = true;
      change(rm.getAttribute('data-rd-cd-remove'), 0);       // refresh() replaces the row
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.keyCode === 27) close();
  });

  // 2026-09-03: sections/raqi-product.liquid and sections/raqi-discovery-box.liquid
  // announce a successful add with `cart:refresh` ({ detail: { open: true } }).
  // Until now the only listener was Minimog's assets/cart.js, so Add to Bag
  // opened the OLD <m-cart-drawer> while the header's Bag link opened this
  // one — two different drawers on one site. This drawer now answers the same
  // event, and the Minimog drawer is no longer rendered (layout/theme.liquid).
  //
  // 2026-09-03 (bug: builder added to cart but no drawer appeared): the first
  // version of this listener opened the drawer only AFTER refresh() resolved,
  // and refresh() had no catch — so any non-JSON or non-200 answer from the
  // sections request rejected the chain and open() was never reached. The
  // customer saw nothing. Order is now: open immediately, then refresh; and
  // if the drawer markup is somehow not on the page, fall back to /cart so
  // the add is never silent.
  document.addEventListener('cart:refresh', function (e) {
    var wantOpen = !!(e && e.detail && e.detail.open);
    if (wantOpen) {
      if (!root()) { window.location.href = CART_URL; return; }
      open();
    }
    refresh();
  });

  window.RDCart = { open: open, close: close, add: add, change: change, refresh: refresh };
})();
