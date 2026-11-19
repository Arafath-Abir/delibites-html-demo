/*!
 * DeliBites – main script (vanilla JS, no dependencies)
 * Modules: preloader, theme, header, nav, reveal, back-to-top, toast,
 *          cart, favourites, menu filter, dish details, cart page,
 *          countdown, tabs, forms, auth.
 */
(function () {
  "use strict";

  var MENU = window.DELIBITES_MENU || [];
  var CFG = window.DELIBITES_CONFIG || { currency: "$", deliveryFee: 0, freeDeliveryOver: 0, taxRate: 0, coupons: {} };
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var money = function (n) { return CFG.currency + n.toFixed(2); };
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
  };
  var findDish = function (id) { return MENU.filter(function (d) { return d.id === id; })[0]; };

  /* Preloader */
  function hidePreloader() { var p = $(".preloader"); if (p) p.classList.add("done"); }
  window.addEventListener("load", hidePreloader);
  setTimeout(hidePreloader, 1500); /* never block the page on slow assets */

  /* Theme (light / dark) */
  var root = document.documentElement;
  var saved = store.get("db-theme", null);
  if (saved) root.setAttribute("data-theme", saved);
  else if (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches) root.setAttribute("data-theme", "dark");
  function syncThemeIcon() {
    $$("[data-theme-toggle] i").forEach(function (i) {
      i.className = root.getAttribute("data-theme") === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
    });
  }
  $$("[data-theme-toggle]").forEach(function (b) {
    b.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next); store.set("db-theme", next); syncThemeIcon();
    });
  });
  syncThemeIcon();

  /* Sticky header + back to top */
  var header = $(".header"), backTop = $(".back-top");
  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle("scrolled", y > 10);
    if (backTop) backTop.classList.toggle("show", y > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  if (backTop) backTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

  /* Mobile nav */
  var toggle = $(".menu-toggle"), nav = $(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open);
      toggle.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    });
  }

  /* Active nav link */
  var page = location.pathname.split("/").pop() || "index.html";
  $$(".nav a").forEach(function (a) { if (a.getAttribute("href") === page) a.classList.add("active"); });

  /* Reveal on scroll */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    $$(".reveal").forEach(function (el) { io.observe(el); });
  } else { $$(".reveal").forEach(function (el) { el.classList.add("in"); }); }

  /* Toast */
  var toastEl;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement("div"); toastEl.className = "toast"; toastEl.setAttribute("role", "status");
      document.body.appendChild(toastEl);
    }
    toastEl.innerHTML = '<i class="fa-solid fa-circle-check"></i>' + msg;
    toastEl.classList.add("show");
    clearTimeout(toastEl._t); toastEl._t = setTimeout(function () { toastEl.classList.remove("show"); }, 2400);
  }
  window.DeliBitesToast = toast;

  /* Cart store */
  var Cart = {
    items: function () { return store.get("db-cart", []); },
    save: function (items) { store.set("db-cart", items); Cart.badge(); },
    add: function (id, qty, opts) {
      var items = Cart.items(), key = id + (opts ? "|" + opts : "");
      var row = items.filter(function (i) { return i.key === key; })[0];
      if (row) row.qty += qty; else items.push({ key: key, id: id, qty: qty, opts: opts || "" });
      Cart.save(items);
    },
    count: function () { return Cart.items().reduce(function (s, i) { return s + i.qty; }, 0); },
    badge: function () { var n = Cart.count(); $$(".cart-count").forEach(function (b) { b.textContent = n; b.style.display = n ? "grid" : "none"; }); }
  };
  Cart.badge();

  document.addEventListener("click", function (e) {
    var add = e.target.closest("[data-add-to-cart]");
    if (add) {
      e.preventDefault();
      var id = add.getAttribute("data-add-to-cart"), d = findDish(id);
      var qtyInput = $("#dish-qty"), sizeInput = $("input[name='size']:checked");
      var qty = add.hasAttribute("data-use-qty") && qtyInput ? Math.max(1, parseInt(qtyInput.value, 10) || 1) : 1;
      Cart.add(id, qty, add.hasAttribute("data-use-qty") && sizeInput ? sizeInput.value : "");
      toast((d ? d.name : "Item") + " added to cart");
    }
    var fav = e.target.closest(".fav-btn");
    if (fav) {
      e.preventDefault();
      var favs = store.get("db-favs", []), fid = fav.getAttribute("data-id"), i = favs.indexOf(fid);
      if (i > -1) favs.splice(i, 1); else favs.push(fid);
      store.set("db-favs", favs); paintFavs();
      toast(i > -1 ? "Removed from favourites" : "Saved to favourites");
    }
  });
  function paintFavs() {
    var favs = store.get("db-favs", []);
    $$(".fav-btn").forEach(function (b) {
      var on = favs.indexOf(b.getAttribute("data-id")) > -1;
      b.classList.toggle("active", on); b.setAttribute("aria-pressed", on);
      b.innerHTML = on ? '<i class="fa-solid fa-heart"></i>' : '<i class="fa-regular fa-heart"></i>';
    });
  }

  /* Dish card renderer (used by menu page and home) */
  function stars(r) { var s = ""; for (var i = 1; i <= 5; i++) s += '<i class="fa-' + (r >= i - 0.25 ? "solid" : "regular") + ' fa-star"></i>'; return s; }
  function dishCard(d) {
    return '<article class="card menu-item reveal" data-category="' + d.category + '" data-name="' + d.name.toLowerCase() + '">' +
      '<div class="card-media"><a href="dish.html?id=' + d.id + '"><img src="' + d.img + '" alt="' + d.name + '" loading="lazy" width="400" height="300"></a>' +
      (d.tag ? '<span class="badge">' + d.tag + '</span>' : "") +
      '<button class="fav-btn" data-id="' + d.id + '" aria-label="Save ' + d.name + ' to favourites"><i class="fa-regular fa-heart"></i></button></div>' +
      '<div class="card-body"><div class="rating">' + stars(d.rating) + '<span>' + d.rating + ' (' + d.reviews + ')</span></div>' +
      '<h3><a href="dish.html?id=' + d.id + '">' + d.name + '</a></h3><p>' + d.desc + '</p>' +
      '<div class="flex between"><span class="price">' + money(d.price) + (d.oldPrice ? '<del>' + money(d.oldPrice) + '</del>' : "") + '</span>' +
      '<button class="btn btn-primary btn-sm" data-add-to-cart="' + d.id + '"><i class="fa-solid fa-bag-shopping"></i> Add</button></div></div></article>';
  }
  $$("[data-dishes]").forEach(function (wrap) {
    var filter = wrap.getAttribute("data-dishes"), limit = parseInt(wrap.getAttribute("data-limit"), 10) || 999;
    var list = MENU.filter(function (d) { return filter === "all" || (filter === "featured" ? !!d.tag : d.category === filter); }).slice(0, limit);
    wrap.innerHTML = list.map(dishCard).join("");
    $$(".reveal", wrap).forEach(function (el) { el.classList.add("in"); });
  });
  paintFavs();

  /* Menu filter + search + sort */
  var grid = $("#menu-grid");
  if (grid) {
    var current = (new URLSearchParams(location.search).get("category")) || "all";
    var search = $("#menu-search"), sort = $("#menu-sort"), empty = $(".empty-state");
    function apply() {
      var q = search ? search.value.trim().toLowerCase() : "", shown = 0;
      var cards = $$(".menu-item", grid);
      if (sort && sort.value !== "popular") {
        cards.sort(function (a, b) {
          var da = findDish(a.querySelector(".fav-btn").getAttribute("data-id")), db = findDish(b.querySelector(".fav-btn").getAttribute("data-id"));
          return sort.value === "low" ? da.price - db.price : sort.value === "high" ? db.price - da.price : db.rating - da.rating;
        }).forEach(function (c) { grid.appendChild(c); });
      }
      cards.forEach(function (c) {
        var ok = (current === "all" || c.getAttribute("data-category") === current) && c.getAttribute("data-name").indexOf(q) > -1;
        c.classList.toggle("hide", !ok); if (ok) shown++;
      });
      if (empty) empty.classList.toggle("show", shown === 0);
      $$(".filter-btn").forEach(function (b) { var on = b.getAttribute("data-filter") === current; b.classList.toggle("active", on); b.setAttribute("aria-pressed", on); });
    }
    $$(".filter-btn").forEach(function (b) { b.addEventListener("click", function () { current = b.getAttribute("data-filter"); apply(); }); });
    if (search) search.addEventListener("input", apply);
    if (sort) sort.addEventListener("change", apply);
    apply();
  }

  /* Dish details page */
  var dishPage = $("#dish-page");
  if (dishPage) {
    var d = findDish(new URLSearchParams(location.search).get("id")) || MENU[0];
    document.title = d.name + " – DeliBites";
    $$("[data-dish]").forEach(function (el) {
      var f = el.getAttribute("data-dish");
      if (f === "img") { el.src = d.img; el.alt = d.name; }
      else if (f === "price") el.innerHTML = money(d.price) + (d.oldPrice ? "<del>" + money(d.oldPrice) + "</del>" : "");
      else if (f === "rating") el.innerHTML = stars(d.rating) + "<span>" + d.rating + " · " + d.reviews + " reviews</span>";
      else if (f === "category") el.textContent = d.category.charAt(0).toUpperCase() + d.category.slice(1);
      else if (f === "veg") el.style.display = d.veg ? "" : "none";
      else el.textContent = d[f];
    });
    $$("[data-add-to-cart]", dishPage).forEach(function (b) { b.setAttribute("data-add-to-cart", d.id); });
    $$(".thumbs img").forEach(function (t, i) { if (i === 0) t.src = d.img; });
    var related = $("#related");
    if (related) related.innerHTML = MENU.filter(function (x) { return x.category === d.category && x.id !== d.id; }).concat(MENU.filter(function (x) { return x.category !== d.category; })).slice(0, 4).map(dishCard).join("");
    $$("#related .reveal").forEach(function (el) { el.classList.add("in"); });
    paintFavs();
  }
  $$(".thumbs button").forEach(function (b) {
    b.addEventListener("click", function () {
      $$(".thumbs button").forEach(function (x) { x.classList.remove("active"); }); b.classList.add("active");
      var main = $(".dish-gallery .main img"); if (main) main.src = b.querySelector("img").src;
    });
  });
  $$(".qty").forEach(function (q) {
    var input = $("input", q);
    $$("button", q).forEach(function (b) {
      b.addEventListener("click", function () {
        var v = (parseInt(input.value, 10) || 1) + (b.getAttribute("data-step") === "up" ? 1 : -1);
        input.value = Math.min(99, Math.max(1, v)); input.dispatchEvent(new Event("change"));
      });
    });
  });

  /* Cart page */
  var cartList = $("#cart-list");
  if (cartList) {
    var discount = store.get("db-coupon", 0);
    function renderCart() {
      var items = Cart.items().filter(function (i) { return findDish(i.id); });
      if (!items.length) {
        cartList.innerHTML = '<div class="cart-empty card"><i class="fa-solid fa-bag-shopping"></i><h3>Your cart is empty</h3><p>Looks like you haven\'t added anything yet.</p><a href="menu.html" class="btn btn-primary">Browse the menu</a></div>';
      } else {
        cartList.innerHTML = items.map(function (i) {
          var d = findDish(i.id);
          return '<div class="cart-item"><img src="' + d.img + '" alt="' + d.name + '"><div><h4>' + d.name + '</h4><p class="mb-0">' + (i.opts ? i.opts + " · " : "") + money(d.price) + '</p></div>' +
            '<div class="qty"><button aria-label="Decrease" data-cart-step="-1" data-key="' + i.key + '">−</button><input value="' + i.qty + '" aria-label="Quantity" readonly><button aria-label="Increase" data-cart-step="1" data-key="' + i.key + '">+</button></div>' +
            '<div class="flex"><strong>' + money(d.price * i.qty) + '</strong><button class="remove-btn" data-remove="' + i.key + '" aria-label="Remove ' + d.name + '"><i class="fa-solid fa-trash"></i></button></div></div>';
        }).join("");
      }
      var sub = items.reduce(function (s, i) { return s + findDish(i.id).price * i.qty; }, 0);
      var disc = sub * discount, delivery = !sub || sub >= CFG.freeDeliveryOver ? 0 : CFG.deliveryFee;
      var tax = (sub - disc) * CFG.taxRate, total = sub - disc + delivery + tax;
      var set = function (id, v) { var el = document.getElementById(id); if (el) el.textContent = v; };
      set("sum-sub", money(sub)); set("sum-disc", "−" + money(disc)); set("sum-del", delivery ? money(delivery) : "Free");
      set("sum-tax", money(tax)); set("sum-total", money(total));
      var free = $("#free-note");
      if (free) free.textContent = sub && sub < CFG.freeDeliveryOver ? "Add " + money(CFG.freeDeliveryOver - sub) + " more for free delivery" : sub ? "You've unlocked free delivery!" : "";
      var checkout = $("#checkout-btn"); if (checkout) checkout.toggleAttribute("disabled", !items.length);
    }
    cartList.addEventListener("click", function (e) {
      var step = e.target.closest("[data-cart-step]"), rm = e.target.closest("[data-remove]"), items = Cart.items();
      if (step) {
        items.forEach(function (i) { if (i.key === step.getAttribute("data-key")) i.qty = Math.max(1, i.qty + parseInt(step.getAttribute("data-cart-step"), 10)); });
        Cart.save(items); renderCart();
      }
      if (rm) { Cart.save(items.filter(function (i) { return i.key !== rm.getAttribute("data-remove"); })); renderCart(); toast("Item removed"); }
    });
    var cform = $("#coupon-form");
    if (cform) cform.addEventListener("submit", function (e) {
      e.preventDefault();
      var code = $("input", cform).value.trim().toUpperCase(), rate = CFG.coupons[code];
      if (rate) { discount = rate; store.set("db-coupon", rate); toast("Coupon applied: " + Math.round(rate * 100) + "% off"); }
      else { toast("That coupon code isn't valid"); }
      renderCart();
    });
    var co = $("#checkout-btn");
    if (co) co.addEventListener("click", function () {
      Cart.save([]); store.set("db-coupon", 0); discount = 0; renderCart();
      toast("Order placed! Estimated delivery: 30–40 min");
    });
    renderCart();
  }

  /* Countdown (data-countdown="hours from now" or ISO date) */
  $$("[data-countdown]").forEach(function (el) {
    var v = el.getAttribute("data-countdown");
    var end = isNaN(v) ? new Date(v).getTime() : Date.now() + parseFloat(v) * 3600000;
    function tick() {
      var t = Math.max(0, end - Date.now());
      var parts = { d: Math.floor(t / 864e5), h: Math.floor(t / 36e5) % 24, m: Math.floor(t / 6e4) % 60, s: Math.floor(t / 1e3) % 60 };
      Object.keys(parts).forEach(function (k) { var s = $("[data-" + k + "]", el); if (s) s.textContent = String(parts[k]).padStart(2, "0"); });
    }
    tick(); setInterval(tick, 1000);
  });

  /* Tabs */
  $$("[data-tabs]").forEach(function (wrap) {
    $$(".tab-btn", wrap).forEach(function (b) {
      b.addEventListener("click", function () {
        $$(".tab-btn", wrap).forEach(function (x) { x.classList.remove("active"); x.setAttribute("aria-selected", "false"); });
        $$(".tab-panel", wrap).forEach(function (x) { x.classList.remove("active"); });
        b.classList.add("active"); b.setAttribute("aria-selected", "true");
        var p = document.getElementById(b.getAttribute("aria-controls")); if (p) p.classList.add("active");
      });
    });
  });

  /* Forms: simple client-side validation + success message.
     Replace the submit handler with your own backend / form service. */
  $$("form[data-validate]").forEach(function (form) {
    form.setAttribute("novalidate", "");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      $$("[required]", form).forEach(function (f) {
        var bad = f.type === "email" ? !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value) : f.type === "checkbox" ? !f.checked : !f.value.trim();
        f.classList.toggle("is-invalid", bad); if (bad) ok = false;
      });
      var pw = $("[name='password']", form), cf = $("[name='confirm']", form);
      if (pw && cf && pw.value !== cf.value) { cf.classList.add("is-invalid"); ok = false; }
      var msg = $(".form-msg", form);
      if (!ok) { toast("Please fill in the highlighted fields"); return; }
      if (msg) msg.classList.add("show");
      toast(form.getAttribute("data-success") || "Thank you! We'll be in touch.");
      form.reset();
    });
  });

  /* Auth tabs + password toggle */
  $$(".auth-tabs button").forEach(function (b) {
    b.addEventListener("click", function () {
      $$(".auth-tabs button").forEach(function (x) { x.classList.toggle("active", x === b); });
      $$("[data-auth-panel]").forEach(function (p) { p.hidden = p.getAttribute("data-auth-panel") !== b.getAttribute("data-target"); });
    });
  });
  if (location.hash === "#signup") { var s = $(".auth-tabs [data-target='signup']"); if (s) s.click(); }
  $$(".pass-toggle").forEach(function (b) {
    b.addEventListener("click", function () {
      var i = b.previousElementSibling; i.type = i.type === "password" ? "text" : "password";
      b.innerHTML = i.type === "password" ? '<i class="fa-regular fa-eye"></i>' : '<i class="fa-regular fa-eye-slash"></i>';
    });
  });

  /* Year in footer */
  $$("[data-year]").forEach(function (y) { y.textContent = new Date().getFullYear(); });
})();
