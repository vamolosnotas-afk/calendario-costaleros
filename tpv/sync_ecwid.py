#!/usr/bin/env python3
"""Sincronización entre la tienda de IONOS (Ecwid, tienda 111365357) y el TPV VamoLosNota.

Uso (la clave va en la variable de entorno ECWID_TOKEN, nunca en archivos):
  python3 sync_ecwid.py push PEND.jsonl            -> pasa a la tienda los cambios hechos en el TPV
  python3 sync_ecwid.py pull DESDE_UNIX            -> descarga los pedidos cambiados en la tienda desde esa fecha
  python3 sync_ecwid.py build EXIST.jsonl [STOCK.jsonl] -> prepara las escrituras para la base de datos del TPV
  python3 sync_ecwid.py catalogo                   -> catálogo de la tienda y telas de la web para el TPV (tienda.json)

Los .jsonl son las líneas que devuelven db_query/db_list del TPV ({"data":…,"id":…,"version":…}).
Todo se deja en /tmp/vln_sync/.
"""
import json, os, sys, re, time, datetime, unicodedata, urllib.request, urllib.parse, urllib.error
from zoneinfo import ZoneInfo

STORE = "111365357"
API = f"https://app.ecwid.com/api/v3/{STORE}"
DIR = "/tmp/vln_sync"
os.makedirs(DIR, exist_ok=True)
MAD = ZoneInfo("Europe/Madrid")

def token():
    t = os.environ.get("ECWID_TOKEN", "").strip()
    if not t:
        sys.exit("Falta ECWID_TOKEN")
    return t

def api(method, path, params=None, body=None):
    url = API + path + ("?" + urllib.parse.urlencode(params) if params else "")
    data = json.dumps(body).encode() if body is not None else None
    r = urllib.request.Request(url, data=data, method=method, headers={
        "Authorization": "Bearer " + token(), "Content-Type": "application/json;charset=utf-8"})
    for intento in range(3):
        try:
            with urllib.request.urlopen(r, timeout=40) as resp:
                return json.loads(resp.read().decode() or "{}")
        except urllib.error.HTTPError as e:
            if e.code in (429, 500, 502, 503) and intento < 2:
                time.sleep(3 * (intento + 1)); continue
            raise RuntimeError(f"{method} {path} -> HTTP {e.code}: {e.read().decode()[:300]}")

def norm(s):
    s = unicodedata.normalize("NFD", str(s or "")).encode("ascii", "ignore").decode()
    return re.sub(r"\s+", " ", s.lower()).strip()

def leer_jsonl(path):
    out = []
    if not path or not os.path.exists(path):
        return out
    txt = open(path, encoding="utf-8").read().strip()
    if txt.startswith("["):
        return json.loads(txt)
    for ln in txt.splitlines():
        ln = ln.strip()
        if ln.startswith("{"):
            out.append(json.loads(ln))
    return out

# ---------------- correspondencias ----------------
SIT_A_ECWID = {"Nuevo": "AWAITING_PROCESSING", "En proceso": "PROCESSING", "Listo": "READY_FOR_PICKUP",
               "Para recoger": "READY_FOR_PICKUP",
               "Enviado": "SHIPPED", "En tránsito": "SHIPPED", "Entregado": "DELIVERED"}
# "Registrado en Correos" no se pasa a la tienda: el paquete aún no está en Correos
PAGO_DE_ECWID = {"AWAITING_PAYMENT": "Pendiente", "INCOMPLETE": "Pendiente", "PAID": "Pagado",
                 "PARTIALLY_REFUNDED": "Pagado", "CANCELLED": "Cancelado", "REFUNDED": "Cancelado"}

def sit_de_ecwid(f, actual):
    if actual in ("Registrado en Correos", "En mensajería") and f in ("AWAITING_PROCESSING", "PROCESSING", "READY_FOR_PICKUP"):
        return "Registrado en Correos"
    if f == "AWAITING_PROCESSING": return "Nuevo"
    if f == "PROCESSING": return "En proceso"
    if f == "READY_FOR_PICKUP": return actual if actual in ("Listo", "Para recoger") else "Para recoger"
    if f == "OUT_FOR_DELIVERY": return "En tránsito"
    if f == "SHIPPED": return actual if actual in ("Enviado", "En tránsito") else "Enviado"
    if f == "DELIVERED": return "Entregado"
    return actual or "Nuevo"   # WILL_NOT_DELIVER, RETURNED, personalizados: se deja como esté

def forma_pago(m):
    n = norm(m)
    if "bizum" in n: return "Bizum"
    if "paypal" in n: return "PayPal"
    if "transfer" in n or "trasfer" in n: return "Transferencia"
    if "reembolso" in n: return "Contra reembolso"
    if "efectivo" in n or "cash" in n: return "Efectivo"
    if "tarjeta" in n or "card" in n or "credit" in n: return "Tarjeta"
    return m or ""

CATALOGO = {  # mismo material que el catálogo del TPV
    "clasico": {"cat": "costal", "saco": "sacoTrama"}, "personalizado": {"cat": "costal", "saco": "sacoTrama"},
    "exclusivo": {"cat": "costal", "saco": "sacoEspecial"}, "nino": {"cat": "costal", "saco": "sacoTrama", "extra": {"costalNino": 1}},
    "pack": {"cat": "costal", "saco": "sacoTrama", "comp": {"morcilla": 1, "fajaTela": 1}},
    "morcilla": {"comp": {"morcilla": 1}}, "fajaTela": {"comp": {"fajaTela": 1}}, "fajaElastica": {"comp": {"fajaElastica": 1}},
    "fajaNino": {"comp": {"fajaNino": 1}}, "tirantas": {"comp": {"tirantas": 1}}, "bolsita": {"comp": {"bolsita": 1}},
    "tarjeta": {"extra": {"tarjetaRegalo": 1}}, "envio": {}, "libre": {},
}

def prod_de(nombre):
    n = norm(nombre)
    if "tarjeta regalo" in n or n.startswith("vale") or "gift" in n: return "tarjeta"
    if "pack" in n: return "pack"
    if "faja" in n:
        if "nino" in n or "bebe" in n: return "fajaNino"
        if "elast" in n: return "fajaElastica"
        return "fajaTela"
    if "morcilla" in n and "costal" not in n: return "morcilla"
    if "tirant" in n: return "tirantas"
    if "bolsa" in n or "bolsita" in n: return "bolsita"
    if "costal" in n:
        if "nino" in n: return "nino"
        if "exclusiv" in n or "especial" in n: return "exclusivo"
        if "personaliz" in n: return "personalizado"
        return "clasico"
    return "libre"

def saco_de(valor):
    n = norm(valor)
    if not n: return ""
    for claves, k in ((("swiss",), "sacoSwiss"), (("holand",), "sacaHolandesa"), (("alem",), "sacaAlemana"),
                      (("harina",), "sacaHarina"), (("sarga",), "sacaSarga"), (("cig",), "sacaCiguena"),
                      (("espiga",), "sacaEspiga"), (("especial", "vamolosnota", "exclusiv"), "sacoEspecial")):
        if any(c in n for c in claves): return k
    return "sacoTrama"

def linea_de(it):
    opts = it.get("selectedOptions") or []
    l = {"prod": prod_de(it.get("name")), "nombre": it.get("name") or "Artículo", "cant": it.get("quantity") or 1,
         "precio": round(float(it.get("price") or 0), 2)}
    det, med, med_otra = [], "", ""
    for o in opts:
        nom, val = o.get("name") or "", str(o.get("value") or "").strip()
        nn = norm(nom)
        if not val: continue
        det.append(f"{nom}: {val}")
        if "saco" in nn: l["saco"] = saco_de(val); l["sacoTxt"] = val
        elif "medidas diferentes" in nn or "otra" in nn and "medida" in nn: med_otra = val
        elif "medida" in nn or "talla" in nn: med = val
        elif "tela" in nn or "color" in nn and "liso" in nn: l["tela"] = val
        elif "morcilla" in nn: l["morcilla"] = not any(x in norm(val) for x in ("sin", "no "))
        elif "bordad" in nn or "nombre" in nn or "escudo" in nn: l["bordado"] = val
    if med_otra or med: l["medidas"] = med_otra or med
    if it.get("sku"): det.insert(0, "REF " + str(it["sku"]))
    l["detalle"] = " · ".join(det)
    return l

def comp_de(lineas, telas):
    c = {}
    def add(k, n):
        if k and n: c[k] = round(c.get(k, 0) + n, 2)
    for l in lineas:
        it = CATALOGO.get(l.get("prod"), {})
        q = float(l.get("cant") or 0)
        if it.get("cat") == "costal" or l.get("saco"): add(l.get("saco") or it.get("saco"), q)
        for k, n in (it.get("comp") or {}).items(): add(k, n * q)
        for k, n in (it.get("extra") or {}).items(): add(k, n * q)
        if l.get("tela"):
            t = telas.get(norm(l["tela"]))
            if t: add(t["id"], float(t.get("consumo") or 1) * q)
        if l.get("morcilla"): add("morcilla", q)
    return {k: (int(v) if float(v).is_integer() else v) for k, v in c.items()}

MATERIAL = {"sacoTrama", "sacoEspecial", "sacaHolandesa", "sacaAlemana", "sacaHarina", "sacaSarga", "sacaCiguena",
            "sacoSwiss", "sacaEspiga", "morcilla", "fajaTela", "fajaElastica", "fajaNino", "tirantas", "camiseta", "bolsita"}

def solo_material(comp, stock_ids):
    return {k: v for k, v in comp.items() if k in MATERIAL or k in stock_ids}

def fecha_local(s):
    try:
        d = datetime.datetime.strptime(s, "%Y-%m-%d %H:%M:%S %z")
    except Exception:
        return datetime.date.today().isoformat(), datetime.datetime.now(datetime.timezone.utc).isoformat()
    return d.astimezone(MAD).date().isoformat(), d.astimezone(datetime.timezone.utc).isoformat()

# ---------------- comandos ----------------
def cmd_push(pend_path):
    pend = leer_jsonl(pend_path)
    res = []
    for d in pend:
        p = d.get("data") or {}
        eid = p.get("ecwidId") or p.get("num")
        cambios = dict(p.get("ecwidCambios") or {})
        if not eid or not cambios:
            res.append({"id": d["id"], "ok": True, "sinCambios": True}); continue
        if p.get("seguimiento") and cambios.get("fulfillmentStatus") == "SHIPPED":
            cambios["trackingNumber"] = p["seguimiento"]
        try:
            api("PUT", f"/orders/{urllib.parse.quote(eid)}", body=cambios)
            o = api("GET", f"/orders/{urllib.parse.quote(eid)}")
            res.append({"id": d["id"], "ecwidId": eid, "ok": True, "enviado": cambios, "order": o})
        except Exception as e:
            res.append({"id": d["id"], "ecwidId": eid, "ok": False, "error": str(e)})
    json.dump(res, open(f"{DIR}/push.json", "w"), ensure_ascii=False)
    for r in res:
        print(("OK " if r["ok"] else "ERROR ") + str(r.get("ecwidId", r["id"])) + " " + json.dumps(r.get("enviado") or r.get("error") or "", ensure_ascii=False))
    print(f"push: {sum(r['ok'] for r in res)} bien, {sum(not r['ok'] for r in res)} con error")

def cmd_pull(desde):
    desde = int(float(desde))
    orders, off = [], 0
    while True:
        r = api("GET", "/orders", {"updatedFrom": max(0, desde - 300), "limit": 100, "offset": off})
        items = r.get("items") or []
        orders += items
        off += len(items)
        if not items or off >= int(r.get("total") or 0): break
    json.dump(orders, open(f"{DIR}/orders.json", "w"), ensure_ascii=False)
    ids = [o.get("id") for o in orders]
    json.dump(ids, open(f"{DIR}/ids.json", "w"))
    print(f"pull: {len(orders)} pedidos cambiados en la tienda")
    print("IDS:", json.dumps(ids))

def cmd_build(exist_path, stock_path=None):
    orders = json.load(open(f"{DIR}/orders.json")) if os.path.exists(f"{DIR}/orders.json") else []
    push = json.load(open(f"{DIR}/push.json")) if os.path.exists(f"{DIR}/push.json") else []
    exist = leer_jsonl(exist_path)
    stock = leer_jsonl(stock_path) if stock_path else []
    stock_ids = {s["id"] for s in stock}
    telas = {norm(s["data"].get("n")): {"id": s["id"], **s["data"]} for s in stock if s["data"].get("g") == "Telas"}
    por_num = {}
    for d in exist:
        n = (d["data"].get("ecwidId") or d["data"].get("num") or "").upper()
        if n and n not in por_num: por_num[n] = d
    pushed_ok = {r["ecwidId"] for r in push if r.get("ok") and r.get("ecwidId")}
    # los pedidos recién pasados a la tienda se rellenan con lo que la tienda devolvió
    for r in push:
        if r.get("ok") and r.get("order") and r["order"].get("id") not in {o.get("id") for o in orders}:
            orders.append(r["order"])
    ops, delta, nuevos, actualizados, saltados = [], {}, 0, 0, 0
    ahora = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z")
    for o in orders:
        eid = str(o.get("id") or "").upper()
        if not eid: continue
        ex = por_num.get(eid)
        if ex and ex["data"].get("ecwidPend") and eid not in pushed_ok:
            saltados += 1; continue  # hay un cambio del TPV pendiente de subir: no se pisa
        cur = ex["data"] if ex else {}
        fecha, creado = fecha_local(o.get("createDate", ""))
        lineas = [linea_de(it) for it in (o.get("items") or [])]
        so = o.get("shippingOption") or {}
        if float(so.get("shippingRate") or 0) > 0:
            lineas.append({"prod": "envio", "nombre": "Envío" + (" · " + so["shippingMethodName"] if so.get("shippingMethodName") else ""),
                           "cant": 1, "precio": round(float(so["shippingRate"]), 2), "detalle": ""})
        sp = o.get("shippingPerson") or o.get("billingPerson") or {}
        dirc = ", ".join(x for x in [sp.get("street"), " ".join(x for x in [sp.get("postalCode"), sp.get("city")] if x),
                                      sp.get("stateOrProvinceName"), sp.get("countryName")] if x)
        ful, pay = o.get("fulfillmentStatus") or "", o.get("paymentStatus") or ""
        track = str(o.get("trackingNumber") or "").strip().upper()
        situ = sit_de_ecwid(ful, cur.get("situacion"))
        pago = PAGO_DE_ECWID.get(pay, cur.get("pago") or "Pendiente")
        f = {"ecwidId": eid, "num": cur.get("num") or eid, "ecwidFul": ful, "ecwidPay": pay, "ecwidTrack": track,
             "ecwidUpd": o.get("updateDate", ""), "ecwidPend": False, "ecwidCambios": {},
             "situacion": situ, "pago": pago, "ecwidSit": situ, "ecwidPago": pago, "total": round(float(o.get("total") or 0), 2), "lineas": lineas,
             "act": ahora}
        if sp.get("name"): f["cliente"] = sp["name"].strip()
        for k, v in (("telefono", sp.get("phone")), ("email", o.get("email")), ("direccion", dirc),
                     ("localidad", sp.get("city")), ("provincia", sp.get("stateOrProvinceName"))):
            if v: f[k] = str(v).strip()
        if o.get("paymentMethod"): f["formaPago"] = forma_pago(o["paymentMethod"])
        if track:
            f["seguimiento"] = track.upper()
            f["empresaEnvio"] = cur.get("empresaEnvio") or "Correos"
        hoy = datetime.datetime.now(MAD).date().isoformat()
        if situ == "Enviado" and not cur.get("fechaEnvio"): f["fechaEnvio"] = hoy
        if situ == "Entregado" and not cur.get("fechaEntrega"): f["fechaEntrega"] = hoy
        if pago == "Pagado" and not cur.get("fechaCobro"): f["fechaCobro"] = cur.get("fecha") or fecha
        if ful in ("WILL_NOT_DELIVER", "RETURNED"):
            f["incidencia"] = "No se entregará" if ful == "WILL_NOT_DELIVER" else "Devuelto"
        historico = bool(cur.get("historico"))
        comp_total = comp_de(lineas, telas)
        if not historico:
            f["comp"] = comp_total
            deseado = {} if pago == "Cancelado" else solo_material(comp_total, stock_ids | MATERIAL)
            antes = cur.get("stockComp") or {}
            for k in set(deseado) | set(antes):
                dlt = float(deseado.get(k, 0)) - float(antes.get(k, 0))
                if dlt: delta[k] = delta.get(k, 0) - dlt   # los pedidos restan material
            f["stockComp"] = deseado
        if ex:
            ops.append({"op": "merge", "path": f"pedidos/{ex['id']}", "ifVersion": ex["version"], "data": f})
            actualizados += 1
        else:
            f.update({"fecha": fecha, "creado": creado, "canal": "Web", "origen": "Tienda IONOS · " + eid,
                      "porDecidir": any(l["prod"] == "tarjeta" for l in lineas), "iva": 0.21,
                      "notas": " · ".join(x for x in [o.get("orderComments"), o.get("privateAdminNotes")] if x)})
            if pago != "Pagado": f.pop("fechaCobro", None)
            ops.append({"op": "set", "path": f"pedidos/ec_{re.sub('[^A-Za-z0-9]', '', eid)}", "data": f})
            nuevos += 1
    delta = {k: round(v, 2) for k, v in delta.items() if round(v, 2)}
    if delta and not stock:
        print("FALTA_STOCK: hay material que mover (" + json.dumps(delta) + "). Saca el listado de stock (db_list stock) "
              "a un .jsonl y repite: build EXIST.jsonl STOCK.jsonl. No se ha preparado ninguna escritura.")
        sys.exit(2)
    falta_stock = []
    if delta:
        st = {s["id"]: s for s in stock}
        for k, v in delta.items():
            s = st.get(k)
            if not s:
                falta_stock.append(k); continue
            ops.append({"op": "update", "path": f"stock/{k}", "ifVersion": s["version"],
                        "data": {"cant": round(float(s["data"].get("cant") or 0) + v, 2), "act": ahora}})
    errores = [r for r in push if not r.get("ok")]
    resumen = f"{nuevos} nuevos, {actualizados} actualizados" + (f", {sum(1 for r in push if r.get('ok') and not r.get('sinCambios'))} pasados a la tienda" if push else "")
    json.dump({"ops": ops, "delta": delta, "faltaStock": falta_stock, "resumen": resumen,
               "errores": [f"{r.get('ecwidId')}: {r.get('error')}" for r in errores], "saltados": saltados},
              open(f"{DIR}/build.json", "w"), ensure_ascii=False)
    for i in range(0, len(ops), 40):
        json.dump(ops[i:i + 40], open(f"{DIR}/ops_{i // 40}.json", "w"), ensure_ascii=False, separators=(",", ":"))
    print("build:", resumen, f"| {len(ops)} escrituras en {(len(ops) + 39) // 40} tandas: " +
          ", ".join(f"{DIR}/ops_{i}.json" for i in range((len(ops) + 39) // 40)))
    if delta: print("stock a mover:", json.dumps(delta))
    if falta_stock: print("material que no existe en el stock del TPV (no se toca):", falta_stock)
    if errores: print("errores al pasar a la tienda:", json.dumps([e for e in errores], ensure_ascii=False)[:800])

def cmd_catalogo():
    """Catálogo de la tienda (productos con opciones y suplementos) y referencias de /telas/ para el TPV.
    Escribe /tmp/vln_sync/tienda.json con {"hash", "act", "productos", "telas"}; imprime HASH: <hash>."""
    import hashlib, html as _html
    prods = []
    for p in (api("GET", "/products", {"limit": 100, "enabled": "true"}).get("items") or []):
        ops = []
        for o in p.get("options") or []:
            ops.append({"tipo": o.get("type"), "nombre": o.get("name"), "obligatoria": bool(o.get("required")),
                        "opciones": [{"t": c.get("text"), "p": c.get("priceModifier") or 0, "pt": c.get("priceModifierType") or "ABSOLUTE"}
                                     for c in (o.get("choices") or [])]})
        prods.append({"id": p["id"], "sku": p.get("sku") or "", "nombre": p.get("name"), "precio": p.get("price") or 0,
                      "mayor": [{"q": w["quantity"], "p": w["price"]} for w in (p.get("wholesalePrices") or [])],
                      "opciones": ops})
    telas = []
    try:
        req = urllib.request.Request("https://www.vamolosnota.es/telas/", headers={"User-Agent": "Mozilla/5.0"})
        h = urllib.request.urlopen(req, timeout=40).read().decode("utf-8", "ignore")
        vistas = set()
        for m in re.finditer(r'alt="([^"]*?)ref\.\s*((?:STOCK|LISOS)_\d{3,4}[A-Z]?)', h):
            ref = m.group(2)
            if ref in vistas: continue
            vistas.add(ref)
            d = _html.unescape(m.group(1))
            d = re.sub(r"^\s*Tela\s+(de\s+)?", "", d, flags=re.I)
            d = re.sub(r"\s*para costal,?\s*$", "", d, flags=re.I).strip(" ,")
            telas.append({"ref": ref, "d": d})
    except Exception as e:
        print("AVISO telas:", e)
    telas.sort(key=lambda t: (0 if t["ref"].startswith("STOCK") else 1, t["ref"]))
    cuerpo = {"productos": prods, "telas": telas}
    hsh = hashlib.sha1(json.dumps(cuerpo, sort_keys=True, ensure_ascii=False).encode()).hexdigest()[:16]
    cuerpo.update({"hash": hsh, "act": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")})
    json.dump(cuerpo, open(f"{DIR}/tienda.json", "w"), ensure_ascii=False)
    print(f"HASH: {hsh}  ({len(prods)} productos, {len(telas)} telas)")

if __name__ == "__main__":
    if len(sys.argv) < 2: sys.exit(__doc__)
    c = sys.argv[1]
    if c == "push": cmd_push(sys.argv[2])
    elif c == "pull": cmd_pull(sys.argv[2])
    elif c == "catalogo": cmd_catalogo()
    elif c == "build": cmd_build(sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else None)
    else: sys.exit(__doc__)
