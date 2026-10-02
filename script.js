/* ==========================================================================
   Nina Lindroos — språkväxling (SV/FI) och bokningsformulär
   ========================================================================== */
(function () {
  'use strict';

  var STORE = 'nl-lang';
  var LANGS = ['fi', 'sv', 'en'];   // finska är standard

  /* -------------------------------------------------- sidmetadata per språk */
  var META = {
    fi: {
      title: 'Nina Lindroos — Laulaja ja juontaja',
      desc: 'Laulua ja juontoa juhliin, yritystilaisuuksiin ja tapahtumiin. Jokainen kokonaisuus rakentuu tilaisuuden, tunnelman ja toiveiden mukaan.'
    },
    sv: {
      title: 'Nina Lindroos — Sångerska och konferencier',
      desc: 'Sång och konferencierskap för fester, företagsevenemang och tillställningar. Varje helhet byggs enligt tillfället, stämningen och önskemålen.'
    },
    en: {
      title: 'Nina Lindroos — Singer and host',
      desc: 'Singing and hosting for parties, corporate events and celebrations. Every set is built around the occasion, the atmosphere and your wishes.'
    }
  };

  /* ------------------------------------------- texter för e-postmeddelandet */
  var MAIL = {
    fi: {
      subject: 'Tarjouspyyntö — ',
      namn: 'Nimi', epost: 'Sähköposti', tel: 'Puhelin', typ: 'Tilaisuuden tyyppi',
      datum: 'Päivämäärä', ort: 'Paikkakunta', budget: 'Budjettihaarukka', medd: 'Viesti',
      fallback: 'Täytä ensin nimi ja sähköposti.'
    },
    sv: {
      subject: 'Bokningsförfrågan — ',
      namn: 'Namn', epost: 'E-post', tel: 'Telefon', typ: 'Typ av tillfälle',
      datum: 'Datum', ort: 'Ort', budget: 'Budgetram', medd: 'Meddelande',
      fallback: 'Fyll i namn och e-post först.'
    },
    en: {
      subject: 'Booking enquiry — ',
      namn: 'Name', epost: 'Email', tel: 'Phone', typ: 'Type of occasion',
      datum: 'Date', ort: 'Location', budget: 'Budget range', medd: 'Message',
      fallback: 'Please fill in your name and email first.'
    }
  };

  var current = 'fi';

  /* ------------------------------------------------------------- hjälpare */
  function read() {
    try { return localStorage.getItem(STORE); } catch (e) { return null; }
  }
  function write(v) {
    try { localStorage.setItem(STORE, v); } catch (e) { /* privat läge */ }
  }
  function valid(v) { return LANGS.indexOf(v) > -1 ? v : null; }

  function initialLang() {
    var q = null;
    try {
      q = valid(new URLSearchParams(location.search).get('lang'));
    } catch (e) { /* äldre webbläsare */ }
    if (q) return q;

    var stored = valid(read());
    if (stored) return stored;

    // Sajten öppnas alltid på finska. Webbläsarspråket får inte avgöra —
    // en finsk besökare med engelskspråkig telefon ska ändå få finska.
    return 'fi';
  }

  /* ---------------------------------------------------------- språkbyte */
  function apply(lang) {
    if (!valid(lang)) lang = 'fi';
    current = lang;

    var nodes = document.querySelectorAll('[data-' + lang + ']');
    for (var i = 0; i < nodes.length; i++) {
      var t = nodes[i].getAttribute('data-' + lang);
      if (t !== null) nodes[i].textContent = t;
    }

    var arias = document.querySelectorAll('[data-' + lang + '-aria]');
    for (var k = 0; k < arias.length; k++) {
      arias[k].setAttribute('aria-label', arias[k].getAttribute('data-' + lang + '-aria'));
    }

    document.documentElement.lang = lang;   // fi | sv | en
    document.title = META[lang].title;

    var d = document.querySelector('meta[name="description"]');
    if (d) d.setAttribute('content', META[lang].desc);

    var buttons = document.querySelectorAll('.lang');
    for (var j = 0; j < buttons.length; j++) {
      buttons[j].setAttribute(
        'aria-pressed',
        buttons[j].getAttribute('data-lang') === lang ? 'true' : 'false'
      );
    }

    write(lang);
  }

  document.addEventListener('click', function (ev) {
    var btn = ev.target.closest ? ev.target.closest('.lang') : null;
    if (!btn) return;
    apply(btn.getAttribute('data-lang'));
  });

  apply(initialLang());

  /* ------------------------------------------------- bokningsformuläret
     Statisk sajt utan backend: förfrågan öppnas i besökarens e-postprogram
     med alla fält ifyllda. Vill du ha ett riktigt formulär i stället, sätt
     action="https://formspree.io/f/DITT-ID" method="POST" på <form> och ta
     bort submit-lyssnaren nedan.                                          */
  var form = document.getElementById('bokform');
  if (!form) return;

  function val(name) {
    var el = form.elements[name];
    if (!el) return '';
    if (el.tagName === 'SELECT') {
      var o = el.options[el.selectedIndex];
      return o && o.value ? o.textContent.trim() : '';
    }
    return (el.value || '').trim();
  }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();

    var t = MAIL[current];
    var namn = val('namn');
    var epost = val('epost');

    if (!namn || !epost) {
      if (typeof form.reportValidity === 'function') form.reportValidity();
      else window.alert(t.fallback);
      return;
    }

    var rows = [
      [t.namn, namn],
      [t.epost, epost],
      [t.tel, val('tel')],
      [t.typ, val('typ')],
      [t.datum, val('datum')],
      [t.ort, val('ort')],
      [t.budget, val('budget')]
    ];

    var body = '';
    for (var i = 0; i < rows.length; i++) {
      if (rows[i][1]) body += rows[i][0] + ': ' + rows[i][1] + '\n';
    }

    var medd = val('meddelande');
    if (medd) body += '\n' + t.medd + ':\n' + medd + '\n';

    var subject = t.subject + namn + (val('datum') ? ' / ' + val('datum') : '');

    window.location.href =
      'mailto:ninacharlind@gmail.com' +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);
  });
})();

/* ==========================================================================
   Omdömen — ett i taget, bläddras i sidled.
   Bläddringen är CSS (scroll-snap), så karusellen fungerar även utan JS —
   svep på pekskärm, piltangenter när spåret har fokus. Prickar och pilar
   nedan är påbyggnad ovanpå det.
   ========================================================================== */
(function () {
  'use strict';

  var track = document.querySelector('.tstm__track');
  if (!track) return;

  var items = Array.prototype.slice.call(track.children);
  var dots = Array.prototype.slice.call(document.querySelectorAll('.tstm__dot'));
  var arrows = Array.prototype.slice.call(document.querySelectorAll('.tstm__arrow'));
  if (!items.length) return;

  function current() {
    var w = track.clientWidth || 1;
    return Math.max(0, Math.min(items.length - 1, Math.round(track.scrollLeft / w)));
  }

  // CSS-regeln scroll-behavior:auto under prefers-reduced-motion slås ut av
  // ett uttryckligt behavior:'smooth' här — så frågan måste ställas i JS med.
  var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');

  function go(i) {
    var n = Math.max(0, Math.min(items.length - 1, i));
    track.scrollTo({
      left: n * track.clientWidth,
      behavior: (calm && calm.matches) ? 'auto' : 'smooth'
    });
  }

  function sync() {
    var i = current();
    for (var n = 0; n < dots.length; n++) {
      dots[n].setAttribute('aria-current', n === i ? 'true' : 'false');
    }
  }

  track.addEventListener('scroll', sync, { passive: true });

  for (var d = 0; d < dots.length; d++) {
    (function (n) { dots[n].addEventListener('click', function () { go(n); }); })(d);
  }
  for (var a = 0; a < arrows.length; a++) {
    (function (btn) {
      btn.addEventListener('click', function () {
        go(current() + (parseInt(btn.getAttribute('data-dir'), 10) || 0));
      });
    })(arrows[a]);
  }

  var resizeTimer;
  window.addEventListener('resize', function () {
    var i = current();
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function () {
      track.scrollLeft = i * track.clientWidth;
      sync();
    }, 150);
  });

  sync();
})();

/* ==========================================================================
   Markerar vilket avsnitt besökaren befinner sig i, i den klistrade raden.
   ========================================================================== */
(function () {
  'use strict';

  var bar = document.querySelector('.topbar');
  var links = Array.prototype.slice.call(document.querySelectorAll('.topbar__nav a[href^="#"]'));
  if (!bar || !links.length) return;

  var targets = [];
  for (var i = 0; i < links.length; i++) {
    var el = document.querySelector(links[i].getAttribute('href'));
    if (el) targets.push({ link: links[i], el: el });
  }
  if (!targets.length) return;

  function mark(active) {
    for (var i = 0; i < targets.length; i++) {
      if (targets[i].link === active) targets[i].link.setAttribute('aria-current', 'true');
      else targets[i].link.removeAttribute('aria-current');
    }
  }

  function spy() {
    // Läslinjen ligger strax under raden — avsnittet som passerat den vinner.
    var line = window.scrollY + bar.offsetHeight + 48;
    var active = null;

    for (var i = 0; i < targets.length; i++) {
      if (targets[i].el.offsetTop <= line) active = targets[i].link;
    }
    // Sista avsnittet är ofta för kort för att nå linjen — fånga sidans slut.
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      active = targets[targets.length - 1].link;
    }
    mark(active);
  }

  window.addEventListener('scroll', spy, { passive: true });
  window.addEventListener('resize', spy);
  spy();
})();
