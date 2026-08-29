# Manantial de Moda — Catálogo de uniformes

One page de uniformes escolares para Colegios Arquidiocesanos y Comfandi. Toda la experiencia vive en `/`: Inicio (hero + acceso rápido por colegio) y Prendas (filtros, grid y drawer de producto). No hay carrito ni checkout: cada consulta abre WhatsApp con el mensaje precargado.

## Stack

- Next.js 16 (App Router, una sola ruta)
- React 19 + TypeScript
- Tailwind CSS 4 (solo light mode)

## Desarrollo local

```bash
pnpm install
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Verificación

```bash
pnpm typecheck
pnpm lint
pnpm build
```

## Estructura

```
src/
  app/page.tsx           # única página: Inicio + Prendas
  components/            # header, hero, products-section, product-drawer, footer…
  data/products.ts       # catálogo (colegios, prendas, precios)
  lib/whatsapp.ts        # mensajes y enlaces wa.me
  lib/scroll.ts          # scroll suave y filtro por colegio
```

## Privacidad de los activos

La carpeta local `FOTOS/` está excluida del repositorio. Solo se publican en `public/images/` los recursos gráficos necesarios para el catálogo; documentos administrativos y demás material fuente no forman parte del sitio.
