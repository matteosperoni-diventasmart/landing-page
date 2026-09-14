/* ================================================================
   DiventaSmart - script.js
   Banner consenso cookie + caricamento condizionale Google Analytics
   ================================================================ */

/* IMPOSTAZIONE GOOGLE ANALYTICS 4
   -----------------------------------------------------------------
   ID di misurazione configurato. GA4 viene caricato SOLO dopo il
   consenso dell'utente espresso tramite il banner (cookie.html).
   */
var GA4_MEASUREMENT_ID = "G-Q9SRVQPXH6";

var CONSENT_KEY = "diventasmart_cookie_consent"; // "accepted" | "declined"

function gaAvailable() {
  return typeof window.gtag === "function";
}

function gaEvent() {
  if (!gaAvailable()) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag("js", new Date());
  window.gtag("config", GA4_MEASUREMENT_ID, { anonymize_ip: true });
}

function loadAnalytics() {
  if (gaAvailable() || GA4_MEASUREMENT_ID.indexOf("XXXX") !== -1) return;
  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA4_MEASUREMENT_ID;
  s.onload = gaEvent;
  document.head.appendChild(s);
}

var CONSENT_DEFAULT = "accepted";
var banner = null;
var saved = null;
try { saved = localStorage.getItem(CONSENT_KEY); } catch (e) { /* storage non disponibile */ }

if (saved === CONSENT_DEFAULT || saved === "declined") {
  if (saved === CONSENT_DEFAULT) loadAnalytics();
} else {
  banner = document.createElement("div");
  banner.id = "cookieBanner";
  banner.className = "cookie-banner show";
  banner.setAttribute("role", "dialog");
  banner.setAttribute("aria-live", "polite");
  banner.setAttribute("aria-label", "Consenso cookie");
  banner.innerHTML = '<p class="cb-text">Questo sito utilizza Google Analytics, uno strumento di statistiche che impiega cookie. Ti chiediamo il consenso prima di attivarli. Puoi leggere la nostra <a href="cookie.html">Cookie Policy</a> e la <a href="privacy.html">Privacy Policy</a>.</p><div class="cb-actions"><button class="btn" id="cookieAccept" type="button">Accetta</button><button class="btn-ghost" id="cookieDecline" type="button">Rifiuta</button></div>';
  document.body.appendChild(banner);
  document.getElementById("cookieAccept").addEventListener("click", function () {
    storeConsent(CONSENT_DEFAULT);
    loadAnalytics();
  });
  document.getElementById("cookieDecline").addEventListener("click", function () {
    storeConsent("declined");
  });
}

function storeConsent(value) {
  try { localStorage.setItem(CONSENT_KEY, value); } catch (e) { /* ignora */ }
  if (banner) banner.classList.remove("show");
}

/* Anno dinamico nel footer */
var y = document.getElementById("year");
if (y) y.textContent = new Date().getFullYear();

/* ================================================================
   Navigazione scroll guidato: puntini + freccia
   ================================================================ */
var snapMain = document.querySelector(".snap-root");
var sectionIds = ["top", "contatti"];
var sectionEls = sectionIds.map(function (id) { return document.getElementById(id); });
var dots = Array.prototype.slice.call(document.querySelectorAll(".scroll-dots .dot"));
var dotsNav = document.querySelector(".scroll-dots");
var cue = document.querySelector(".scroll-cue");
var footer = document.getElementById("footer");

function setActiveDot(index) {
  dots.forEach(function (d, i) {
    d.classList.toggle("active", i === index);
  });
}

function scrollToSection(el) {
  if (!snapMain || !el) return;
  var top = el.getBoundingClientRect().top - snapMain.getBoundingClientRect().top + snapMain.scrollTop;
  snapMain.scrollTo({ top: top, behavior: "smooth" });
}

if (dots.length) {
  dots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      scrollToSection(document.getElementById(dot.getAttribute("data-target")));
    });
  });
}

if (snapMain && "IntersectionObserver" in window) {
  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var idx = sectionEls.indexOf(entry.target);
        if (idx !== -1) setActiveDot(idx);
      }
    });
  }, { root: snapMain, threshold: 0.6 });
  sectionEls.forEach(function (s) { if (s) sectionObserver.observe(s); });

  /* Nascondi puntini quando il footer è in vista */
  if (footer && dotsNav) {
    var footerObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        dotsNav.classList.toggle("hidden", entry.isIntersecting);
      });
    }, { root: null, threshold: 0.3 });
    footerObserver.observe(footer);
  }
}

if (cue && snapMain) {
  var onScroll = function () {
    cue.classList.toggle("hidden", snapMain.scrollTop > snapMain.clientHeight * 0.5);
  };
  snapMain.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ================================================================
   Form contatti → mailto
   ================================================================ */
var form = document.getElementById("contactForm");
if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = form.nome.value.trim();
    var msg  = form.messaggio.value.trim();
    var subject = encodeURIComponent("Contatto dal sito diventasmart.it");
    var body    = encodeURIComponent("Nome: " + name + "\n\n" + msg);
    window.location.href = "mailto:info@diventasmart.it?subject=" + subject + "&body=" + body;
  });
}