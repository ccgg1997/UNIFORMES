#!/usr/bin/env python3
"""Normaliza una foto de producto al patron del catalogo.

Todas las fichas comparten lienzo 880x1100 (4:5) sobre blanco puro, con la
prenda centrada dentro de una caja de contenido del 84%. Sin esto una foto
nueva entra al grid con otro tamano: la blusa llegaba ocupando el 97% del
ancho (pegada a los bordes) y se veia enorme al lado de las demas.

Uso:
    python scripts/normalizar-foto-producto.py ENTRADA SALIDA.webp

Requiere Pillow (pip install pillow). Es una herramienta de assets, no del
build: el sitio solo consume el .webp resultante.
"""

import sys

from PIL import Image

# El lienzo que ya usan las 7 fichas existentes.
CANVAS = (880, 1100)
# Cuanto del lienzo puede ocupar la prenda. 0.84 deja el aire que tienen
# camibuso (82%) y camisa de educacion fisica (84%).
CONTENT = 0.84
# Un pixel cuenta como prenda si se separa del blanco mas que esto. El fondo
# de estudio vive en 250-255, asi que 242 recorta sin comerse tela clara.
WHITE_CUTOFF = 242


def garment_bbox(image: Image.Image):
    """Caja de la prenda, ignorando el fondo blanco de estudio."""
    grey = image.convert("L")
    mask = grey.point(lambda v: 255 if v < WHITE_CUTOFF else 0)
    bbox = mask.getbbox()
    if bbox is None:
        raise SystemExit("No se encontro prenda: la imagen parece toda blanca.")
    return bbox


def normalize(src: str, dst: str) -> None:
    image = Image.open(src).convert("RGB")
    garment = image.crop(garment_bbox(image))

    max_w = int(CANVAS[0] * CONTENT)
    max_h = int(CANVAS[1] * CONTENT)
    scale = min(max_w / garment.width, max_h / garment.height)
    size = (max(1, round(garment.width * scale)), max(1, round(garment.height * scale)))
    garment = garment.resize(size, Image.LANCZOS)

    canvas = Image.new("RGB", CANVAS, (255, 255, 255))
    canvas.paste(
        garment,
        ((CANVAS[0] - size[0]) // 2, (CANVAS[1] - size[1]) // 2),
    )
    canvas.save(dst, "WEBP", quality=88, method=6)

    print(
        f"{src} -> {dst}\n"
        f"  prenda {size[0]}x{size[1]} sobre {CANVAS[0]}x{CANVAS[1]} "
        f"({100 * size[0] / CANVAS[0]:.1f}% ancho, {100 * size[1] / CANVAS[1]:.1f}% alto)"
    )


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit(__doc__)
    normalize(sys.argv[1], sys.argv[2])
