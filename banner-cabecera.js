/* Banner "Calendario de igualás y ensayos" en la cabecera de vamolosnota.es
   Se carga desde "Código personalizado en el head" de IONOS. */
(function () {
  var URL_CAL = "https://www.vamolosnota.es/calendario-de-igualas-y-ensayos/";
  if (location.pathname.indexOf("/calendario-de-igualas-y-ensayos") === 0) return; // en su propia página no hace falta

  var CSS =
    "#vln-cab{display:flex;align-items:center;gap:14px;box-sizing:border-box;background:#4A2818;border:2px solid #d4a574;border-radius:14px;padding:12px 16px;text-decoration:none!important;color:#faf3e7!important;font-family:Georgia,'Times New Roman',serif;box-shadow:0 6px 18px rgba(40,20,10,.35);transition:transform .15s ease,box-shadow .15s ease}" +
    "#vln-cab:hover{transform:translateY(-2px);box-shadow:0 10px 24px rgba(40,20,10,.45)}" +
    "#vln-cab:focus-visible{outline:3px solid #faf3e7;outline-offset:2px}" +
    "#vln-cab svg{flex:0 0 50px}" +
    "#vln-cab .t{flex:1 1 auto;min-width:0}" +
    "#vln-cab .e{display:block;font:700 11px Arial,sans-serif;letter-spacing:2px;color:#d4a574!important}" +
    "#vln-cab .h{display:block;font-size:21px;font-weight:700;line-height:1.15;margin:2px 0;color:#faf3e7!important}" +
    "#vln-cab .s{display:block;font:13px Arial,sans-serif;color:#faf3e7!important;opacity:.9}" +
    "#vln-cab .b{flex:0 0 auto;background:#d4a574;color:#4A2818!important;font:700 14px Arial,sans-serif;padding:9px 13px;border-radius:10px;white-space:nowrap}" +
    "#vln-cab.abs{position:absolute;z-index:50;width:620px;max-width:calc(100% - 32px)}" +
    "#vln-cab.mov{margin:10px 12px;padding:10px 12px;gap:10px;border-radius:12px}" +
    "#vln-cab.mov svg{flex-basis:40px;width:40px;height:40px}" +
    "#vln-cab.mov .h{font-size:17px}#vln-cab.mov .s{display:none}#vln-cab.mov .b{padding:8px 10px;font-size:13px}" +
    "@media (prefers-reduced-motion:reduce){#vln-cab{transition:none}#vln-cab:hover{transform:none}}";

  var ICONO = '<svg width="50" height="50" viewBox="0 0 58 58" aria-hidden="true"><rect x="3" y="8" width="52" height="47" rx="7" fill="#faf3e7"/><rect x="3" y="8" width="52" height="14" rx="7" fill="#6b2c1a"/><rect x="3" y="16" width="52" height="6" fill="#6b2c1a"/><rect x="15" y="3" width="5" height="11" rx="2.5" fill="#d4a574"/><rect x="38" y="3" width="5" height="11" rx="2.5" fill="#d4a574"/><circle cx="16" cy="33" r="5" fill="#c0392b"/><circle cx="29" cy="33" r="5" fill="#1f5fa8"/><circle cx="42" cy="33" r="5" fill="#2e8b57"/><circle cx="16" cy="46" r="5" fill="#7b3fa0"/><circle cx="29" cy="46" r="5" fill="#e6d9c4"/><circle cx="42" cy="46" r="5" fill="#c0392b"/></svg>';

  function crear() {
    var a = document.createElement("a");
    a.id = "vln-cab"; a.href = URL_CAL;
    a.setAttribute("aria-label", "Calendario de igualás y ensayos 2026-2027");
    a.innerHTML = ICONO + '<span class="t"><span class="e">TEMPORADA 2026 · 2027</span><span class="h">Calendario de igualás y ensayos</span><span class="s">Sevilla, Huelva, Granada y Córdoba · se actualiza cada día</span></span><span class="b">Ver fechas ›</span>';
    return a;
  }

  function colocar() {
    var h = document.querySelector("header");
    if (!h) return;
    var a = document.getElementById("vln-cab") || crear();
    var ancho = document.documentElement.clientWidth;
    if (ancho >= 1000) {
      // Ordenador: dentro de la cabecera, en el hueco bajo el menú
      a.className = "abs";
      if (getComputedStyle(h).position === "static") h.style.position = "relative";
      if (a.parentNode !== h) h.appendChild(a);
      var hr = h.getBoundingClientRect();
      var links = [].slice.call(h.querySelectorAll("nav a, a")).filter(function (x) {
        var r = x.getBoundingClientRect(); return x.offsetParent && !x.querySelector("img,svg,picture") && (x.textContent || "").trim().length > 2 && r.width > 30 && r.height > 20 && r.top > hr.top && r.top < hr.top + hr.height * 0.6 && x.id !== "vln-cab" && !x.closest("#vln-cab");
      });
      var izq = Infinity, abajo = 0;
      links.forEach(function (x) { var r = x.getBoundingClientRect(); izq = Math.min(izq, r.left); abajo = Math.max(abajo, r.bottom); });
      if (!isFinite(izq)) { izq = hr.left + hr.width * 0.3; abajo = hr.top + hr.height * 0.4; }
      var top = abajo - hr.top + 18;
      var hueco = hr.height - top - 12;
      a.style.left = Math.round(izq - hr.left) + "px";
      a.style.top = Math.round(top + Math.max(0, (hueco - a.offsetHeight) / 2)) + "px";
    } else {
      // Móvil/tablet: tira compacta justo debajo de la cabecera
      a.className = "mov"; a.style.left = a.style.top = "";
      if (a.previousElementSibling !== h) h.parentNode.insertBefore(a, h.nextSibling);
    }
  }

  function iniciar() {
    if (!document.getElementById("vln-cab-css")) {
      var st = document.createElement("style"); st.id = "vln-cab-css"; st.textContent = CSS; document.head.appendChild(st);
    }
    colocar();
    setTimeout(colocar, 800); setTimeout(colocar, 2500); // por si la cabecera termina de cargar tarde
    var t; window.addEventListener("resize", function () { clearTimeout(t); t = setTimeout(colocar, 150); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar); else iniciar();
})();
