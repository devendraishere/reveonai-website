/* ReveonAI — homepage interactions
   Purposeful motion only; respects prefers-reduced-motion. */
(function () {
  "use strict";

  /* ---------- Mobile nav ---------- */
  var nav = document.getElementById("nav");
  var toggle = document.getElementById("navToggle");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll(".nav__menu a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Tabs (use cases) ---------- */
  var tabBtns = Array.prototype.slice.call(document.querySelectorAll(".tab-btn"));
  function selectTab(btn) {
    tabBtns.forEach(function (b) {
      var sel = b === btn;
      b.setAttribute("aria-selected", sel ? "true" : "false");
      var panel = document.getElementById(b.getAttribute("aria-controls"));
      if (panel) {
        panel.classList.toggle("is-active", sel);
        if (sel) { panel.removeAttribute("hidden"); } else { panel.setAttribute("hidden", ""); }
      }
    });
  }
  tabBtns.forEach(function (btn, i) {
    btn.addEventListener("click", function () { selectTab(btn); });
    btn.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      var next = e.key === "ArrowRight" ? (i + 1) % tabBtns.length : (i - 1 + tabBtns.length) % tabBtns.length;
      tabBtns[next].focus();
      selectTab(tabBtns[next]);
    });
  });

  /* ---------- Scroll reveal + ROI meter ---------- */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var meters = document.querySelectorAll(".roi__card .meter span");

  function fillMeters() {
    meters.forEach(function (m) { m.style.width = m.getAttribute("data-w") || "0"; });
  }

  if (reduce || !("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
    fillMeters();
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          if (entry.target.classList.contains("roi__card")) { fillMeters(); }
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  }

  /* ---------- Contact form ---------- */
  var form = document.getElementById("contactForm");
  if (form) {
    var status = document.getElementById("cfStatus");
    var submitBtn = form.querySelector(".cf__submit");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fields = ["cf-name", "cf-email", "cf-subject", "cf-message"].map(function (id) { return document.getElementById(id); });
      var invalid = false;
      fields.forEach(function (f) {
        var bad = !f.value.trim() || (f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value.trim()));
        f.classList.toggle("cf--invalid", bad);
        if (bad) invalid = true;
      });
      if (invalid) {
        status.textContent = "Please fill in all fields with a valid email.";
        status.className = "cf__status err";
        return;
      }
      var btnHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
      status.textContent = "";
      status.className = "cf__status";
      fetch("https://c25uqdd8of.execute-api.ap-south-1.amazonaws.com/dev/website/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fields[0].value.trim(),
          email: fields[1].value.trim(),
          subject: fields[2].value.trim(),
          message: fields[3].value.trim(),
          sitename: "ReveonAI"
        })
      }).then(function (res) {
        if (!res.ok) throw new Error("send failed");
        status.textContent = "Message sent — thank you. We'll get back to you soon.";
        status.className = "cf__status ok";
        form.reset();
      }).catch(function () {
        status.textContent = "Something went wrong. Please email contact@reveonai.com directly.";
        status.className = "cf__status err";
      }).finally(function () {
        submitBtn.disabled = false;
        submitBtn.innerHTML = btnHtml;
      });
    });
  }

  /* ---------- Header opacity on scroll ---------- */
  var header = document.querySelector(".header");
  if (header) {
    var onScroll = function () {
      header.style.background = window.scrollY > 24 ? "rgba(0,21,46,.92)" : "rgba(0,21,46,.72)";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
})();
