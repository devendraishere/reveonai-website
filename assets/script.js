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
