(function () {
  var WA = "919797110055";
  var doc = document.documentElement;

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // mobile menu
  var btn = document.querySelector(".menu-btn");
  if (btn) {
    var setMenu = function (open) {
      doc.classList.toggle("menu-open", open);
      btn.setAttribute("aria-expanded", String(open));
      btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    btn.addEventListener("click", function () { setMenu(!doc.classList.contains("menu-open")); });
    document.querySelectorAll(".nav a").forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
  }

  // reveal on scroll
  var items = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }

  // parchi: a paper order slip that becomes a WhatsApp message
  var form = document.getElementById("parchi");
  if (!form) return;
  var products = ["Rajmash", "Mash (Urad)", "Roosi Chana", "Kabuli Chana", "Toor Dal", "Besan", "Lobia"];
  var qty = products.map(function () { return 0; });
  var list = form.querySelector(".p-rows");
  var hint = form.querySelector(".hint");

  products.forEach(function (name, i) {
    var li = document.createElement("li");
    li.innerHTML =
      '<span>' + name + '</span>' +
      '<span class="qty"><button type="button" aria-label="One bag less of ' + name + '">−</button>' +
      '<output aria-live="polite">0 bags</output>' +
      '<button type="button" aria-label="One bag more of ' + name + '">+</button></span>';
    var out = li.querySelector("output");
    var bs = li.querySelectorAll("button");
    var render = function () {
      out.textContent = qty[i] + (qty[i] === 1 ? " bag" : " bags");
      li.classList.toggle("on", qty[i] > 0);
    };
    bs[0].addEventListener("click", function () { qty[i] = Math.max(0, qty[i] - 1); render(); });
    bs[1].addEventListener("click", function () { qty[i] = Math.min(999, qty[i] + 1); render(); });
    list.appendChild(li);
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var lines = [];
    products.forEach(function (name, i) {
      if (qty[i] > 0) lines.push("• " + name + ": " + qty[i] + (qty[i] === 1 ? " bag" : " bags"));
    });
    if (!lines.length) {
      hint.textContent = "Add at least one bag first.";
      hint.style.color = "#9c1f2b";
      return;
    }
    var name = form.elements.name.value.trim();
    var shop = form.elements.shop.value.trim();
    var msg = ["Namaste Durga Sales, my parchi:", ""].concat(lines, [""]);
    if (name) msg.push("Name: " + name);
    if (shop) msg.push("Shop/Town: " + shop);
    msg.push("Please share today's rate.");
    window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(msg.join("\n")), "_blank", "noopener");
  });
})();
