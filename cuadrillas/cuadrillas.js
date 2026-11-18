/* Página "Costales para cuadrillas y hermandades" · VamoLosNota
   Se carga desde un módulo HTML de IONOS:  <div id="vln-cuadrillas"></div> + script
   El formulario se envía por correo a info@vamolosnota.es mediante FormSubmit (con adjuntos). */
(function () {
  var BASE = "https://cdn.jsdelivr.net/gh/vamolosnotas-afk/calendario-costaleros@main/cuadrillas/";
  var FONDO = BASE + "fondo-cuadrilla.jpg";
  var PLANTILLA = BASE + "plantilla-cuadrilla-vamolosnota.xlsx";
  var DESTINO = "https://formsubmit.co/info@vamolosnota.es";
  var WHATSAPP = "https://wa.me/34692942182?text=" + encodeURIComponent("Hola, quiero presupuesto de costales para una cuadrilla completa.");
  var MAX_MB = 9;

  var root = document.getElementById("vln-cuadrillas");
  if (!root) return;
  var enviado = /[?&]enviado=1/.test(location.search);
  var vuelta = location.origin + location.pathname + "?enviado=1#vln-cuadrillas";

  var CSS =
    "#vln-cuadrillas{position:relative;box-sizing:border-box;width:100%;margin:0;border-radius:6px;font-family:Georgia,'Times New Roman',serif;color:#f5e6c8;overflow:hidden}" +
    "#vln-cuadrillas *,#vln-cuadrillas *::before,#vln-cuadrillas *::after{box-sizing:border-box}" +
    "#vln-cuadrillas .fondo{position:absolute;inset:0;background:#b48a61 url('" + FONDO + "') center top/cover no-repeat;filter:blur(3px);transform:scale(1.04)}" +
    "#vln-cuadrillas .velo{position:absolute;inset:0;background:linear-gradient(180deg,rgba(28,14,2,.32) 0%,rgba(74,40,24,.45) 38%,rgba(180,138,97,.92) 78%,#b48a61 100%)}" +
    "#vln-cuadrillas .in{position:relative;max-width:900px;margin:0 auto;padding:46px 16px 54px}" +
    "#vln-cuadrillas .cab{text-align:center;padding:10px 6px 30px;text-shadow:0 2px 10px rgba(0,0,0,.55)}" +
    "#vln-cuadrillas .badge{display:inline-block;font:700 11px Arial,sans-serif;letter-spacing:2.5px;text-transform:uppercase;color:#f0b84a;border:1px solid rgba(240,184,74,.6);background:rgba(28,14,2,.45);padding:5px 12px;border-radius:3px;margin-bottom:16px;text-shadow:none}" +
    "#vln-cuadrillas h1,#vln-cuadrillas h2.t{font-family:Georgia,'Times New Roman',serif;font-weight:normal;font-size:40px;line-height:1.15;color:#faf3e7;margin:0 0 12px}" +
    "#vln-cuadrillas h1 em,#vln-cuadrillas h2.t em{color:#f0b84a}" +
    "#vln-cuadrillas .lead{font:17px/1.55 Arial,sans-serif;color:#faf3e7;max-width:640px;margin:0 auto}" +
    "#vln-cuadrillas .pts{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin:26px 0 0;padding:0;list-style:none}" +
    "#vln-cuadrillas .pts li{background:rgba(28,14,2,.62);border:1px solid rgba(212,165,116,.55);border-radius:12px;padding:12px 14px;font:14px/1.35 Arial,sans-serif;color:#faf3e7;flex:1 1 180px;max-width:205px;text-shadow:none}" +
    "#vln-cuadrillas .pts b{display:block;font:700 15px Georgia,serif;color:#f0b84a;margin-bottom:3px}" +
    "#vln-cuadrillas .card{background:#1c0e02;border-radius:4px;box-shadow:0 18px 40px rgba(28,14,2,.45);overflow:hidden}" +
    "#vln-cuadrillas .card::before{content:'';display:block;height:4px;background:repeating-linear-gradient(90deg,#c8860a 0 20px,#8b5c00 20px 40px)}" +
    "#vln-cuadrillas .sec{padding:24px 36px;border-bottom:.5px solid rgba(200,134,10,.22)}" +
    "#vln-cuadrillas .sec:last-child{border-bottom:0}" +
    "#vln-cuadrillas .st{font:700 11px Arial,sans-serif;letter-spacing:1.8px;text-transform:uppercase;color:#c8860a;margin:0 0 14px}" +
    "#vln-cuadrillas .g{display:grid;grid-template-columns:1fr 1fr;gap:14px 16px}" +
    "#vln-cuadrillas .full{grid-column:1/-1}" +
    "#vln-cuadrillas label.l{display:block;font:700 13px Arial,sans-serif;color:#f5e6c8;margin-bottom:6px}" +
    "#vln-cuadrillas label.l i{font-style:normal;color:#e8a832}" +
    "#vln-cuadrillas .ayuda{display:block;font:12px/1.4 Arial,sans-serif;color:#9a7a50;margin-top:5px}" +
    "#vln-cuadrillas .ayuda a{color:#e8a832}" +
    "#vln-cuadrillas input[type=text],#vln-cuadrillas input[type=tel],#vln-cuadrillas input[type=email],#vln-cuadrillas input[type=number],#vln-cuadrillas select,#vln-cuadrillas textarea{width:100%;font:15px Arial,sans-serif;color:#2a1608;background:#f5e6c8;border:1.5px solid #f5e6c8;border-radius:8px;padding:11px 12px;outline:none;margin:0}" +
    "#vln-cuadrillas textarea{min-height:92px;resize:vertical}" +
    "#vln-cuadrillas input:focus,#vln-cuadrillas select:focus,#vln-cuadrillas textarea:focus{border-color:#e8a832;box-shadow:0 0 0 3px rgba(232,168,50,.35)}" +
    "#vln-cuadrillas .ops{display:flex;flex-wrap:wrap;gap:8px}" +
    "#vln-cuadrillas .ops label{display:flex;align-items:center;gap:7px;cursor:pointer;font:14px Arial,sans-serif;color:#f5e6c8;background:rgba(245,230,200,.07);border:1px solid rgba(200,134,10,.35);border-radius:999px;padding:8px 14px}" +
    "#vln-cuadrillas .ops input{accent-color:#e8a832;margin:0}" +
    "#vln-cuadrillas .ops label:has(input:checked){background:#f5e6c8;color:#1c0e02;border-color:#f5e6c8}" +
    "#vln-cuadrillas .file{display:block;border:1.5px dashed rgba(232,168,50,.6);border-radius:10px;padding:14px;text-align:center;cursor:pointer;font:14px Arial,sans-serif;color:#f5e6c8;background:rgba(245,230,200,.05)}" +
    "#vln-cuadrillas .file:hover{background:rgba(245,230,200,.1)}" +
    "#vln-cuadrillas .file input{display:block;width:100%;margin-top:8px;color:#d9c7a3;font:13px Arial,sans-serif}" +
    "#vln-cuadrillas .plant{display:flex;gap:14px;align-items:center;background:rgba(212,165,116,.12);border:1px solid rgba(212,165,116,.4);border-radius:10px;padding:12px 14px;font:14px/1.45 Arial,sans-serif;color:#f5e6c8}" +
    "#vln-cuadrillas .plant a{flex:0 0 auto;background:#d4a574;color:#1c0e02!important;text-decoration:none!important;font:700 13px Arial,sans-serif;padding:9px 12px;border-radius:8px;white-space:nowrap}" +
    "#vln-cuadrillas .priv{display:flex;gap:10px;align-items:flex-start;font:13px/1.45 Arial,sans-serif;color:#d9c7a3}" +
    "#vln-cuadrillas .priv input{margin-top:3px;accent-color:#e8a832;width:17px;height:17px;flex:0 0 auto}" +
    "#vln-cuadrillas .priv a{color:#e8a832}" +
    "#vln-cuadrillas .btns{display:flex;gap:10px;margin-top:18px}" +
    "#vln-cuadrillas .env{flex:2;border:0;cursor:pointer;background:#e8a832;color:#1c0e02;font:700 17px Arial,sans-serif;padding:15px 18px;border-radius:10px}" +
    "#vln-cuadrillas .env:hover{background:#f0b84a}" +
    "#vln-cuadrillas .env[disabled]{opacity:.6;cursor:wait}" +
    "#vln-cuadrillas .wa{flex:1;display:flex;align-items:center;justify-content:center;gap:8px;background:#1d3b25;border:1.5px solid #25D366;color:#7ee2a0!important;text-decoration:none!important;font:700 14px Arial,sans-serif;padding:13px 14px;border-radius:10px;text-align:center}" +
    "#vln-cuadrillas .err{display:none;background:#5a1a12;color:#fde3dc;border-radius:8px;padding:10px 12px;font:14px Arial,sans-serif;margin-top:12px}" +
    "#vln-cuadrillas .nota{font:12.5px/1.5 Arial,sans-serif;color:#9a7a50;margin-top:12px}" +
    "#vln-cuadrillas .ok{text-align:center;padding:40px 30px}" +
    "#vln-cuadrillas .ok .ic{width:64px;height:64px;border-radius:50%;background:#e8a832;color:#1c0e02;font:700 34px/64px Arial,sans-serif;margin:0 auto 16px}" +
    "#vln-cuadrillas .ok p{font:16px/1.6 Arial,sans-serif;color:#f5e6c8;max-width:520px;margin:0 auto 10px}" +
    "#vln-cuadrillas .hp{position:absolute!important;left:-9999px!important;width:1px;height:1px;overflow:hidden}" +
    "#vln-cuadrillas .oculto{display:none}" +
    "@media (max-width:640px){#vln-cuadrillas .in{padding:30px 10px 40px}#vln-cuadrillas h1,#vln-cuadrillas h2.t{font-size:29px}#vln-cuadrillas .lead{font-size:15.5px}#vln-cuadrillas .sec{padding:20px 18px}#vln-cuadrillas .g{grid-template-columns:1fr}#vln-cuadrillas .btns{flex-direction:column}#vln-cuadrillas .plant{flex-direction:column;align-items:flex-start}#vln-cuadrillas .pts li{max-width:none}#vln-cuadrillas{border-radius:0}}";

  var st = document.createElement("style");
  st.textContent = CSS;
  document.head.appendChild(st);

  function campo(nombre, etiqueta, tipo, extra, clase) {
    return '<div class="' + (clase || "") + '"><label class="l" for="vlc-' + nombre + '">' + etiqueta + '</label>' +
      '<input type="' + tipo + '" id="vlc-' + nombre + '" name="' + nombre + '" ' + (extra || "") + '></div>';
  }
  function opciones(nombre, lista, marcada) {
    var h = '<div class="ops" role="radiogroup">';
    for (var i = 0; i < lista.length; i++) {
      h += '<label><input type="radio" name="' + nombre + '" value="' + lista[i] + '"' + (lista[i] === marcada ? " checked" : "") + '> ' + lista[i] + '</label>';
    }
    return h + "</div>";
  }

  var cabecera =
    '<div class="cab">' +
      '<span class="badge">Cuadrillas · Hermandades · Capataces</span>' +
      '<h1>Costales para <em>toda tu cuadrilla</em></h1>' +
      '<p class="lead">El mismo saco y la misma tela para todos, cada costal hecho a mano en Sevilla y, si queréis, con el nombre o el escudo de vuestra hermandad. Rellena el formulario y te llamamos para darte presupuesto sin compromiso.</p>' +
      '<ul class="pts">' +
        '<li><b>Todos iguales</b>Elegís saco y tela una sola vez y la cuadrilla va uniformada.</li>' +
        '<li><b>Hecho a mano</b>Cada costal se cose en nuestro taller de Sevilla.</li>' +
        '<li><b>Envío gratis a la hermandad</b>Todos los costales de la cuadrilla, en un solo paquete.</li>' +
        '<li><b>Os llamamos</b>Sin compromiso: hablamos por teléfono y cerramos los detalles.</li>' +
      '</ul>' +
    '</div>';

  var formulario =
    '<form class="card" id="vlc-form" action="' + DESTINO + '" method="POST" enctype="multipart/form-data" novalidate>' +
      '<input type="hidden" name="_subject" value="Nueva solicitud de presupuesto · CUADRILLA COMPLETA">' +
      '<input type="hidden" name="_template" value="table">' +
      '<input type="hidden" name="_captcha" value="false">' +
      '<input type="hidden" name="_next" value="' + vuelta + '">' +
      '<input type="text" name="_honey" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">' +

      '<div class="sec"><p class="st">1 · ¿Quién eres?</p><div class="g">' +
        campo("Nombre", 'Nombre y apellidos <i>*</i>', "text", 'required autocomplete="name"') +
        '<div><label class="l">Eres…</label>' + opciones("Eres", ["Capataz", "Hermandad", "Costalero", "Otro"], "Capataz") + '</div>' +
        campo("Hermandad o cuadrilla", 'Hermandad o cuadrilla <i>*</i>', "text", 'required placeholder="Ej.: Cuadrilla del Señor de…"') +
        campo("Localidad", 'Localidad <i>*</i>', "text", 'required placeholder="Ej.: Sevilla, Huelva, Jerez…"') +
        campo("Telefono", 'Teléfono <i>*</i>', "tel", 'required autocomplete="tel" inputmode="tel" placeholder="Te llamamos a este número"') +
        campo("email", 'Correo electrónico', "email", 'autocomplete="email" placeholder="Opcional"') +
      '</div></div>' +

      '<div class="sec"><p class="st">2 · El pedido</p><div class="g">' +
        campo("Numero de costaleros", 'Número de costaleros <i>*</i>', "number", 'required min="2" max="300" inputmode="numeric" placeholder="Ej.: 35"') +
        '<div><label class="l" for="vlc-saco">Tipo de saco</label><select id="vlc-saco" name="Tipo de saco">' +
          '<option>Aún no lo sé, aconsejadme</option>' +
          '<option>Saco de trama simple (como el Clásico)</option>' +
          '<option>Saca a elegir: alemana, holandesa, cigüeña, swiss water, guatemala…</option>' +
          '<option>Saco especial VamoLosNota (como el Exclusivo)</option>' +
        '</select><span class="ayuda"><a href="/sacos/" target="_blank" rel="noopener">Ver sacos</a></span></div>' +
        campo("Color de tela", 'Color o referencia de la tela', "text", 'placeholder="Ej.: verde liso, rayas blancas y azules, TR0021…"', "full") +
        '<div class="full" style="margin-top:-8px"><span class="ayuda"><a href="/telas/" target="_blank" rel="noopener">Ver telas disponibles</a> · si cada costalero lleva una tela distinta, indicadlo en la plantilla.</span></div>' +
        '<div class="full"><label class="l">¿Queréis algún bordado?</label>' + opciones("Bordado", ["Sin bordado", "Nombre de la hermandad", "Escudo", "Nombre y escudo", "Otro texto"], "Sin bordado") + '</div>' +
        '<div class="full oculto" id="vlc-txt">' +
          '<label class="l" for="vlc-textobordado">Texto a bordar</label><input type="text" id="vlc-textobordado" name="Texto a bordar" placeholder="Ej.: Hdad. de la Vera+Cruz">' +
        '</div>' +
        '<div class="full oculto" id="vlc-esc"><label class="file" for="vlc-adj1">📎 <b>Adjunta el escudo</b> (foto o archivo)<input type="file" id="vlc-adj1" name="attachment" accept="image/*,.pdf"></label>' +
          '<span class="ayuda">Vale una foto hecha con el móvil. Máximo ' + MAX_MB + ' MB entre todos los archivos.</span></div>' +
        campo("Para cuando", '¿Para cuándo lo necesitáis?', "text", 'placeholder="Ej.: antes de la igualá, para el primer ensayo…"') +
        '<div><label class="l">¿Cuándo te llamamos?</label>' + opciones("Mejor hora para llamar", ["Mañana", "Tarde", "Cualquier hora"], "Cualquier hora") + '</div>' +
      '</div></div>' +

      '<div class="sec"><p class="st">3 · Lista de la cuadrilla (opcional)</p>' +
        '<div class="plant"><span>¿Tenéis ya la lista? Descarga nuestra <b>plantilla</b>, apunta nombre, medidas, tela, bordado y forma de pago de cada costalero, y adjúntala aquí. Si no, no pasa nada: lo vemos por teléfono.</span>' +
          '<a href="' + PLANTILLA + '" download>⬇ Descargar plantilla</a></div>' +
        '<label class="file" for="vlc-adj2" style="margin-top:12px">📎 <b>Adjuntar lista o foto</b> (Excel, PDF o foto de un costal que os guste)<input type="file" id="vlc-adj2" name="attachment2" accept="image/*,.pdf,.xls,.xlsx,.csv,.doc,.docx"></label>' +
        '<div style="margin-top:14px"><label class="l" for="vlc-com">Comentarios</label><textarea id="vlc-com" name="Comentarios" placeholder="Cualquier cosa que debamos saber"></textarea></div>' +
      '</div>' +

      '<div class="sec">' +
        '<label class="priv"><input type="checkbox" id="vlc-priv" required> <span>He leído y acepto la <a href="/nosotros/privacidad/" target="_blank" rel="noopener">política de privacidad</a>. Usaremos estos datos solo para preparar vuestro presupuesto y llamaros.</span></label>' +
        '<div class="err" id="vlc-err" role="alert"></div>' +
        '<div class="btns"><button type="submit" class="env" id="vlc-env">Pedir presupuesto</button>' +
          '<a class="wa" href="' + WHATSAPP + '" target="_blank" rel="noopener">Prefiero WhatsApp</a></div>' +
        '<p class="nota">Presupuesto sin compromiso. Te llamamos por teléfono para cerrar medidas, telas y plazos.</p>' +
      '</div>' +
    '</form>';

  var gracias =
    '<div class="card"><div class="ok"><div class="ic">✓</div>' +
      '<h2 class="t" style="font-size:30px">¡Recibido, <em>gracias</em>!</h2>' +
      '<p>Ya tenemos los datos de vuestra cuadrilla. Te llamamos por teléfono lo antes posible para preparar el presupuesto.</p>' +
      '<p>Si tienes prisa, escríbenos al <a style="color:#e8a832" href="' + WHATSAPP + '">WhatsApp 692 942 182</a>.</p>' +
    '</div></div>';

  root.innerHTML = '<div class="fondo" aria-hidden="true"></div><div class="velo" aria-hidden="true"></div>' +
    '<div class="in">' + cabecera + (enviado ? gracias : formulario) + '</div>';

  if (enviado) return;

  var form = document.getElementById("vlc-form");
  var err = document.getElementById("vlc-err");
  var txt = document.getElementById("vlc-txt"), esc = document.getElementById("vlc-esc");

  function bordado() {
    var v = (form.querySelector('input[name="Bordado"]:checked') || {}).value || "";
    txt.className = "full" + (/Nombre|Otro texto/.test(v) ? "" : " oculto");
    esc.className = "full" + (/Escudo/.test(v) ? "" : " oculto");
  }
  var rs = form.querySelectorAll('input[name="Bordado"]');
  for (var i = 0; i < rs.length; i++) rs[i].addEventListener("change", bordado);

  function fallo(msg, el) {
    err.textContent = msg; err.style.display = "block";
    if (el && el.focus) { el.focus(); if (el.scrollIntoView) el.scrollIntoView({ block: "center", behavior: "smooth" }); }
  }

  form.addEventListener("submit", function (e) {
    err.style.display = "none";
    var req = form.querySelectorAll("[required]");
    for (var i = 0; i < req.length; i++) {
      var r = req[i];
      if (r.type === "checkbox" ? !r.checked : !String(r.value).trim()) {
        e.preventDefault();
        return fallo(r.type === "checkbox" ? "Marca la casilla de la política de privacidad para poder enviarlo." : "Falta un dato obligatorio (los marcados con *).", r);
      }
    }
    var tel = form.querySelector("#vlc-Telefono");
    if (String(tel.value).replace(/\D/g, "").length < 9) { e.preventDefault(); return fallo("Revisa el teléfono: necesitamos un número para llamarte.", tel); }
    var total = 0, fs = form.querySelectorAll('input[type="file"]');
    for (var j = 0; j < fs.length; j++) if (fs[j].files) for (var k = 0; k < fs[j].files.length; k++) total += fs[j].files[k].size;
    if (total > MAX_MB * 1024 * 1024) { e.preventDefault(); return fallo("Los archivos pesan demasiado (máximo " + MAX_MB + " MB). Prueba con una foto más pequeña o mándanoslos por WhatsApp.", fs[0]); }
    // quita los adjuntos vacíos para que el correo llegue limpio
    for (var m = 0; m < fs.length; m++) if (!fs[m].files || !fs[m].files.length) fs[m].disabled = true;
    var b = document.getElementById("vlc-env");
    b.disabled = true; b.textContent = "Enviando…";
    try { if (window.gtag) window.gtag("event", "generate_lead", { form: "cuadrillas" }); } catch (x) {}
  });
})();
