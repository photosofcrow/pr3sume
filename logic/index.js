/* ---- Fecha dinámica ---- */
(function () {
  var meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  var d = new Date();
  var el = document.getElementById('currentDate');
  if (el) el.textContent = meses[d.getMonth()].toUpperCase() + ' ' + d.getFullYear();
})();

/* ---- Burger ---- */
document.getElementById('burger').addEventListener('click', function () {
  document.getElementById('navLinks').classList.toggle('open');
  document.getElementById('burger').classList.toggle('open');
});

/* ---- Scroll spy ---- */
var sections = ['hero', 'sobre-mi', 'videos', 'blog'];
var navAs = document.querySelectorAll('.nav-links a[data-section]');
window.addEventListener('scroll', function () {
  var scrollY = window.scrollY + 100;
  sections.forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    if (scrollY >= el.offsetTop && scrollY < el.offsetTop + el.offsetHeight) {
      navAs.forEach(function (a) {
        a.classList.toggle('active', a.dataset.section === id);
      });
    }
  });
}, { passive: true });

/* ---- Intersection Observer (animaciones entrada) ---- */
var observer = new IntersectionObserver(function (entries) {
  entries.forEach(function (e) {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });

function observeAll() {
  document.querySelectorAll('.reveal').forEach(function (el) {
    observer.observe(el);
  });
}
observeAll();

/* ---- Helper: crea elemento ---- */
function el(tag, cls, html) {
  var e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html) e.innerHTML = html;
  return e;
}

/* ---- VÍDEOS desde data/videos.json ---- */
fetch('data/videos.json')
  .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
  .then(function (videos) {
    var grid = document.getElementById('vpGrid');
    if (!grid) return;
    grid.innerHTML = '';
    var preview = videos.slice(0, 3);
    if (!preview.length) {
      grid.innerHTML = '<a href="videos.html" class="vp-card big"><div class="vp-body" style="padding:2rem;text-align:center"><div class="vp-cat">// archivo visual</div><div class="vp-title">Ver todos los vídeos →</div></div></a>';
      return;
    }
    preview.forEach(function (v, i) {
      var thumb = 'https://img.youtube.com/vi/' + v.id + '/mqdefault.jpg';
      var card = el('a', 'vp-card reveal' + (i === 0 ? ' big' : ''));
      card.href = 'videos.html';
      card.innerHTML =
        '<div class="vp-thumb">' +
          '<img src="' + thumb + '" alt="' + v.titulo + '" loading="lazy">' +
          '<div class="vp-play"><div class="vp-play-btn"><div class="vp-play-icon"></div></div></div>' +
        '</div>' +
        '<div class="vp-body">' +
          '<div class="vp-cat">' + (v.cat || 'vídeo') + '</div>' +
          '<div class="vp-title">' + v.titulo + '</div>' +
        '</div>';
      grid.appendChild(card);
    });
    observeAll();
  })
  .catch(function () {
    var grid = document.getElementById('vpGrid');
    if (grid) grid.innerHTML = '<a href="videos.html" class="vp-card big" style="text-decoration:none"><div class="vp-body" style="padding:2rem;text-align:center"><div class="vp-cat">// archivo visual</div><div class="vp-title" style="font-size:1.2rem">Ver todos los vídeos →</div></div></a>';
  });

/* ---- BLOG desde data/blog.json ---- */
fetch('data/blog.json')
  .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
  .then(function (posts) {
    var main = document.getElementById('blogMain');
    var side = document.getElementById('blogSide');
    if (!main || !posts.length) return;

    /* Post destacado → columna principal */
    var dest = posts.find(function (p) { return p.destacado; }) || posts[0];
    var art = el('article', 'post reveal');
    art.innerHTML =
      '<div class="post-tag">★ ' + dest.categoria + ' · destacado</div>' +
      '<h3 class="post-title">' + dest.titulo + '</h3>' +
      '<p class="post-excerpt">' + dest.resumen + '</p>' +
      '<div class="post-meta"><span>' + dest.fecha + '</span><span>·</span><span>' + dest.lectura + ' lectura</span></div>' +
      '<div class="leer-mas">Leer artículo →</div>';
    art.onclick = function () { location.href = 'blog.html#' + dest.id; };
    main.appendChild(art);

    /* Segundo post grande si existe */
    if (posts[1]) {
      var art2 = el('article', 'post reveal reveal-delay-1');
      art2.innerHTML =
        '<div class="post-tag">' + posts[1].categoria + '</div>' +
        '<h3 class="post-title">' + posts[1].titulo + '</h3>' +
        '<p class="post-excerpt">' + posts[1].resumen + '</p>' +
        '<div class="post-meta"><span>' + posts[1].fecha + '</span><span>·</span><span>' + posts[1].lectura + ' lectura</span></div>' +
        '<div class="leer-mas">Leer artículo →</div>';
      art2.onclick = function () { location.href = 'blog.html#' + posts[1].id; };
      main.appendChild(art2);
    }

    /* Posts pequeños → columna lateral */
    posts.slice(2, 5).forEach(function (p, i) {
      var sm = el('article', 'post-sm reveal reveal-delay-' + (i + 1));
      sm.innerHTML =
        '<div class="post-tag">' + p.categoria + '</div>' +
        '<h4 class="post-title">' + p.titulo + '</h4>' +
        '<p class="post-excerpt">' + p.resumen + '</p>' +
        '<div class="post-meta"><span>' + p.fecha + '</span></div>';
      sm.onclick = function () { location.href = 'blog.html#' + p.id; };
      side.appendChild(sm);
    });

    observeAll();
  })
  .catch(function () {
    var main = document.getElementById('blogMain');
    if (main) main.innerHTML = '<p style="color:var(--gris);font-size:0.8rem;padding:1rem 0;">No se pudo cargar el blog — asegúrate de usar un servidor local.</p>';
  });
