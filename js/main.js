/* ==========================================================
   Portfolio scripts
   Edit CONFIG to change the GitHub account used for Projects.
   ========================================================== */
(function () {
  'use strict';

  var CONFIG = {
    githubUser: 'suhashunashimarad',
    maxRepos: 6
  };

  var root = document.documentElement;

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Theme toggle ---------- */
  var themeBtn = document.getElementById('theme-toggle');
  var themeMeta = document.querySelector('meta[name="theme-color"]');

  function currentTheme() {
    var attr = root.getAttribute('data-theme');
    if (attr === 'light' || attr === 'dark') return attr;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function syncThemeUi() {
    var dark = currentTheme() === 'dark';
    if (themeBtn) {
      themeBtn.setAttribute('aria-pressed', String(dark));
    }
    if (themeMeta) themeMeta.setAttribute('content', dark ? '#0D1620' : '#EEF2F5');
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      syncThemeUi();
    });
  }
  syncThemeUi();

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.getElementById('menu-btn');
  var nav = document.getElementById('nav');

  function setMenu(open) {
    if (!menuBtn || !nav) return;
    nav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
  }

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 768) setMenu(false);
    });
  }

  /* ---------- Career timeline: expand / collapse ---------- */
  document.querySelectorAll('.span-head').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      btn.setAttribute('aria-expanded', String(!open));
      if (panel) panel.hidden = open;
    });
  });

  /* ---------- Career timeline: draw bars once when visible ---------- */
  var trace = document.querySelector('.trace');
  if (trace) {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            trace.classList.add('in');
            io.disconnect();
          }
        });
      }, { threshold: 0.25 });
      io.observe(trace);
    } else {
      trace.classList.add('in');
    }
  }

  /* ---------- Projects from GitHub ---------- */
  var list = document.getElementById('repo-list');
  var status = document.getElementById('repo-status');

  function formatDate(iso) {
    try {
      return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(new Date(iso));
    } catch (e) {
      return '';
    }
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function renderRepos(repos) {
    var user = CONFIG.githubUser.toLowerCase();
    var picked = repos
      .filter(function (r) {
        var name = r.name.toLowerCase();
        return !r.fork && !r.archived && name !== user + '.github.io' && name !== user;
      })
      .sort(function (a, b) {
        return (b.stargazers_count - a.stargazers_count) || (new Date(b.pushed_at) - new Date(a.pushed_at));
      })
      .slice(0, CONFIG.maxRepos);

    if (!picked.length) {
      status.textContent = 'No public projects to show yet. New work will appear here as I publish it.';
      return;
    }

    status.textContent = '';
    picked.forEach(function (r) {
      var card = el('a', 'repo');
      card.href = r.html_url;
      card.target = '_blank';
      card.rel = 'noopener';

      card.appendChild(el('h3', '', r.name));
      card.appendChild(el('p', '', r.description || 'No description yet.'));

      var meta = el('div', 'repo-meta');
      if (r.language) meta.appendChild(el('span', '', r.language));
      if (r.stargazers_count) meta.appendChild(el('span', '', r.stargazers_count + ' stars'));
      var when = formatDate(r.pushed_at);
      if (when) meta.appendChild(el('span', '', 'Updated ' + when));
      card.appendChild(meta);

      list.appendChild(card);
    });
  }

  function loadRepos() {
    if (!list || !status) return;

    var cacheKey = 'repos-v1-' + CONFIG.githubUser;
    var cached = null;
    try { cached = JSON.parse(sessionStorage.getItem(cacheKey)); } catch (e) {}

    if (cached) {
      renderRepos(cached);
      return;
    }

    fetch('https://api.github.com/users/' + encodeURIComponent(CONFIG.githubUser) + '/repos?per_page=100&sort=updated')
      .then(function (res) {
        if (!res.ok) throw new Error('GitHub responded with ' + res.status);
        return res.json();
      })
      .then(function (repos) {
        try { sessionStorage.setItem(cacheKey, JSON.stringify(repos)); } catch (e) {}
        renderRepos(repos);
      })
      .catch(function () {
        status.textContent = 'Projects could not be loaded right now. You can browse them on GitHub using the link below.';
      });
  }

  loadRepos();
})();
