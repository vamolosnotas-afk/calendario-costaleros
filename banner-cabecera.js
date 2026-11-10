/* Banner "Calendario de igualás y ensayos" en la cabecera de vamolosnota.es
   Se carga desde "Código personalizado en el head" de IONOS. */
(function () {
  var URL_CAL = "https://www.vamolosnota.es/calendario-de-igualas-y-ensayos/";
  var URL_COSTAL = "https://www.vamolosnota.es/tienda-costales/Costal-Personalizado-a-Medida-en-Sevilla-p718578854/";
  // En la propia página del calendario, en vez del enlace al calendario sale el del Costal Personalizado a Medida
  var EN_CAL = location.pathname.indexOf("/calendario-de-igualas-y-ensayos") === 0;
  // En la tienda, en el móvil: sin banner del calendario y logo más pequeño, para que el costal y el botón de comprar salgan antes
  function enTienda() { return location.pathname.indexOf("/tienda-costales") === 0; }
  var CSS_TIENDA_MOVIL = "@media (max-width:999px){header .logo-image-container{width:84px!important;padding-bottom:84px!important;margin:0 auto 0 0!important}header .logo-image{width:84px!important;height:84px!important;max-height:84px!important}}";

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
    "#vln-cab.wa .b{background:#25D366;color:#0b3d1f!important}" +
    "#vln-cab.abs{position:absolute;z-index:50;width:620px;max-width:calc(100% - 32px)}" +
    "#vln-cab.mov{margin:10px 12px;padding:10px 12px;gap:10px;border-radius:12px}" +
    "#vln-cab.mov svg{flex-basis:40px;width:40px;height:40px}" +
    "#vln-cab.mov .h{font-size:17px}#vln-cab.mov .s,#vln-cab.mov .e{display:none}#vln-cab.mov .b{padding:8px 10px;font-size:13px}" +
    "@media (prefers-reduced-motion:reduce){#vln-cab{transition:none}#vln-cab:hover{transform:none}}";

  var ICONO = '<svg width="50" height="50" viewBox="0 0 58 58" aria-hidden="true"><rect x="3" y="8" width="52" height="47" rx="7" fill="#faf3e7"/><rect x="3" y="8" width="52" height="14" rx="7" fill="#6b2c1a"/><rect x="3" y="16" width="52" height="6" fill="#6b2c1a"/><rect x="15" y="3" width="5" height="11" rx="2.5" fill="#d4a574"/><rect x="38" y="3" width="5" height="11" rx="2.5" fill="#d4a574"/><circle cx="16" cy="33" r="5" fill="#c0392b"/><circle cx="29" cy="33" r="5" fill="#1f5fa8"/><circle cx="42" cy="33" r="5" fill="#2e8b57"/><circle cx="16" cy="46" r="5" fill="#7b3fa0"/><circle cx="29" cy="46" r="5" fill="#e6d9c4"/><circle cx="42" cy="46" r="5" fill="#c0392b"/></svg>';

  var ICONO_TIENDA = '<svg width="50" height="50" viewBox="0 0 58 58" aria-hidden="true"><circle cx="29" cy="29" r="26" fill="#d4a574"/><path d="M19 24h20l-2 20a3 3 0 0 1-3 3H24a3 3 0 0 1-3-3z" fill="#faf3e7"/><path d="M23 25v-4a6 6 0 0 1 12 0v4" fill="none" stroke="#4A2818" stroke-width="2.6" stroke-linecap="round"/><path d="M24 33h10M24 38h10" stroke="#6b2c1a" stroke-width="2.4" stroke-linecap="round"/></svg>';

  function crear() {
    var a = document.createElement("a");
    a.id = "vln-cab";
    if (EN_CAL) {
      a.href = URL_COSTAL;
      a.setAttribute("aria-label", "Costal Personalizado a Medida en Sevilla, desde 43 euros");
      a.innerHTML = ICONO_TIENDA + '<span class="t"><span class="e">COSTAL A MEDIDA · DESDE 43€</span><span class="h">¿Vas a alguna igualá este año? Hazte tu costal personalizado</span><span class="s">Hecho a mano en Sevilla · tú eliges la saca y la tela</span></span><span class="b">Ver costal ›</span>';
    } else {
      a.href = URL_CAL;
      a.setAttribute("aria-label", "Calendario de igualás y ensayos 2026-2027");
      a.innerHTML = ICONO + '<span class="t"><span class="e">TEMPORADA 2026 · 2027</span><span class="h">Calendario de igualás y ensayos</span><span class="s">Andalucía, Madrid, Castilla y Cataluña · se actualiza cada día</span></span><span class="b">Ver fechas ›</span>';
    }
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
      // Móvil/tablet en la tienda: no se pone el banner y se achica el logo
      if (enTienda()) {
        if (a.parentNode) a.parentNode.removeChild(a);
        if (!document.getElementById("vln-tienda-css")) {
          var st2 = document.createElement("style"); st2.id = "vln-tienda-css"; st2.textContent = CSS_TIENDA_MOVIL; document.head.appendChild(st2);
        }
        return;
      }
      var st3 = document.getElementById("vln-tienda-css"); if (st3) st3.parentNode.removeChild(st3);
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

  // En las fichas de la tienda: enlace "Ver telas y referencias" justo debajo de la casilla donde se escribe la tela
  var URL_TELAS = "https://www.vamolosnota.es/telas/";
  function enlaceTelas() {
    if (!enTienda()) return;
    var cajas = document.querySelectorAll(".details-product-option--textfield");
    for (var i = 0; i < cajas.length; i++) {
      var c = cajas[i];
      var tit = c.querySelector(".details-product-option__title");
      if (!tit || !/^\s*Tela\b/i.test(tit.textContent || "")) continue;
      if (c.querySelector(".vln-telas")) continue;
      var a = document.createElement("a");
      a.className = "vln-telas"; a.href = URL_TELAS; a.target = "_blank"; a.rel = "noopener";
      a.textContent = "Ver telas y sus referencias ›";
      a.style.cssText = "display:inline-block;margin-top:8px;padding:8px 12px;border-radius:8px;background:#d4a574;color:#4A2818;font:700 14px Arial,sans-serif;text-decoration:none";
      var ayuda = document.createElement("div");
      ayuda.className = "vln-telas-ayuda";
      ayuda.textContent = "Elige tu tela y escribe aquí su referencia (por ejemplo STOCK_0056) o el color si es lisa.";
      ayuda.style.cssText = "margin-top:6px;font:13px Arial,sans-serif;opacity:.85";
      c.appendChild(ayuda); c.appendChild(a);
    }
  }
  var pend;
  function vigilar() {
    enlaceTelas();
    if (!window.MutationObserver) return;
    new MutationObserver(function () { clearTimeout(pend); pend = setTimeout(enlaceTelas, 300); })
      .observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", vigilar); else vigilar();

  // Cookies: pasa a la tienda (Ecwid) lo que la persona eligió en el aviso de cookies de la web (Acepto / Rechazo).
  // Solo tiene efecto si en la tienda está activado el "banner de consentimiento de cookies".
  function respuestaWeb() {
    var m = document.cookie.match(/(?:^|; )gox_cookie_consent=([^;]*)/);
    if (!m) return null; // todavía no ha contestado
    var v = decodeURIComponent(m[1] || "");
    var analitica = v.indexOf("analytics") >= 0, tienda = v.indexOf("shops") >= 0;
    if (analitica && tienda) return "ACCEPTED";
    if (analitica) return "ANALYTICS_ONLY";
    return "DECLINED";
  }
  function sincronizar() {
    try {
      if (!window.Ecwid || !Ecwid.setTrackingConsent || !Ecwid.getTrackingConsent) return;
      var r = respuestaWeb(); if (!r) return;
      var actual = Ecwid.getTrackingConsent();
      if (!actual || !actual.askConsent) return; // la tienda no pide consentimiento: no se toca nada
      if (actual.userResponse !== r) Ecwid.setTrackingConsent(r);
    } catch (e) {}
  }
  function prepararConsentimiento() {
    if (window.Ecwid && Ecwid.OnAPILoaded) Ecwid.OnAPILoaded.add(sincronizar);
    document.addEventListener("click", function () { setTimeout(sincronizar, 600); }, true);
    var n = 0, t = setInterval(function () { sincronizar(); if (++n > 20) clearInterval(t); }, 1500);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", prepararConsentimiento); else prepararConsentimiento();
})();
