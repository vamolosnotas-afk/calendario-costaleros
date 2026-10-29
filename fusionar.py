"""Fusiona eventos nuevos en eventos.json sin duplicados.
Uso: python3 fusionar.py eventos.json nuevos1.json [nuevos2.json ...]
Clave de duplicado: fecha + provincia + hermandad normalizada + tipo + paso.
"""
import json, sys, unicodedata, re, datetime

PROV = {"sevilla", "huelva", "granada", "cordoba"}
TIPOS = {"igualá", "ensayo", "mudá", "retranqueo", "otro"}
DESDE, HASTA = "2026-09-01", "2027-06-30"

def norm(s):
    s = unicodedata.normalize("NFKD", (s or "").lower())
    s = "".join(c for c in s if not unicodedata.combining(c))
    s = re.sub(r"\b(hermandad|hdad|cofradia|real|ilustre|antigua|y|de|del|la|el|los|las|nuestra|senora|nuestro|padre|jesus|maria|santisimo|stmo)\b\.?", " ", s)
    return re.sub(r"[^a-z0-9]+", "", s)

def valido(e):
    try:
        datetime.date.fromisoformat(e["fecha"])
    except Exception:
        return False
    return (e.get("provincia") in PROV and DESDE <= e["fecha"] <= HASTA
            and e.get("hermandad") and str(e.get("fuente", "")).startswith("http"))

def clave(e):
    return (e["fecha"], e["provincia"], norm(e["hermandad"]), e.get("tipo") or "otro", (e.get("paso") or "").lower())

def main():
    base_path, nuevos = sys.argv[1], sys.argv[2:]
    try:
        base = json.load(open(base_path, encoding="utf-8"))
    except FileNotFoundError:
        base = {"eventos": []}
    eventos = base.get("eventos", base if isinstance(base, list) else [])
    vistos = {clave(e): e for e in eventos if valido(e)}
    añadidos, descartados = [], 0
    hoy = datetime.date.today().isoformat()
    for f in nuevos:
        for e in json.load(open(f, encoding="utf-8")):
            if e.get("tipo") not in TIPOS:
                e["tipo"] = "otro"
            if not valido(e):
                descartados += 1
                continue
            k = clave(e)
            if k in vistos:
                viejo = vistos[k]
                for campo in ("hora", "lugar", "capataz", "localidad"):
                    if not viejo.get(campo) and e.get(campo):
                        viejo[campo] = e[campo]
                continue
            e.setdefault("añadido", hoy)
            vistos[k] = e
            añadidos.append(e)
    salida = sorted(vistos.values(), key=lambda e: (e["fecha"], e.get("hora") or "99", e["provincia"]))
    json.dump({"actualizado": hoy, "total": len(salida), "eventos": salida},
              open(base_path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"total={len(salida)} añadidos={len(añadidos)} descartados={descartados}")
    for e in añadidos:
        print(f"+ {e['fecha']} {e['provincia']:8} {e.get('tipo')}: {e['hermandad']}")

if __name__ == "__main__":
    main()
