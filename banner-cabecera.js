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
      var izq = Infinity, abajo = -Infinity; // -Infinity: si la página carga ya bajada, los enlaces quedan por encima de 0
      links.forEach(function (x) { var r = x.getBoundingClientRect(); izq = Math.min(izq, r.left); abajo = Math.max(abajo, r.bottom); });
      if (!isFinite(izq) || !isFinite(abajo)) { izq = hr.left + hr.width * 0.3; abajo = hr.top + hr.height * 0.4; }
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

  // Las animaciones de entrada de IONOS meten los bloques 50px por la derecha antes de aparecer
  // y eso hace la página más ancha que el móvil (se mueve de lado). Se recorta lo que sobresale.
  if (!document.getElementById("vln-anchura-css")) {
    var sa = document.createElement("style"); sa.id = "vln-anchura-css";
    sa.textContent = "html,body{overflow-x:clip!important}@supports not (overflow-x:clip){body{overflow-x:hidden!important}}";
    (document.head || document.documentElement).appendChild(sa);
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
      ayuda.textContent = "Elige tu tela y escribe aquí su referencia (por ejemplo STOCK_0056) o el color si es lisa. Si no lo tienes claro, déjalo en blanco: te escribimos para elegirla contigo.";
      ayuda.style.cssText = "margin-top:6px;font:13px Arial,sans-serif;opacity:.85";
      c.appendChild(ayuda); c.appendChild(a);
    }
    try { selectorTela(); } catch (e) { /* si falla, queda la casilla de texto normal */ }
  }

  // Costal Personalizado a Medida: desplegable con las telas de stock (como el de Tela Lisa del Costal Clásico).
  // La primera opción es "Otra tela", que abre la casilla para escribirla. Lo elegido se guarda en la casilla
  // de texto original de la tienda, que es la que llega al pedido.
  // La lista se actualiza sola desde /telas/; REFS_STOCK solo se usa mientras carga o si /telas/ falla.
  var RE_FICHA_TELA = /-p718578854(\/|$)/, OTRA_TELA = "Otra tela", telaElegida = "", telasPedidas = false;
  var REFS_STOCK = (function () {
    var r = [], n;
    function p(x) { return "STOCK_" + ("000" + x).slice(-4); }
    for (n = 51; n <= 87; n++) r.push(p(n));
    for (n = 88; n <= 97; n++) r.push(p(n) + "K");
    for (n = 98; n <= 102; n++) r.push(p(n) + "M");
    for (n = 103; n <= 105; n++) r.push(p(n) + "K");
    return r;
  })();
  function ponerValorTela(inp, v) {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(inp, v);
    inp.dispatchEvent(new Event("input", { bubbles: true }));
    inp.dispatchEvent(new Event("change", { bubbles: true }));
  }
  function llenarSelectTela(sel, val) {
    sel.innerHTML = "";
    ["", OTRA_TELA].concat(REFS_STOCK).forEach(function (r) {
      var o = document.createElement("option");
      o.value = r; o.textContent = r || "Por favor, seleccione";
      sel.appendChild(o);
    });
    sel.value = val || "";
  }
  function pedirTelas() {
    if (telasPedidas || !window.fetch) return;
    telasPedidas = true;
    fetch("/telas/").then(function (r) { return r.ok ? r.text() : ""; }).then(function (h) {
      var m = h.replace(/por ejemplo\s+STOCK_\d+/gi, "").match(/STOCK_\d{4}[A-Z]?/g) || [], vistas = {}, l = [];
      m.forEach(function (x) { if (!vistas[x]) { vistas[x] = 1; l.push(x); } });
      if (l.length < 20) return;
      REFS_STOCK = l.sort();
      var w = document.querySelector(".vln-sel-tela select");
      if (!w) return;
      var v = w.value;
      if (v && v !== OTRA_TELA && !vistas[v]) { v = ""; w.dispatchEvent(new Event("vln-reset")); }
      llenarSelectTela(w, v);
    }).catch(function () {});
  }
  function selectorTela() {
    if (!RE_FICHA_TELA.test(location.pathname)) { telaElegida = ""; return; }
    var c = document.querySelector('.details-product-option--textfield[class*="details-product-option--Tela"]');
    if (!c || c.querySelector(".vln-sel-tela")) return;
    var modelo = document.querySelector(".details-product-option--select .form-control--select");
    var caja = c.querySelector(".product-details-module__content");
    var inp = caja && caja.querySelector("input");
    var tit = c.querySelector(".details-product-option__title");
    if (!modelo || !inp || !tit) return;

    var ctl = modelo.cloneNode(true);
    ctl.removeAttribute("id");
    ctl.className = "form-control form-control--flexible form-control--empty form-control--select";
    var vis = ctl.querySelector("input"), sel = ctl.querySelector("select");
    vis.removeAttribute("name"); vis.value = ""; vis.setAttribute("aria-label", "Selecciona tela");
    sel.setAttribute("aria-label", "Selecciona tela");
    var w = document.createElement("div");
    w.className = "vln-sel-tela";
    w.appendChild(ctl);
    c.insertBefore(w, caja);

    function pintar(v) {
      vis.value = v;
      ctl.classList.toggle("form-control--empty", !v);
      var otra = v === OTRA_TELA;
      caja.style.display = otra ? "" : "none";
      caja.style.marginTop = otra ? "8px" : "";
    }
    var actual = inp.value || "", ini = "";
    if (REFS_STOCK.indexOf(actual) >= 0) ini = actual;
    else if (actual || telaElegida === OTRA_TELA) ini = OTRA_TELA;
    llenarSelectTela(sel, ini);
    pintar(ini);
    sel.addEventListener("change", function () {
      var v = sel.value;
      telaElegida = v;
      pintar(v);
      ponerValorTela(inp, v === OTRA_TELA ? "" : v);
      if (v === OTRA_TELA) inp.focus();
    });
    sel.addEventListener("vln-reset", function () { telaElegida = ""; pintar(""); ponerValorTela(inp, ""); });

    var ph = caja.querySelector(".form-control__placeholder-inner");
    if (ph) ph.textContent = "Escribe la referencia o el color de la tela";
    for (var n = tit.firstChild; n; n = n.nextSibling) {
      if (n.nodeType === 3 && /\S/.test(n.nodeValue)) { n.nodeValue = "Selecciona tela"; break; }
    }
    var ayuda = c.querySelector(".vln-telas-ayuda");
    if (ayuda) ayuda.textContent = "Elige la referencia de tu tela. Si quieres una lisa u otra distinta, pulsa «Otra tela» y escríbela. Si no lo tienes claro, déjalo sin elegir: te escribimos para elegirla contigo.";
    pedirTelas();
  }
  var pend;
  function vigilar() {
    enlaceTelas();
    if (!window.MutationObserver) return;
    new MutationObserver(function () { clearTimeout(pend); pend = setTimeout(enlaceTelas, 300); })
      .observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", vigilar); else vigilar();

  // Botón flotante de WhatsApp en todas las páginas (abajo a la derecha)
  var WA_TEL = "34692942182";
  function textoWA() {
    var t = "Hola, quiero información sobre un costal";
    if (enTienda()) {
      var h1 = document.querySelector("h1");
      var nom = h1 && (h1.textContent || "").trim();
      if (nom && nom.length < 90) t = "Hola, tengo una duda sobre el " + nom;
    }
    return t;
  }
  function urlWA() { return "https://wa.me/" + WA_TEL + "?text=" + encodeURIComponent(textoWA()); }
  function marcarClic(donde) {
    try { if (window.gtag) window.gtag("event", "click_whatsapp", { lugar: donde, pagina: location.pathname }); } catch (e) {}
  }
  var ICONO_WA = '<svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true"><path fill="#fff" d="M16 3C8.8 3 3 8.7 3 15.8c0 2.3.6 4.5 1.8 6.4L3 29l7-1.8c1.8 1 3.9 1.5 6 1.5 7.2 0 13-5.7 13-12.8S23.2 3 16 3zm0 23.4c-1.9 0-3.8-.5-5.4-1.5l-.4-.2-4.2 1.1 1.1-4-.3-.4c-1.1-1.7-1.6-3.6-1.6-5.6C5.2 9.9 10 5.2 16 5.2s10.8 4.7 10.8 10.6S22 26.4 16 26.4zm5.9-7.9c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.3.3-.6.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.7s1.2 3.2 1.4 3.4c.2.2 2.4 3.6 5.8 5 .8.3 1.4.5 1.9.7.8.3 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z"/></svg>';
  function botonWA() {
    if (document.getElementById("vln-wa")) return;
    var st = document.createElement("style"); st.id = "vln-wa-css";
    st.textContent =
      "#vln-wa{position:fixed;right:16px;bottom:18px;z-index:2147483000;display:flex;align-items:center;gap:8px;background:#25D366;color:#fff!important;text-decoration:none!important;border-radius:999px;padding:12px 16px 12px 13px;font:700 15px Arial,sans-serif;box-shadow:0 6px 18px rgba(0,0,0,.28);transition:transform .15s ease}" +
      "#vln-wa:hover{transform:scale(1.05)}#vln-wa:focus-visible{outline:3px solid #4A2818;outline-offset:2px}" +
      "@media (max-width:600px){#vln-wa{right:12px;bottom:14px;padding:11px 14px 11px 11px;font-size:14px}}" +
      "@media print{#vln-wa{display:none}}";
    document.head.appendChild(st);
    var a = document.createElement("a");
    a.id = "vln-wa"; a.target = "_blank"; a.rel = "noopener";
    a.setAttribute("aria-label", "Escríbenos por WhatsApp");
    a.innerHTML = ICONO_WA + "<span>¿Dudas? WhatsApp</span>";
    a.href = urlWA();
    a.addEventListener("click", function () { a.href = urlWA(); marcarClic("flotante"); });
    document.body.appendChild(a);
    ocultarConCookies();
    var n = 0, iv = setInterval(function () { ocultarConCookies(); if (++n > 300) clearInterval(iv); }, 1000);
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", ocultarConCookies);
      window.visualViewport.addEventListener("scroll", ocultarConCookies);
    }
    window.addEventListener("resize", ocultarConCookies);
    window.addEventListener("scroll", ocultarConCookies, { passive: true });
  }
  // Coloca el botón en la esquina de lo que se VE en pantalla (aunque la página sea más ancha que el móvil)
  // y, si está el aviso de cookies abajo, lo sube encima para no taparlo
  function ocultarConCookies() {
    var a = document.getElementById("vln-wa"); if (!a) return;
    var vv = window.visualViewport;
    var vLeft = vv ? vv.offsetLeft : 0, vTop = vv ? vv.offsetTop : 0;
    var vW = vv ? vv.width : document.documentElement.clientWidth, vH = vv ? vv.height : window.innerHeight;
    var margen = vW <= 600 ? 12 : 16;
    var limite = vTop + vH;
    var c = document.querySelector(".consent-banner-root");
    if (c) {
      var cs = getComputedStyle(c), r = c.getBoundingClientRect();
      if (cs.display !== "none" && cs.visibility !== "hidden" && r.height > 0 && r.top < limite) limite = r.top;
    }
    a.style.right = "auto"; a.style.bottom = "auto";
    a.style.left = Math.round(vLeft + vW - a.offsetWidth - margen) + "px";
    a.style.top = Math.round(limite - a.offsetHeight - margen) + "px";
  }
  // En las fichas: aviso de WhatsApp junto a la casilla de la tela
  function ayudaTelaWA() {
    if (!enTienda()) return;
    var enl = document.querySelectorAll(".vln-telas");
    for (var i = 0; i < enl.length; i++) {
      var c = enl[i].parentNode;
      if (c.querySelector(".vln-tela-wa")) continue;
      var w = document.createElement("a");
      w.className = "vln-tela-wa"; w.target = "_blank"; w.rel = "noopener";
      w.textContent = "¿No lo tienes claro? Te ayudamos a elegir por WhatsApp ›";
      w.href = urlWA();
      w.addEventListener("click", function (ev) { ev.currentTarget.href = urlWA(); marcarClic("tela"); });
      w.style.cssText = "display:block;margin-top:8px;color:#25D366;font:700 14px Arial,sans-serif;text-decoration:underline";
      c.appendChild(w);
    }
  }
  function iniciarWA() {
    botonWA(); ayudaTelaWA();
    if (window.MutationObserver) {
      var p2;
      new MutationObserver(function () { clearTimeout(p2); p2 = setTimeout(function () { ayudaTelaWA(); ocultarConCookies(); }, 300); })
        .observe(document.body, { childList: true, subtree: true });
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciarWA); else iniciarWA();

  // En las fichas de producto: valoración de Google justo debajo del precio (solo ahí, para no saturar)
  var RESENAS = { nota: "5,0", total: 103, url: "https://maps.app.goo.gl/heTVCES96z8JMJCPA" };
  function resenasFicha() {
    if (!enTienda()) return;
    if (!document.querySelector(".ec-store__product-page")) return;
    var precio = document.querySelector(".product-details__product-price");
    if (!precio || document.querySelector(".vln-resenas")) return;
    var a = document.createElement("a");
    a.className = "vln-resenas"; a.href = RESENAS.url; a.target = "_blank"; a.rel = "noopener";
    a.innerHTML = '<span style="color:#f5b301;letter-spacing:1px" aria-hidden="true">★★★★★</span> ' +
      '<b>' + RESENAS.nota + '</b> en Google · ' + RESENAS.total + ' reseñas ›';
    a.setAttribute("aria-label", "Valoración " + RESENAS.nota + " en Google con " + RESENAS.total + " reseñas");
    a.style.cssText = "display:inline-block;margin:6px 0 4px;font:14px Arial,sans-serif;color:inherit;text-decoration:none;opacity:.95";
    a.addEventListener("click", function () { marcarClic("resenas-ficha"); });
    precio.parentNode.insertBefore(a, precio.nextSibling);
  }
  // En las fichas: cuánto tarda en llegar, debajo del precio (no en la tarjeta regalo)
  function plazoFicha() {
    if (!enTienda() || !document.querySelector(".ec-store__product-page")) return;
    var precio = document.querySelector(".product-details__product-price");
    if (!precio || precio.parentNode.querySelector(".vln-plazo")) return;
    var h1 = document.querySelector("h1");
    if (h1 && /tarjeta regalo/i.test(h1.textContent || "")) return;
    var d = document.createElement("div");
    d.className = "vln-plazo";
    d.innerHTML = "Lo hacemos a mano en <b>2-3 días</b> y te llega en <b>48/72h</b>";
    d.style.cssText = "margin:4px 0 6px;font:14px Arial,sans-serif;opacity:.95";
    var tras = precio.parentNode.querySelector(".vln-resenas") || precio;
    tras.parentNode.insertBefore(d, tras.nextSibling);
  }
  // En las fichas: si la tienda no tiene reseñas propias, se oculta el bloque "Aún no hay reseñas"
  function ocultarResenasVacias() {
    if (!enTienda()) return;
    var bl = document.querySelectorAll(".review-block");
    for (var i = 0; i < bl.length; i++) {
      if (/Aún no hay reseñas/i.test(bl[i].textContent || "")) bl[i].style.display = "none";
    }
  }
  // En las galerías de productos (página de inicio): quitar el código " | 00002" del final del nombre
  function quitarCodigos() {
    var t = document.querySelectorAll(".product-gallery-text-detail");
    for (var i = 0; i < t.length; i++) {
      var e = t[i];
      if (e.children.length) continue;
      var s = e.textContent || "";
      var n = s.replace(/\s*\|\s*\d{4,6}\s*$/, "");
      if (n !== s && n.trim()) e.textContent = n;
    }
  }
  // En la cesta: casilla de "Estoy de acuerdo con Términos" más grande en el móvil (es muy pequeña para el dedo)
  var CSS_CHECK = "@media (max-width:999px){.ec-store .form-control--checkbox .form-control__checkbox-wrap{transform:scale(1.35);transform-origin:left center;margin-right:6px}}";
  function iniciarFichas() {
    if (!document.getElementById("vln-check-css")) {
      var sc = document.createElement("style"); sc.id = "vln-check-css"; sc.textContent = CSS_CHECK; document.head.appendChild(sc);
    }
    var todo = function () { resenasFicha(); plazoFicha(); ocultarResenasVacias(); quitarCodigos(); };
    todo();
    if (window.MutationObserver) {
      var p3;
      new MutationObserver(function () { clearTimeout(p3); p3 = setTimeout(todo, 300); })
        .observe(document.body, { childList: true, subtree: true });
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciarFichas); else iniciarFichas();

  // Cabecera más baja en el móvil (todas las páginas): logo más pequeño y carrito a la altura del menú
  var CSS_CAB_MOVIL = "@media (max-width:999px){" +
    "header .logo-image-container{width:84px!important;padding-bottom:84px!important;margin:0 auto 0 0!important}" +
    "header .logo-image{width:84px!important;height:84px!important;max-height:84px!important}" +
    "header .grid-row-top-level>.grid-row-root>.grid-column-root{padding-top:8px!important;padding-bottom:8px!important}" +
    "header .grid-row-top-level>.grid-row-root:nth-child(2){margin-top:-72px!important;pointer-events:none}" +
    "header .grid-row-top-level>.grid-row-root:nth-child(2)>.grid-column-root{padding-right:64px!important}" +
    "header .grid-row-top-level>.grid-row-root:nth-child(2) a,header .grid-row-top-level>.grid-row-root:nth-child(2) button{pointer-events:auto}}";
  (function () {
    if (document.getElementById("vln-cabmovil-css")) return;
    var s = document.createElement("style"); s.id = "vln-cabmovil-css"; s.textContent = CSS_CAB_MOVIL;
    (document.head || document.documentElement).appendChild(s);
  })();

  // Página de inicio: dos botones grandes justo debajo del título (Comprar / Presupuesto por WhatsApp)
  var CSS_CTA =
    "#vln-cta{display:flex;flex-wrap:wrap;justify-content:center;gap:12px;margin:8px auto 24px;max-width:620px;padding:0 12px;box-sizing:border-box}" +
    "#vln-cta a{flex:1 1 240px;display:flex;align-items:center;justify-content:center;gap:8px;min-height:54px;padding:14px 18px;border-radius:12px;font:700 17px Arial,sans-serif;text-decoration:none!important;box-sizing:border-box;box-shadow:0 6px 16px rgba(0,0,0,.25);transition:transform .15s ease}" +
    "#vln-cta a:hover{transform:translateY(-2px)}#vln-cta a:focus-visible{outline:3px solid #faf3e7;outline-offset:2px}" +
    "#vln-cta .c{background:#d4a574;color:#4A2818!important}" +
    "#vln-cta .w{background:#25D366;color:#fff!important}" +
    "@media (prefers-reduced-motion:reduce){#vln-cta a{transition:none}#vln-cta a:hover{transform:none}}";
  function botonesInicio() {
    if (location.pathname !== "/" || document.getElementById("vln-cta")) return;
    var sub = [].slice.call(document.querySelectorAll("main p, main h2, main div")).filter(function (e) {
      return /^Hechos a mano y a medida/.test((e.textContent || "").trim()) && e.children.length < 4;
    }).pop();
    var mod = sub && sub.closest(".module-container-root");
    if (!mod) return;
    if (!document.getElementById("vln-cta-css")) {
      var st = document.createElement("style"); st.id = "vln-cta-css"; st.textContent = CSS_CTA; document.head.appendChild(st);
    }
    var d = document.createElement("div"); d.id = "vln-cta";
    var c = document.createElement("a");
    c.className = "c"; c.href = "https://www.vamolosnota.es/tienda-costales/"; c.textContent = "Comprar mi costal ›";
    c.addEventListener("click", function () { marcarClic("inicio-comprar"); });
    var w = document.createElement("a");
    w.className = "w"; w.target = "_blank"; w.rel = "noopener";
    w.href = "https://wa.me/" + WA_TEL + "?text=" + encodeURIComponent("Hola, quiero pedir presupuesto para un costal");
    w.innerHTML = ICONO_WA.replace('width="30" height="30"', 'width="24" height="24"') + "<span>Pedir presupuesto por WhatsApp</span>";
    w.addEventListener("click", function () { marcarClic("inicio-presupuesto"); });
    d.appendChild(c); d.appendChild(w);
    mod.parentNode.insertBefore(d, mod.nextSibling);
  }
  // Página de inicio: textos que se quedan viejos
  // - número de reseñas de Google: sale de RESENAS.total (el mismo de las fichas), así solo se cambia en un sitio
  // - "por 6 €": mientras dure el envío gratis (misma fecha que la cinta de arriba) pone "gratis"
  var FIN_ENVIO_GRATIS = new Date("2026-12-01T00:00:00+01:00");
  function textosInicio() {
    if (location.pathname !== "/") return;
    var els = document.querySelectorAll("main strong, main div");
    for (var i = 0; i < els.length; i++) {
      var e = els[i];
      if (e.children.length) continue;
      var t = e.textContent || "";
      if (/^\s*\d+ opiniones\s*$/.test(t) && e.parentNode && /Basado en/.test(e.parentNode.textContent || "")) {
        e.textContent = RESENAS.total + " opiniones";
      } else if (new Date() < FIN_ENVIO_GRATIS && /en 48\/72h por 6 €/.test(t)) {
        e.textContent = t.replace("en 48/72h por 6 €", "en 48/72h con envío GRATIS");
      }
    }
  }
  function iniciarInicio() {
    botonesInicio(); textosInicio();
    setTimeout(function () { botonesInicio(); textosInicio(); }, 1000);
    setTimeout(function () { botonesInicio(); textosInicio(); }, 3000);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciarInicio); else iniciarInicio();
})();
