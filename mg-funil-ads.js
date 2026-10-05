/* ================================================
 * MG Funil Google Ads · Innov Builders (LPs Google)
 * Frank · MediaGrowth · 2026-10-05
 * FUNIL 1 Ficou 60s · FUNIL 2 Rolou 75% · FUNIL 3 Viu o formulario
 * Cada um dispara 1x por página (conversões secundárias, só medição).
 * Espelha também no GA4 (funnel_60s / funnel_scroll_75 / funnel_form_view).
 * ================================================ */
(function () {
  'use strict';
  if (typeof gtag !== 'function') return;
  var AW = 'AW-16940335819';
  var L = { f1: 'u-xSCIKjpugcEMuF5I0_', f2: 'KVtZCJTppugcEMuF5I0_', f3: 'EBjwCJihpugcEMuF5I0_' };
  var GA = { f1: 'funnel_60s', f2: 'funnel_scroll_75', f3: 'funnel_form_view' };
  var done = {};
  function fire(k) {
    if (done[k]) return;
    done[k] = 1;
    try {
      gtag('event', 'conversion', { send_to: AW + '/' + L[k] });
      gtag('event', GA[k], { page_path: location.pathname, send_to: 'G-BW7MND80Z9' });
      if (typeof clarity === 'function') clarity('event', GA[k]);
    } catch (e) {}
  }

  // FUNIL 1: 60s com a aba visível (não conta aba em segundo plano)
  var vis = 0, last = Date.now(), on = document.visibilityState === 'visible';
  document.addEventListener('visibilitychange', function () {
    var n = Date.now(); if (on) vis += n - last; last = n; on = document.visibilityState === 'visible';
  });
  var t = setInterval(function () {
    var n = Date.now(); if (on) vis += n - last; last = n;
    if (vis >= 60000) { fire('f1'); clearInterval(t); }
  }, 2000);

  // FUNIL 2: rolou 75% da página
  function sc() {
    var h = document.documentElement, max = h.scrollHeight - window.innerHeight;
    if (max > 0 && (window.pageYOffset || h.scrollTop) / max >= 0.75) { fire('f2'); window.removeEventListener('scroll', sc); }
  }
  window.addEventListener('scroll', sc, { passive: true });

  // FUNIL 3: viu o formulário (form de orçamento 50% visível ou pop-up de orçamento aberto)
  var forms = [].slice.call(document.querySelectorAll('#heroForm, #contactForm, form.stepform, form[data-form="free_estimate"]'));
  if ('IntersectionObserver' in window && forms.length) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting && e.target.offsetParent !== null) { fire('f3'); io.disconnect(); }
      });
    }, { threshold: 0.5 });
    forms.forEach(function (f) { io.observe(f); });
  }
  var modal = document.getElementById('estimateModal');
  if (modal && 'MutationObserver' in window) {
    new MutationObserver(function () { if (modal.classList.contains('open')) fire('f3'); })
      .observe(modal, { attributes: true, attributeFilter: ['class'] });
  }
})();
