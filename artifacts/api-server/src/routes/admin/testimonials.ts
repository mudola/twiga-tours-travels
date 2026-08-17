import { Router } from "express";
import { db, testimonialsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAdmin } from "../../middlewares/require-admin.js";

const router = Router();

function fmt(t: typeof testimonialsTable.$inferSelect) {
  return { ...t, created_at: t.created_at.toISOString() };
}

router.get("/admin/testimonials", requireAdmin, async (req, res) => {
  try {
    res.json((await db.select().from(testimonialsTable).orderBy(desc(testimonialsTable.created_at))).map(fmt));
  } catch (err) { req.log.error({ err }); res.status(500).json({ error: "Internal server error" }); }
});

router.post("/admin/testimonials", requireAdmin, async (req, res) => {
  try {
    const [t] = await db.insert(testimonialsTable).values(req.body as any).returning();
    res.status(201).json(fmt(t));
  } catch (err) { req.log.error({ err }); res.status(500).json({ error: "Internal server error" }); }
});

router.patch("/admin/testimonials/:id", requireAdmin, async (req, res) => {
  try {
    const [t] = await db.update(testimonialsTable).set(req.body as any).where(eq(testimonialsTable.id, req.params["id"] as string)).returning();
    if (!t) { res.status(404).json({ error: "Not found" }); return; }
    res.json(fmt(t));
  } catch (err) { req.log.error({ err }); res.status(500).json({ error: "Internal server error" }); }
});

router.delete("/admin/testimonials/:id", requireAdmin, async (req, res) => {
  try {
    await db.delete(testimonialsTable).where(eq(testimonialsTable.id, req.params["id"] as string));
    res.status(204).end();
  } catch (err) { req.log.error({ err }); res.status(500).json({ error: "Internal server error" }); }
});

export default router;
