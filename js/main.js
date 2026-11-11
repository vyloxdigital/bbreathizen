/* Breathizen — main.js | bbreathizen.vercel.app */
(function () {
  'use strict';

  /* Mobile menu */
  function initMenu() {
    var btn = document.querySelector('.nav-toggle');
    var list = document.getElementById('nav-list');
    if (!btn || !list) return;
    function close() {
      list.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    }
    btn.addEventListener('click', function () {
      var open = list.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    list.addEventListener('click', function (e) {
      if (e.target.closest('a')) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

  /* Breathing pacer: 4s in, 2s hold, 6s out. The words follow the ring. */
  function initPacer() {
    var pacer = document.querySelector('.pacer');
    var word = document.getElementById('pacer-word');
    var toggle = document.getElementById('pacer-toggle');
    var ring = pacer && pacer.querySelector('.pacer-ring');
    if (!pacer || !word || !ring) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      word.textContent = 'In for 4, hold for 2, out for 6';
      return;
    }

    var timers = [];
    function clear() { timers.forEach(clearTimeout); timers = []; }
    function cycle() {
      clear();
      word.textContent = 'Breathe in';
      timers.push(setTimeout(function () { word.textContent = 'Hold'; }, 4000));
      timers.push(setTimeout(function () { word.textContent = 'Breathe out'; }, 6000));
    }
    ring.addEventListener('animationiteration', cycle);
    cycle();

    if (toggle) {
      toggle.addEventListener('click', function () {
        var paused = pacer.classList.toggle('is-paused');
        toggle.textContent = paused ? 'Restart the pacer' : 'Pause the pacer';
        toggle.setAttribute('aria-pressed', paused ? 'true' : 'false');
        if (paused) {
          clear();
          word.textContent = 'Paused';
        } else {
          /* restart the ring from the top of an inhale so words and ring agree */
          pacer.querySelectorAll('.pacer-ring').forEach(function (r) {
            r.style.animation = 'none';
            void r.offsetWidth;
            r.style.animation = '';
          });
          cycle();
        }
      });
    }
  }

  /* Highlight the current section in the contents rail */
  function initRail() {
    var links = document.querySelectorAll('.rail a[href^="#"]');
    if (!links.length || !('IntersectionObserver' in window)) return;
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove('is-current'); a.removeAttribute('aria-current'); });
        var a = map[e.target.id];
        if (a) { a.classList.add('is-current'); a.setAttribute('aria-current', 'true'); }
      });
    }, { rootMargin: '-25% 0px -65% 0px' });
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) io.observe(el);
    });
  }

  /* Mobile order bar appears once the hero has scrolled away */
  function initDock() {
    var dock = document.querySelector('.dock');
    var hero = document.querySelector('.hero');
    var shelf = document.getElementById('pricing');
    if (!dock || !hero || !('IntersectionObserver' in window)) return;
    var heroGone = false, atShelf = false;
    function update() { dock.classList.toggle('is-shown', heroGone && !atShelf); }
    new IntersectionObserver(function (es) { heroGone = !es[0].isIntersecting; update(); }).observe(hero);
    if (shelf) new IntersectionObserver(function (es) { atShelf = es[0].isIntersecting; update(); }).observe(shelf);
  }

  function init() { initMenu(); initPacer(); initRail(); initDock(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
