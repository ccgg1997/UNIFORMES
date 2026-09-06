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

## SEO

La URL canónica es `https://www.manantialdemoda.com` (`src/lib/site.ts`; se
puede sobreescribir con `NEXT_PUBLIC_SITE_URL`). Ya está implementado:

- Metatítulos y metadescripciones únicos por página, canónicas y un solo H1
  por página (distinto del meta-título).
- `robots.txt` y `sitemap.xml` generados por `src/app/robots.ts` y
  `src/app/sitemap.ts`. `/inventario` lleva `noindex` y está bloqueado en
  robots junto con `/api/` y `/page/`.
- `public/llms.txt` describe el sitio para asistentes de IA.
- JSON-LD: `ClothingStore` (negocio local, en el layout) y `FAQPage`
  (sección de preguntas frecuentes del inicio, `src/data/faq.ts`).
- CTA fijo de WhatsApp en móvil y botón de compartir en el footer.

### Pasos manuales pendientes

**GA4** (recomendado: vía el GTM ya instalado, `GTM-5GFGPG26`):

1. En [analytics.google.com](https://analytics.google.com) crea la propiedad
   "Manantial de Moda" y copia el ID de medición `G-XXXXXXXXXX`.
2. En [tagmanager.google.com](https://tagmanager.google.com), dentro del
   contenedor `GTM-5GFGPG26`: Etiquetas → Nueva → "Google Analytics: etiqueta
   de Google", pega el ID `G-…`, activador "All Pages" y publica el
   contenedor. No hace falta tocar el código.

**Google Search Console**:

1. En [search.google.com/search-console](https://search.google.com/search-console)
   agrega la propiedad de dominio `manantialdemoda.com` (verificación por DNS,
   la opción recomendada) o la propiedad de prefijo
   `https://www.manantialdemoda.com`.
2. Si eliges verificación por meta tag, agrega el código en
   `metadata.verification.google` dentro de `src/app/layout.tsx`.
3. Ya verificado, ve a **Sitemaps** y envía `https://www.manantialdemoda.com/sitemap.xml`.

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
