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
  var tileDelay = new WeakMap();

  function show(el) {
    el.style.opacity = '1';
    el.style.transform = 'none';
  }

  var io = new IntersectionObserver(function (entries) {
    for (var i = 0; i < entries.length; i++) {
      if (!entries[i].isIntersecting) continue;
      show(entries[i].target);
      io.unobserve(entries[i].target);
    }
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.02 });

  // Opt-in observer for a grid of tiles: `data-reveal-onscroll` on the group.
  // Both differences from the default serve one rule — no tile is ever already
  // on by the time you scroll to it.
  //
  //   1. The trigger line sits well above the fold, so the top row (which on a
  //      laptop only peeks over the bottom edge at load) waits for the scroll
  //      instead of spending its reveal where nobody is looking.
  //   2. The rise is a keyframe animation, not the transition the rest of the
  //      site uses, for the same reason the hero is one: a transition only
  //      animates from a value the browser has already committed, and a tile
  //      the observer reveals on its first delivery has not. Those arrived
  //      fully formed, which is what made the rows below them look ragged
  //      swiping in afterwards. An animation always plays from its own start
  //      state. wccTileRise lives in global.css.
  var ioTiles = new IntersectionObserver(function (entries) {
    for (var i = 0; i < entries.length; i++) {
      if (!entries[i].isIntersecting) continue;
      var el = entries[i].target;
      // `both` holds the hidden start state through the stagger delay, and the
      // end state after — which is what the inline styles below already say,
      // so the tile stays put when the animation hands back over.
      el.style.animation = 'wccTileRise 1.35s ' + EASE + ' ' + (tileDelay.get(el) || 0) + 'ms both';
      show(el);
      ioTiles.unobserve(el);
    }
  }, { rootMargin: '0px 0px -15% 0px', threshold: 0.02 });

  function prime(el, delay, tile) {
    if (seen.has(el)) return;
    seen.add(el);
    el.style.opacity = '0';
    el.style.transform = 'translateY(22px)';
    if (tile) {
      tileDelay.set(el, delay);
      ioTiles.observe(el);
      return;
    }
    el.style.transition = 'opacity 1.35s ' + EASE + ' ' + delay + 'ms, transform 1.35s ' + EASE + ' ' + delay + 'ms';
    io.observe(el);
  }

  // Stagger across the grid's own columns, so a row sweeps the way it reads.
  // A fixed run of 8 against the gallery's 5 columns staggered diagonally:
  // tiles eight apart lit up together, while neighbours in one row landed half
  // a second apart. Falls back to 8 for groups that are not grids.
  function columns(el) {
    var cols = getComputedStyle(el).gridTemplateColumns;
    return cols && cols !== 'none' ? cols.trim().split(/\s+/).length : 8;
  }

  function scan() {
    var groups = document.querySelectorAll('[data-reveal-stagger]');
    for (var g = 0; g < groups.length; g++) {
      var group = groups[g];
      var step = parseInt(group.getAttribute('data-reveal-stagger'), 10) || 70;
      var tiles = group.hasAttribute('data-reveal-onscroll');
      var kids = group.children;
      // Resolved lazily — columns() forces a layout, and scan() re-runs on
      // every mutation, so only pay for it when there is something to prime.
      var run = 0;
      for (var k = 0; k < kids.length; k++) {
        var kid = kids[k];
        if (!kid.hasAttribute('data-reveal') || seen.has(kid)) continue;
        if (!run) run = tiles ? columns(group) : 8;
        prime(kid, (k % run) * step, tiles);
      }
    }
    var all = document.querySelectorAll('[data-reveal]');
    for (var i = 0; i < all.length; i++) {
      var d = parseInt(all[i].getAttribute('data-reveal-delay'), 10) || 0;
      prime(all[i], d, false);
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
