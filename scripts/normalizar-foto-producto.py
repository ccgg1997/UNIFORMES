#!/usr/bin/env python3
"""Normaliza una foto de producto al patron del catalogo.

Todas las fichas comparten lienzo 880x1100 (4:5), la prenda centrada dentro de
una caja de contenido del 84% y el fondo de garabatos escolares -el mismo arte
que el sitio usa en el hero y el pie (src/components/school-doodles.tsx),
rasterizado en scripts/fondo-garabatos.png-.

Sin esto una foto nueva entra al grid desentonando: la blusa llego a 616x703 y
ocupando el 97% del ancho, y las fotos sin garabatos se notaban al lado de la
jardinera, la guayabera y el pantalon, que si los traen impresos.

Uso:
    python scripts/normalizar-foto-producto.py ENTRADA SALIDA.webp
    python scripts/normalizar-foto-producto.py ENTRADA SALIDA.webp --recorte=plano
    python scripts/normalizar-foto-producto.py ENTRADA SALIDA.webp --sin-fondo

`--recorte=plano` usa el recorte determinista en vez de rembg: mas seguro con
prendas de color sobre fondo blanco. `--sin-fondo` deja el blanco liso y solo corrige encuadre y tamano; sirve para
una foto que ya trae los garabatos impresos.

Requiere Pillow, numpy, scipy y rembg (pip install pillow numpy scipy rembg). Es una herramienta de
assets, no del build: el sitio solo consume el .webp resultante.
"""

import sys
from pathlib import Path

from PIL import Image, ImageFilter

# El lienzo que comparten todas las fichas.
CANVAS = (880, 1100)
# Cuanto del lienzo puede ocupar la prenda. 0.84 deja el aire que ya tenian
# camibuso (82%) y camisa de educacion fisica (84%).
CONTENT = 0.84
# El raster sale con el trazo mas grueso que el impreso: medido en la banda
# superior de la guayabera (la unica zona sin prenda encima), el original cubre
# 2.78% de los pixeles y el raster crudo 5.02%. MaxFilter aclara los vecinos,
# o sea adelgaza el trazo oscuro, y deja el raster en 2.76%: misma densidad.
DOODLE_THINNING = 3
DOODLE_FILE = Path(__file__).with_name("fondo-garabatos.png")
# Un pixel cuenta como prenda si se separa del blanco mas que esto. Solo se usa
# en el camino sin recorte (fotos que ya traen fondo impreso).
WHITE_CUTOFF = 242


def background() -> Image.Image:
    """Lienzo con los garabatos al mismo grosor que los impresos."""
    doodles = Image.open(DOODLE_FILE).convert("RGB").resize(CANVAS, Image.LANCZOS)
    return doodles.filter(ImageFilter.MaxFilter(DOODLE_THINNING))


def cutout_ia(image: Image.Image) -> Image.Image:
    """Recorte con rembg. Necesario cuando la prenda es blanca sobre blanco (el
    camibuso), donde ningun umbral la separa del fondo.

    OJO: es un modelo, no una regla, y se equivoca. En la camisa de educacion
    fisica se comio una manga entera. SIEMPRE revisar el resultado; si daña la
    prenda, usar --recorte=plano."""
    from rembg import new_session, remove

    result = remove(image, session=new_session("isnet-general-use"))
    bbox = result.getchannel("A").point(lambda v: 255 if v > 12 else 0).getbbox()
    if bbox is None:
        raise SystemExit("rembg no encontro prenda en la imagen.")
    return result.crop(bbox)


def cutout_plano(image: Image.Image, near_white: int = 240) -> Image.Image:
    """Recorte determinista: solo se vuelve transparente el blanco CONECTADO
    con el borde de la foto.

    No puede tocar la prenda —lo de adentro nunca se alcanza desde el borde—,
    asi que es el camino seguro para una foto de estudio sobre blanco. A cambio
    no sirve si la prenda es blanca y su contorno se funde con el fondo.
    """
    import numpy as np
    from scipy import ndimage

    lum = np.asarray(image.convert("L"))
    claro = lum >= near_white

    # Se etiquetan las manchas claras y se descartan solo las que tocan el
    # borde: eso es el fondo. Un blanco encerrado por la prenda (el ojal, el
    # hueco entre las piernas de un pantalon) no toca el borde, asi que se
    # conserva. Etiquetar es exacto y de una pasada; el floodfill de PIL sobre
    # una imagen creada con fromarray no escribe nada.
    etiquetas, cuantas = ndimage.label(claro)
    if cuantas:
        del_borde = set(etiquetas[0, :]) | set(etiquetas[-1, :])
        del_borde |= set(etiquetas[:, 0]) | set(etiquetas[:, -1])
        del_borde.discard(0)
        fondo = np.isin(etiquetas, list(del_borde))
    else:
        fondo = np.zeros_like(claro)

    alpha = Image.fromarray(np.where(fondo, 0, 255).astype("uint8"), "L")
    # Medio pixel de difuminado: sin esto el contorno queda recortado a tijera
    # sobre los garabatos.
    alpha = alpha.filter(ImageFilter.GaussianBlur(0.6))

    result = image.convert("RGBA")
    result.putalpha(alpha)
    bbox = alpha.point(lambda v: 255 if v > 12 else 0).getbbox()
    if bbox is None:
        raise SystemExit("No se encontro prenda: la imagen parece toda blanca.")
    return result.crop(bbox)


def flat_crop(image: Image.Image) -> Image.Image:
    """Caja de la prenda contra fondo blanco, sin recortar el fondo."""
    mask = image.convert("L").point(lambda v: 255 if v < WHITE_CUTOFF else 0)
    bbox = mask.getbbox()
    if bbox is None:
        raise SystemExit("No se encontro prenda: la imagen parece toda blanca.")
    return image.crop(bbox)


def normalize(src: str, dst: str, doodles: bool, recorte: str) -> None:
    image = Image.open(src).convert("RGB")
    if not doodles:
        garment = flat_crop(image)
    elif recorte == "plano":
        garment = cutout_plano(image)
    else:
        garment = cutout_ia(image)

    max_w = int(CANVAS[0] * CONTENT)
    max_h = int(CANVAS[1] * CONTENT)
    scale = min(max_w / garment.width, max_h / garment.height)
    size = (max(1, round(garment.width * scale)), max(1, round(garment.height * scale)))
    garment = garment.resize(size, Image.LANCZOS)

    canvas = background() if doodles else Image.new("RGB", CANVAS, (255, 255, 255))
    position = ((CANVAS[0] - size[0]) // 2, (CANVAS[1] - size[1]) // 2)
    # El tercer argumento es la mascara: conserva los bordes suavizados del
    # recorte en vez de dejar un contorno duro sobre los garabatos.
    canvas.paste(garment, position, garment if garment.mode == "RGBA" else None)
    canvas.save(dst, "WEBP", quality=88, method=6)

    print(
        f"{src} -> {dst}\n"
        f"  prenda {size[0]}x{size[1]} sobre {CANVAS[0]}x{CANVAS[1]} "
        f"({100 * size[0] / CANVAS[0]:.1f}% ancho, {100 * size[1] / CANVAS[1]:.1f}% alto)"
        f"{'' if doodles else '  [fondo blanco]'}"
    )


if __name__ == "__main__":
    flags = {a for a in sys.argv[1:] if a.startswith("--")}
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if len(args) != 2 or flags - {"--sin-fondo", "--recorte=plano", "--recorte=ia"}:
        raise SystemExit(__doc__)
    normalize(
        args[0],
        args[1],
        doodles="--sin-fondo" not in flags,
        recorte="plano" if "--recorte=plano" in flags else "ia",
    )
