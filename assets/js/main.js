// Durga Sales Group — site scripts (no build step, no dependencies)

document.addEventListener("DOMContentLoaded", function () {
  var WA_NUMBER = "919797110055"; // Nav Durga Sales primary WhatsApp

  /* Mobile nav toggle */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector("nav.main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
      toggle.classList.toggle("is-open");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { nav.classList.remove("open"); });
    });
  }

  /* Gallery lightbox */
  var lightbox = document.querySelector(".lightbox");
  if (lightbox) {
    var lightboxImg = lightbox.querySelector("img");
    document.querySelectorAll("[data-lightbox]").forEach(function (el) {
      el.addEventListener("click", function () {
        var src = el.getAttribute("data-lightbox");
        var alt = el.getAttribute("data-caption") || "";
        lightboxImg.setAttribute("src", src);
        lightboxImg.setAttribute("alt", alt);
        lightbox.classList.add("open");
      });
    });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox || e.target.classList.contains("close")) {
        lightbox.classList.remove("open");
        lightboxImg.setAttribute("src", "");
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        lightbox.classList.remove("open");
        lightboxImg.setAttribute("src", "");
      }
    });
  }

  /* Enquiry form -> builds a prefilled WhatsApp message (no backend needed) */
  var form = document.getElementById("enquiry-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var name = (data.get("name") || "").trim();
      var business = (data.get("business") || "").trim();
      var city = (data.get("city") || "").trim();
      var product = data.get("product") || "";
      var qty = (data.get("quantity") || "").trim();
      var message = (data.get("message") || "").trim();

      var lines = ["Hello Durga Sales, I'd like to enquire about bulk pulses supply."];
      if (name) lines.push("Name: " + name);
      if (business) lines.push("Business: " + business);
      if (city) lines.push("City: " + city);
      if (product) lines.push("Product: " + product);
      if (qty) lines.push("Quantity needed: " + qty);
      if (message) lines.push("Message: " + message);

      var text = encodeURIComponent(lines.join("\n"));
      window.open("https://wa.me/" + WA_NUMBER + "?text=" + text, "_blank");
    });
  }

  /* Prefill product interest from ?product= query param (used by product page CTAs) */
  var params = new URLSearchParams(window.location.search);
  var productParam = params.get("product");
  if (productParam) {
    var select = document.querySelector('select[name="product"]');
    if (select) {
      Array.prototype.forEach.call(select.options, function (opt) {
        if (opt.value.toLowerCase() === productParam.toLowerCase()) {
          select.value = opt.value;
        }
      });
    }
  }
});
