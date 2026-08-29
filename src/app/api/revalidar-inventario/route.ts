import { revalidatePath } from "next/cache";

import { refreshInventory } from "@/lib/inventory";

/**
 * Lo llama el cron de Vercel cada medianoche (hora Colombia). Valida primero
 * el MCP y solo entonces reemplaza el caché que consumen las páginas.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return Response.json({ error: "CRON_SECRET sin configurar" }, { status: 500 });
  }
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const inventory = await refreshInventory();

    revalidatePath("/");
    revalidatePath("/productos");
    revalidatePath("/inventario");

    return Response.json({
      ok: true,
      source: "mcp",
      updatedAt: inventory.updatedAt,
      products: inventory.products.length,
      variants: inventory.received,
    });
  } catch (error) {
    console.error("[inventario] Falló la actualización nocturna:", error);
    return Response.json(
      {
        ok: false,
        error: "No se pudo validar y actualizar el inventario desde el MCP",
      },
      { status: 503 },
    );
  }
}
