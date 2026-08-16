// Scroll reveal — the site's signature interaction.
// Taken from the design handoff's reveal.js essentially as-is.
//
// Two details that matter and must not be "cleaned up":
//   1. It sets INLINE styles, not classes. A class-based version fought the
//      framework's re-renders: elements lost the class, got re-primed, and the
//      page locked up.
//   2. Nothing is hidden until JS runs, so content is visible if this fails.
(function () {
  if (window.__wccReveal) return;
  window.__wccReveal = true;

  var EASE = 'cubic-bezier(.22,.61,.36,1)';
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var seen = new WeakSet();

  var io = new IntersectionObserver(function (entries) {
    for (var i = 0; i < entries.length; i++) {
      var e = entries[i];
      if (!e.isIntersecting) continue;
      e.target.style.opacity = '1';
      e.target.style.transform = 'none';
      io.unobserve(e.target);
    }
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.02 });

  function prime(el, delay) {
    if (seen.has(el)) return;
    seen.add(el);
    el.style.opacity = '0';
    el.style.transform = 'translateY(22px)';
    el.style.transition = 'opacity .9s ' + EASE + ' ' + delay + 'ms, transform .9s ' + EASE + ' ' + delay + 'ms';
    io.observe(el);
  }

  function scan() {
    var groups = document.querySelectorAll('[data-reveal-stagger]');
    for (var g = 0; g < groups.length; g++) {
      var step = parseInt(groups[g].getAttribute('data-reveal-stagger'), 10) || 70;
      var kids = groups[g].children;
      for (var k = 0; k < kids.length; k++) {
        if (kids[k].hasAttribute('data-reveal')) prime(kids[k], (k % 8) * step);
      }
    }
    var all = document.querySelectorAll('[data-reveal]');
    for (var i = 0; i < all.length; i++) {
      var d = parseInt(all[i].getAttribute('data-reveal-delay'), 10) || 0;
      prime(all[i], d);
    }
  }

  var queued = false;
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () { queued = false; scan(); });
  }

  schedule();
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded', schedule);
  window.addEventListener('load', schedule);
})();
