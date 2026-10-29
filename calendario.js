/* Calendario de igualás y ensayos · VamoLosNota */
(function () {
  var DATA_URL = "https://raw.githubusercontent.com/vamolosnotas-afk/calendario-costaleros/main/eventos.json";
  var WHATSAPP_CANAL = "";      // enlace del canal de WhatsApp cuando exista
  var WHATSAPP_AVISO = "https://wa.me/34692942182?text=" + encodeURIComponent("Hola, quiero avisaros de una igualá/ensayo: ");
  var TIENDA = "https://www.vamolosnota.es/tienda-costales/";
  var RESPALDO = [];

  var PROV = {
    sevilla: { n: "Sevilla", c: "#c0392b" },
    huelva:  { n: "Huelva",  c: "#1f5fa8" },
    granada: { n: "Granada", c: "#2e8b57" },
    cordoba: { n: "Córdoba", c: "#7b3fa0" }
  };
  var MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  var DIAS = ["L","M","X","J","V","S","D"];
  var INICIO = { y: 2026, m: 8 }, FIN = { y: 2027, m: 5 };   // sept 2026 → jun 2027
  var ESPECIALES = { "2027-02-10": "Miércoles de Ceniza", "2027-03-21": "Domingo de Ramos", "2027-03-28": "Domingo de Resurrección" };
  var MARRON = "#4A2818", CREMA = "#faf3e7", DORADO = "#d4a574", BURDEOS = "#6b2c1a";

  var root = document.getElementById("vln-cal");
  if (!root) return;
  root.style.boxSizing = "border-box";
  // Si IONOS lo mete en una columna estrecha, se estira hasta el ancho de su sección
  function ensanchar() {
    try {
      root.style.width = ""; root.style.marginLeft = ""; root.style.maxWidth = "";
      var vw = document.documentElement.clientWidth, objetivo = Math.min(940, vw - 24);
      var r = root.getBoundingClientRect();
      if (r.width >= objetivo - 4) return;
      var a = root.parentElement, caja = null;
      while (a && a !== document.body) { var w = a.getBoundingClientRect().width; if (w >= objetivo) { caja = a; break; } a = a.parentElement; }
      if (!caja) return;
      for (var b = root.parentElement; b && b !== caja; b = b.parentElement) {
        var cs = getComputedStyle(b); if (cs.overflowX !== "visible" || cs.overflow === "hidden") return;
      }
      var c = caja.getBoundingClientRect(), ancho = Math.min(objetivo, c.width - 16);
      var izq = c.left + (c.width - ancho) / 2;
      root.style.width = ancho + "px"; root.style.maxWidth = "none";
      root.style.marginLeft = (izq - r.left) + "px";
      root.style.position = "relative"; root.style.zIndex = "2";
    } catch (e) {}
  }
  var tEns; window.addEventListener("resize", function () { clearTimeout(tEns); tEns = setTimeout(ensanchar, 150); });
  var eventos = [], filtro = { sevilla: 1, huelva: 1, granada: 1, cordoba: 1 };
  var hoy = new Date(); var cur = { y: hoy.getFullYear(), m: hoy.getMonth() };
  if (cmp(cur, INICIO) < 0) cur = { y: INICIO.y, m: INICIO.m };
  if (cmp(cur, FIN) > 0) cur = { y: FIN.y, m: FIN.m };
  var diaSel = null;

  function cmp(a, b) { return (a.y - b.y) * 12 + (a.m - b.m); }
  function el(tag, st, txt) { var e = document.createElement(tag); if (st) e.setAttribute("style", st); if (txt != null) e.textContent = txt; return e; }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function key(y, m, d) { return y + "-" + pad(m + 1) + "-" + pad(d); }
  function fechaLarga(k) { var p = k.split("-"); var d = new Date(+p[0], +p[1] - 1, +p[2]);
    return ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"][d.getDay()] + " " + (+p[2]) + " de " + MESES[+p[1] - 1].toLowerCase(); }
  function visibles() { return eventos.filter(function (e) { return filtro[e.provincia]; }); }
  function porDia() { var o = {}; visibles().forEach(function (e) { (o[e.fecha] = o[e.fecha] || []).push(e); }); return o; }
  function tipoTxt(t) { return { "igualá": "Igualá", ensayo: "Ensayo", "mudá": "Mudá", retranqueo: "Retranqueo" }[t] || "Cita"; }

  function pintar() {
    root.innerHTML = "";
    var caja = el("div", "font-family:Georgia,'Times New Roman',serif;color:" + MARRON + ";background:" + CREMA + ";max-width:920px;margin:0 auto;padding:20px 14px 24px;border-radius:14px;box-sizing:border-box");
    root.appendChild(caja);
    ensanchar();

    caja.appendChild(el("div", "text-align:center;font-size:13px;letter-spacing:3px;color:" + BURDEOS + ";font-family:Arial,sans-serif;font-weight:bold", "TEMPORADA 2026 · 2027"));
    caja.appendChild(el("h2", "text-align:center;margin:6px 0 4px;font-size:28px;line-height:1.15;color:" + MARRON, "Calendario de igualás y ensayos"));
    caja.appendChild(el("div", "text-align:center;font-size:15px;margin-bottom:14px;font-style:italic", "Cuadrillas a costal de Sevilla, Huelva, Granada y Córdoba"));

    // leyenda / filtros
    var ley = el("div", "display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin-bottom:16px");
    Object.keys(PROV).forEach(function (k) {
      var on = filtro[k];
      var b = el("button", "cursor:pointer;border:2px solid " + PROV[k].c + ";background:" + (on ? PROV[k].c : "#fff") + ";color:" + (on ? "#fff" : PROV[k].c) + ";border-radius:20px;padding:6px 14px;font:bold 14px Arial,sans-serif", PROV[k].n);
      b.onclick = function () { filtro[k] = on ? 0 : 1; pintar(); };
      ley.appendChild(b);
    });
    caja.appendChild(ley);

    // navegación de mes
    var nav = el("div", "display:flex;align-items:center;justify-content:space-between;margin-bottom:10px");
    var bs = "cursor:pointer;border:none;background:" + MARRON + ";color:" + CREMA + ";border-radius:8px;width:44px;height:40px;font-size:20px;flex:0 0 44px";
    var prev = el("button", bs + (cmp(cur, INICIO) <= 0 ? ";opacity:.3;cursor:default" : ""), "‹");
    var next = el("button", bs + (cmp(cur, FIN) >= 0 ? ";opacity:.3;cursor:default" : ""), "›");
    prev.setAttribute("aria-label", "Mes anterior"); next.setAttribute("aria-label", "Mes siguiente");
    prev.onclick = function () { if (cmp(cur, INICIO) > 0) { cur.m--; if (cur.m < 0) { cur.m = 11; cur.y--; } diaSel = null; pintar(); } };
    next.onclick = function () { if (cmp(cur, FIN) < 0) { cur.m++; if (cur.m > 11) { cur.m = 0; cur.y++; } diaSel = null; pintar(); } };
    nav.appendChild(prev); nav.appendChild(el("div", "font-size:22px;font-weight:bold;text-align:center;flex:1;min-width:0;line-height:1.1", MESES[cur.m] + " " + cur.y)); nav.appendChild(next);
    caja.appendChild(nav);

    // rejilla
    var mapa = porDia();
    var grid = el("div", "display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:4px");
    DIAS.forEach(function (d) { grid.appendChild(el("div", "text-align:center;font:bold 12px Arial,sans-serif;color:" + BURDEOS + ";padding:4px 0", d)); });
    var primero = (new Date(cur.y, cur.m, 1).getDay() + 6) % 7, nd = new Date(cur.y, cur.m + 1, 0).getDate();
    for (var i = 0; i < primero; i++) grid.appendChild(el("div"));
    var hk = key(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    for (var d = 1; d <= nd; d++) (function (d) {
      var k = key(cur.y, cur.m, d), evs = mapa[k] || [];
      var provs = []; evs.forEach(function (e) { if (provs.indexOf(e.provincia) < 0) provs.push(e.provincia); });
      var fondo = "#fff", color = MARRON;
      if (provs.length === 1) { fondo = PROV[provs[0]].c; color = "#fff"; }
      else if (provs.length > 1) { var paso = 100 / provs.length, g = [];
        provs.forEach(function (p, j) { g.push(PROV[p].c + " " + (j * paso) + "% " + ((j + 1) * paso) + "%"); });
        fondo = "linear-gradient(135deg," + g.join(",") + ")"; color = "#fff"; }
      var borde = k === diaSel ? "3px solid " + MARRON : (k === hk ? "2px solid " + DORADO : "1px solid #e6d9c4");
      var c = el("div", "position:relative;height:clamp(42px,10vw,68px);min-width:0;overflow:hidden;border-radius:8px;background:" + fondo + ";color:" + color + ";border:" + borde + ";box-sizing:border-box;padding:4px;font:bold 15px Arial,sans-serif;" + (evs.length ? "cursor:pointer" : ""), String(d));
      if (evs.length > 1) c.appendChild(el("span", "position:absolute;right:4px;bottom:3px;font-size:11px;background:rgba(0,0,0,.35);border-radius:8px;padding:0 5px", String(evs.length)));
      if (ESPECIALES[k]) { c.title = ESPECIALES[k]; c.appendChild(el("span", "position:absolute;left:4px;bottom:3px;width:7px;height:7px;border-radius:50%;background:" + DORADO)); }
      if (evs.length) c.onclick = function () { diaSel = diaSel === k ? null : k; pintar(); };
      grid.appendChild(c);
    })(d);
    caja.appendChild(grid);

    // detalle del día
    if (diaSel && mapa[diaSel]) {
      var det = el("div", "margin-top:14px;background:#fff;border-radius:10px;padding:14px;border-left:5px solid " + MARRON);
      det.appendChild(el("div", "font-size:19px;font-weight:bold;margin-bottom:8px", fechaLarga(diaSel) + (ESPECIALES[diaSel] ? " · " + ESPECIALES[diaSel] : "")));
      mapa[diaSel].sort(function (a, b) { return (a.hora || "99").localeCompare(b.hora || "99"); }).forEach(function (e) { det.appendChild(tarjeta(e, false)); });
      caja.appendChild(det);
    } else {
      caja.appendChild(el("div", "text-align:center;font:13px Arial,sans-serif;margin-top:10px;opacity:.8", "Pulsa un día marcado para ver la igualá o el ensayo"));
    }

    // próximas citas (texto, útil también para Google)
    var futuros = visibles().filter(function (e) { return e.fecha >= hk; }).sort(function (a, b) { return (a.fecha + (a.hora || "")).localeCompare(b.fecha + (b.hora || "")); });
    var lista = el("div", "margin-top:22px");
    lista.appendChild(el("h3", "font-size:21px;margin:0 0 10px;border-bottom:2px solid " + DORADO + ";padding-bottom:6px", "Próximas igualás y ensayos"));
    if (!futuros.length) lista.appendChild(el("div", "font:14px Arial,sans-serif", "Aún no hay citas publicadas para estas provincias. Cada mañana revisamos las webs y redes oficiales de las hermandades."));
    futuros.slice(0, 12).forEach(function (e) { lista.appendChild(tarjeta(e, true)); });
    caja.appendChild(lista);

    // llamadas a la acción
    var cta = el("div", "display:flex;flex-wrap:wrap;gap:10px;margin-top:20px");
    if (WHATSAPP_CANAL) cta.appendChild(boton("Recibe las nuevas igualás en WhatsApp", WHATSAPP_CANAL, "#25a244"));
    cta.appendChild(boton("¿Falta tu igualá? Avísanos", WHATSAPP_AVISO, MARRON));
    cta.appendChild(boton("Costales desde 39 € · Ver tienda", TIENDA, BURDEOS));
    caja.appendChild(cta);

    caja.appendChild(el("div", "font:12px Arial,sans-serif;margin-top:16px;opacity:.75;line-height:1.5",
      "Fechas publicadas por las propias hermandades en sus webs y redes oficiales; cada cita enlaza a la publicación original. Pueden cambiar: confírmalas siempre con tu hermandad o tu capataz."));
  }

  function tarjeta(e, conFecha) {
    var p = PROV[e.provincia] || { n: e.provincia, c: MARRON };
    var t = el("div", "background:#fff;border-radius:10px;padding:10px 12px;margin-bottom:8px;border-left:5px solid " + p.c + ";font-family:Arial,sans-serif");
    var cab = el("div", "display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-bottom:4px");
    cab.appendChild(el("span", "background:" + p.c + ";color:#fff;border-radius:10px;padding:1px 8px;font-size:12px;font-weight:bold", p.n));
    cab.appendChild(el("span", "font-size:12px;font-weight:bold;color:" + BURDEOS + ";text-transform:uppercase;letter-spacing:1px", tipoTxt(e.tipo) + (e.paso ? " · " + e.paso : "")));
    t.appendChild(cab);
    t.appendChild(el("div", "font:bold 16px Georgia,serif;color:" + MARRON, e.hermandad + (e.localidad && e.localidad !== p.n ? " (" + e.localidad + ")" : "")));
    var linea = [];
    if (conFecha) linea.push(fechaLarga(e.fecha));
    if (e.hora) linea.push(e.hora + " h");
    if (e.lugar) linea.push(e.lugar);
    if (linea.length) t.appendChild(el("div", "font-size:14px;margin-top:2px", linea.join(" · ")));
    if (e.capataz) t.appendChild(el("div", "font-size:13px;opacity:.85", "Capataz: " + e.capataz));
    if (e.titulo) t.appendChild(el("div", "font-size:13px;margin-top:2px;opacity:.85", e.titulo));
    if (e.fuente) { var a = el("a", "font-size:12px;color:" + BURDEOS, "Ver fuente" + (e.fuente_nombre ? " (" + e.fuente_nombre + ")" : ""));
      a.href = e.fuente; a.target = "_blank"; a.rel = "noopener nofollow"; t.appendChild(a); }
    else if (e.fuente_nombre) t.appendChild(el("div", "font-size:12px;color:" + BURDEOS, "Fuente: " + e.fuente_nombre));
    return t;
  }
  function boton(txt, url, c) { var a = el("a", "flex:1 1 220px;text-align:center;text-decoration:none;background:" + c + ";color:#fff;border-radius:10px;padding:12px;font:bold 14px Arial,sans-serif", txt); a.href = url; a.target = "_blank"; a.rel = "noopener"; return a; }

  function arrancar(datos) { eventos = (datos || []).filter(function (e) { return e && e.fecha && PROV[e.provincia]; }); pintar(); }
  if (DATA_URL) {
    fetch(DATA_URL + (DATA_URL.indexOf("?") < 0 ? "?" : "&") + "v=" + Date.now()).then(function (r) { return r.json(); })
      .then(function (j) { arrancar(j.eventos || j); }).catch(function () { arrancar(RESPALDO); });
  } else arrancar(RESPALDO);
})();
