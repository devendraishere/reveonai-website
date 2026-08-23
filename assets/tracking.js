/* ============================================================
   ReveonAI — third-party marketing tags
   ------------------------------------------------------------
   Google Analytics 4 is loaded inline in each page's <head>.
   This file carries everything else, so IDs live in ONE place
   instead of being copy-pasted across sixteen HTML files.

   >>> TO ACTIVATE LINKEDIN, FILL IN THE TWO VALUES BELOW. <<<

   Where to find them (LinkedIn Campaign Manager):
     PARTNER_ID  : Analyze -> Insight Tag -> "Partner ID" (6-7 digits)
     LEAD_CONV_ID: Analyze -> Conversions -> create a conversion of
                   type "Lead", then read its numeric ID from the URL
                   or the conversion detail panel.

   Until PARTNER_ID is set, nothing loads and no requests are made —
   the site stays clean rather than firing a broken pixel.
   ============================================================ */

(function () {
  "use strict";

  var CONFIG = {
    // e.g. "1234567" — leave empty to keep LinkedIn switched off.
    LINKEDIN_PARTNER_ID: "",
    // e.g. "9876543" — optional; enables lead conversion attribution.
    LINKEDIN_LEAD_CONVERSION_ID: ""
  };

  // Expose for script.js (form success fires the conversion) and for
  // quick checking in the browser console.
  window.REVEON_TRACKING = CONFIG;

  var pid = (CONFIG.LINKEDIN_PARTNER_ID || "").trim();
  if (!pid) return; // Not configured yet — do nothing at all.

  /* ---------- LinkedIn Insight Tag ---------- */
  window._linkedin_partner_id = pid;
  window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
  window._linkedin_data_partner_ids.push(pid);

  (function (l) {
    if (!l) {
      window.lintrk = function (a, b) { window.lintrk.q.push([a, b]); };
      window.lintrk.q = [];
    }
    var s = document.getElementsByTagName("script")[0];
    var b = document.createElement("script");
    b.type = "text/javascript";
    b.async = true;
    b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
    s.parentNode.insertBefore(b, s);
  })(window.lintrk);

  /* ---------- No-script fallback pixel ---------- */
  // Injected rather than hardcoded in the HTML so the partner ID stays
  // in this single file.
  document.addEventListener("DOMContentLoaded", function () {
    var ns = document.createElement("noscript");
    var img = document.createElement("img");
    img.height = 1;
    img.width = 1;
    img.style.display = "none";
    img.alt = "";
    img.src = "https://px.ads.linkedin.com/collect/?pid=" + encodeURIComponent(pid) + "&fmt=gif";
    ns.appendChild(img);
    document.body.appendChild(ns);
  });
})();
