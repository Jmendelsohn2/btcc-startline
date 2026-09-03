/* Injects the shared shell (top bar + bottom quick-switch bar) into a tool page.
   A tool page just needs:  <body data-tool="countdown">  ... and to load nav.css + nav.js.
   The page's own flex-column body layout is preserved: the bars become the first/last
   flex items, so `.checker-bottom { margin-top:auto }` still pushes to the bar. */
(function () {
  var TOOLS = [
    { id: 'index',     file: 'index.html',     label: 'Home',      icon: '\u{1F3E0}' },
    { id: 'countdown', file: 'countdown.html', label: 'Countdown', icon: '\u{1F6A9}', green: true },
    { id: 'adverse',   file: 'adverse.html',   label: 'Adverse',   icon: '\u{1F327}' },
    { id: 'support',   file: 'support.html',   label: 'Support',   icon: '⏱' },
    { id: 'photo',     file: 'photo.html',     label: 'Photo',     icon: '\u{1F4F7}' }
  ];
  var TITLES = {
    countdown: 'Race Start Countdown',
    adverse: 'Adverse Weather',
    support: 'Support Race Timing',
    photo: 'Send Photo to Clerk'
  };

  var tool = document.body.getAttribute('data-tool');
  var showClock = (tool === 'countdown' || tool === 'adverse');

  // ---- top bar ----
  var bar = document.createElement('div');
  bar.className = 'appbar';
  var clockHTML = showClock ? '<div class="clock" id="__clock">--:--:--</div>' : '';
  bar.innerHTML = clockHTML +
    '<div class="titlerow">' +
      '<a class="back" href="index.html" aria-label="Home">‹</a>' +
      '<div class="title">' + (TITLES[tool] || '') + '</div>' +
    '</div>';
  document.body.insertBefore(bar, document.body.firstChild);

  if (showClock) {
    var el = document.getElementById('__clock');
    var tick = function () {
      var d = new Date();
      var p = function (n) { return String(n).padStart(2, '0'); };
      el.textContent = p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds());
    };
    tick();
    setInterval(tick, 1000);
  }

  // ---- bottom quick-switch bar ----
  var sw = document.createElement('div');
  sw.className = 'switchbar';
  sw.innerHTML = TOOLS.map(function (t) {
    var on = t.id === tool ? (' on' + (t.green ? ' green' : '')) : '';
    return '<a class="tab' + on + '" href="' + t.file + '">' +
             '<span class="ic">' + t.icon + '</span>' + t.label +
           '</a>';
  }).join('');
  document.body.appendChild(sw);

  // ---- reserve space for the fixed bars (heights vary: clock / no clock, safe areas) ----
  function pad() {
    document.body.style.paddingTop = bar.offsetHeight + 'px';
    document.body.style.paddingBottom = sw.offsetHeight + 'px';
  }
  pad();
  window.addEventListener('resize', pad);
  window.addEventListener('orientationchange', function () { setTimeout(pad, 200); });

  // ---- service worker ----
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(function () {});
  }
})();
