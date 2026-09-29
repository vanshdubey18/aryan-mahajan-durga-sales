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

  /* Variety gallery — click a product's hero photo to see its different qualities */
  var VARIETY_DATA = {
    rajma: {
      title: "Rajmash — Our Qualities",
      eyebrow: "DS Diamond",
      items: [
        { img: "assets/img/varieties/rajmash-china.jpg", label: "China Rajmash", labelHi: "चाइना राजमाश" },
        { img: "assets/img/varieties/rajmash-tukrey.jpg", label: "Tukrey Rajmash", labelHi: "टुकड़े राजमाश" },
        { img: "assets/img/varieties/rajmash-ethiopia.jpg", label: "Ethiopia Rajmash", labelHi: "इथोपिया राजमाश" },
        { img: "assets/img/varieties/rajmash-bihar.jpg", label: "Bihar Rajmash", labelHi: "बिहार राजमाश" },
        { img: "assets/img/varieties/rajmash-marwah.jpg", label: "Marwah Rajmash", labelHi: "मरवाह राजमाश" }
      ]
    },
    urad: {
      title: "Urad Dal (Mash) — Our Qualities",
      eyebrow: "DS Pulses",
      items: [
        { img: "assets/img/varieties/mash-whole.jpg", label: "Sabut Mash (Whole)", labelHi: "साबुत माश" },
        { img: "assets/img/varieties/mash-daley.jpg", label: "Daley Mash", labelHi: "दालें माश" },
        { img: "assets/img/varieties/mash-washed.jpg", label: "Washed Mash", labelHi: "धुला माश" }
      ]
    },
    chana: {
      title: "Chana Peela — Our Qualities",
      eyebrow: "DS Pulses",
      items: [
        { img: "assets/img/varieties/chana-roosi.jpg", label: "Roosi Chana", labelHi: "रूसी चना" },
        { img: "assets/img/varieties/chana-peela-anagiri.jpg", label: "Peela Chana — Anagiri", labelHi: "पीला चना (अनगिरी)" },
        { img: "assets/img/varieties/chana-peela-chappa.jpg", label: "Peela Chana — Chappa", labelHi: "पीला चना (छापा)" }
      ]
    },
    chanadal: {
      title: "Chana Dal — Our Qualities",
      eyebrow: "DS Pulses",
      items: [
        { img: "assets/img/varieties/chana-dal-medium.jpg", label: "Chana Dal — Medium", labelHi: "चना दाल (मीडियम)" },
        { img: "assets/img/varieties/chana-dal-full-dry.jpg", label: "Chana Dal — Full Dry", labelHi: "चना दाल (फुल ड्राई)" }
      ]
    },
    chanawhite: {
      title: "Chana White — Our Qualities",
      eyebrow: "DS Pulses",
      items: [
        { img: "assets/img/varieties/chana-white-doubledollar.jpg", label: "Double Dollar Chana", labelHi: "डबल डॉलर चना" },
        { img: "assets/img/varieties/chana-white-tripledollar.jpg", label: "Triple Dollar Chana", labelHi: "ट्रिपल डॉलर चना" }
      ]
    },
    toor: {
      title: "Toor Dal (Arhar) — Our Qualities",
      eyebrow: "DS Pulses",
      items: [
        { img: "assets/img/varieties/arhar-desi-fatka.jpg", label: "Desi Fatka Arhar", labelHi: "देसी फटका अरहर" },
        { img: "assets/img/varieties/arhar-imported.jpg", label: "Imported Arhar", labelHi: "इम्पोर्टेड अरहर" }
      ]
    },
    lobia: {
      title: "Lobia — Our Qualities",
      eyebrow: "DS Pulses",
      items: [
        { img: "assets/img/varieties/lobia-blackeye-madagascar.jpg", label: "Black Eye Lobia — Madagascar", labelHi: "ब्लैक आई लोबिया (मेडागास्कर)" },
        { img: "assets/img/varieties/lobia-whiteeye-brazil.jpg", label: "White Eye Lobia — Brazil", labelHi: "व्हाइट आई लोबिया (ब्राज़ील)" },
        { img: "assets/img/varieties/lobia-lal.jpg", label: "Lal Lobia", labelHi: "लाल लोबिया" }
      ]
    },
    moong: {
      title: "Moong — Our Qualities",
      eyebrow: "DS Pulses",
      items: [
        { img: "assets/img/varieties/moong-sabut-green-mp.jpg", label: "Sabut Green Moong — MP", labelHi: "साबुत हरी मूंग (एमपी)" },
        { img: "assets/img/varieties/moong-washed.jpg", label: "Washed Moong", labelHi: "धुली मूंग" },
        { img: "assets/img/varieties/moong-dali.jpg", label: "Moong Dali", labelHi: "मूंग दाली" }
      ]
    },
    masoor: {
      title: "Masoor — Our Qualities",
      eyebrow: "DS Pulses",
      items: [
        { img: "assets/img/varieties/masoor-malka-kori.jpg", label: "Malka Kori Masoor", labelHi: "मलका कोरी मसूर" },
        { img: "assets/img/varieties/masoor-barik-desi.jpg", label: "Barik Desi Masoor", labelHi: "बारीक देसी मसूर" },
        { img: "assets/img/varieties/masoor-imported-mota.jpg", label: "Imported Mota Masoor", labelHi: "इम्पोर्टेड मोटा मसूर" }
      ]
    },
    besan: {
      title: "Rajdhani Besan — All Types Available",
      eyebrow: "Authorised Superstockist",
      wide: { img: "assets/img/varieties/besan-rajdhani-all.jpg", label: "All types of Rajdhani Besan" },
      types: [
        { label: "Barik Besan (Fine)", labelHi: "बारिक बेसन" },
        { label: "Mota Besan (Coarse)", labelHi: "मोटा बेसन" },
        { label: "Motichoor Besan (Semi Fine)", labelHi: "मोतीचूर बेसन" },
        { label: "Gargara Besan (Semi Coarse)", labelHi: "गरगरा बेसन" },
        { label: "Patent Blue Besan (Super Fine)", labelHi: "पेटेंट ब्लू बेसन" },
        { label: "Rajdhani Dhokla Besan", labelHi: "ढोकला बेसन" },
        { label: "Super Diamond Besan (Bhavnagari Gathiya)", labelHi: "सुपर डायमंड बेसन" },
        { label: "Grit Besan (Gram Meal)", labelHi: "ग्रिट बेसन" },
        { label: "Mosvan Besan", labelHi: "मोसवन बेसन" }
      ],
      items: []
    },
    soya: {
      title: "Soya Bari — Ruchi (Patanjali Foods)",
      eyebrow: "All Types Available",
      wide: { img: "assets/img/varieties/soya-bari-ruchi.jpg", label: "All types of Ruchi Soya Bari (Patanjali Foods)" },
      types: [
        { label: "Soya Bari", labelHi: "सोया बड़ी" },
        { label: "Mini Soya Bari", labelHi: "मिनी सोया बड़ी" },
        { label: "Soya Granules", labelHi: "सोया बड़ी चूरा" }
      ],
      items: []
    },
    special: {
      title: "Special Pulses — Our Qualities",
      eyebrow: "DS Pulses",
      items: [
        { img: "assets/img/varieties/puffed-gram.jpg", label: "Puffed Gram (Bhuna Chana)", labelHi: "भुना चना" },
        { img: "assets/img/varieties/moth.jpg", label: "Moth", labelHi: "मोठ" },
        { img: "assets/img/varieties/kulthi-desi.jpg", label: "Kulthi — Desi", labelHi: "कुल्थी (देसी)" },
        { img: "assets/img/varieties/kulthi-punjabi.jpg", label: "Kulthi — Punjabi", labelHi: "कुल्थी (पंजाबी)" },
        { img: "assets/img/varieties/mattar-white.jpg", label: "Mattar White", labelHi: "मटर सफ़ेद" },
        { img: "assets/img/varieties/mattar-green.jpg", label: "Mattar Green", labelHi: "मटर हरा" }
      ]
    }
  };

  var vModal = document.getElementById("variety-modal");
  if (vModal) {
    var vGrid = document.getElementById("vm-grid");
    var vTitle = document.getElementById("vm-title");
    var vEyebrow = document.getElementById("vm-eyebrow");

    function openVarietyModal(key) {
      var data = VARIETY_DATA[key];
      if (!data) return;
      vTitle.textContent = data.title;
      vEyebrow.textContent = data.eyebrow || "Our Qualities";
      vGrid.innerHTML = "";
      if (data.wide) {
        var wide = document.createElement("div");
        wide.className = "vm-wide";
        wide.innerHTML = '<img src="' + data.wide.img + '" alt="' + data.wide.label + '" loading="lazy">';
        vGrid.appendChild(wide);
      }
      if (data.types) {
        var list = document.createElement("div");
        list.className = "vm-types";
        data.types.forEach(function (t) {
          var a = document.createElement("a");
          a.href = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent("Namaste, aaj ka bhav for " + t.label + "?");
          a.target = "_blank";
          a.rel = "noopener";
          a.innerHTML = "<strong>" + t.label + "</strong><em>Ask rate →</em>";
          list.appendChild(a);
        });
        vGrid.appendChild(list);
      }
      data.items.forEach(function (item) {
        var waText = encodeURIComponent("Namaste, aaj ka bhav for " + item.label + "?");
        var el = document.createElement("div");
        el.className = "vm-item";
        el.innerHTML =
          '<div class="vm-thumb"><img src="' + item.img + '" alt="' + item.label + '" loading="lazy"></div>' +
          '<div class="vm-label"><strong>' + item.label + '</strong>' +
          '<a class="vm-ask" href="https://wa.me/' + WA_NUMBER + '?text=' + waText + '" target="_blank" rel="noopener">' +
          '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2Zm0 18.1a8.1 8.1 0 0 1-4.3-1.3l-.3-.2-2.9.9.9-2.8-.2-.3A8.1 8.1 0 1 1 12 20.1Z"/></svg>Ask rate</a></div>';
        vGrid.appendChild(el);
      });
      vModal.classList.add("open");
    }

    document.querySelectorAll("[data-gallery]").forEach(function (el) {
      el.addEventListener("click", function (e) { e.preventDefault(); openVarietyModal(el.getAttribute("data-gallery")); });
      el.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openVarietyModal(el.getAttribute("data-gallery")); }
      });
    });
    vModal.addEventListener("click", function (e) {
      if (e.target === vModal || e.target.classList.contains("close")) {
        vModal.classList.remove("open");
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") vModal.classList.remove("open");
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
