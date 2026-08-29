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

## Inventario y precios

Odoo es la única fuente de tallas, precios y existencias. El sitio consulta la
herramienta MCP `verificar_inventario`, enlaza cada variante mediante
`odooName` y conserva nombre comercial, colegio e imagen como metadatos de
presentación locales.

- Las tarjetas muestran `Desde…` cuando las tallas tienen precios distintos.
- El drawer y el mensaje de WhatsApp usan el precio y las existencias de la
  talla seleccionada.
- Si el MCP falla o devuelve una respuesta truncada, se usa el último snapshot
  validado de `src/data/inventory.json`; nunca un precio fijo manual.
- Vercel llama `/api/revalidar-inventario` a las `05:00 UTC` (medianoche en
  Colombia). El endpoint expira la caché, consulta el MCP y verifica el
  resultado antes de responder.

En producción deben existir `ODOO_MCP_URL` y `CRON_SECRET`. Vercel envía
automáticamente `CRON_SECRET` como `Authorization: Bearer …` al ejecutar el
cron. Después de configurarlas hay que volver a desplegar para registrar el
cron de producción.

Para actualizar manualmente el snapshot de respaldo:

```bash
pnpm sync:inventory
```

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
  data/products.ts       # metadatos visuales y enlace odooName
  data/inventory.json    # último snapshot validado del MCP
  lib/catalog.ts         # une metadatos con variantes de Odoo
  lib/inventory.ts       # cliente MCP, validación y caché diaria
  lib/whatsapp.ts        # mensajes y enlaces wa.me
  lib/scroll.ts          # scroll suave y filtro por colegio
```

## Privacidad de los activos

La carpeta local `FOTOS/` está excluida del repositorio. Solo se publican en `public/images/` los recursos gráficos necesarios para el catálogo; documentos administrativos y demás material fuente no forman parte del sitio.
