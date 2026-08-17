import { Router } from "express";
import { db, destinationsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../../middlewares/require-admin.js";

const router = Router();

function fmt(d: typeof destinationsTable.$inferSelect) {
  return { ...d, created_at: d.created_at.toISOString() };
}

router.get("/admin/destinations", requireAdmin, async (req, res) => {
  try {
    res.json((await db.select().from(destinationsTable).orderBy(destinationsTable.name)).map(fmt));
  } catch (err) { req.log.error({ err }); res.status(500).json({ error: "Internal server error" }); }
});

router.post("/admin/destinations", requireAdmin, async (req, res) => {
  try {
    const [dest] = await db.insert(destinationsTable).values(req.body as any).returning();
    res.status(201).json(fmt(dest));
  } catch (err) { req.log.error({ err }); res.status(500).json({ error: "Internal server error" }); }
});

router.patch("/admin/destinations/:id", requireAdmin, async (req, res) => {
  try {
    const [dest] = await db.update(destinationsTable).set(req.body as any).where(eq(destinationsTable.id, req.params["id"] as string)).returning();
    if (!dest) { res.status(404).json({ error: "Not found" }); return; }
    res.json(fmt(dest));
  } catch (err) { req.log.error({ err }); res.status(500).json({ error: "Internal server error" }); }
});

router.delete("/admin/destinations/:id", requireAdmin, async (req, res) => {
  try {
    await db.delete(destinationsTable).where(eq(destinationsTable.id, req.params["id"] as string));
    res.status(204).end();
  } catch (err) { req.log.error({ err }); res.status(500).json({ error: "Internal server error" }); }
});

export default router;
