import { revalidateTag } from "next/cache";

import { INVENTORY_TAG } from "@/lib/inventory";

/**
 * Lo llama el cron de Vercel cada medianoche (hora Colombia). Solo marca el
 * caché como vencido: la consulta real a Odoo la hace la primera visita
 * posterior, sirviendo el dato anterior mientras llega el nuevo.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return Response.json({ error: "CRON_SECRET sin configurar" }, { status: 500 });
  }
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }

  revalidateTag(INVENTORY_TAG, "max");

  return Response.json({ ok: true, tag: INVENTORY_TAG, at: new Date().toISOString() });
}
