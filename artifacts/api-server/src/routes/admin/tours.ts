import { Router } from "express";
import { db, toursTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../../middlewares/require-admin.js";

const router = Router();

function fmt(t: typeof toursTable.$inferSelect) {
  return { ...t, price_from: Number(t.price_from), gallery_urls: t.gallery_urls ?? [], itinerary: t.itinerary ?? [], inclusions: t.inclusions ?? [], exclusions: t.exclusions ?? [], created_at: t.created_at.toISOString() };
}

router.get("/admin/tours", requireAdmin, async (req, res) => {
  try {
    const tours = await db.select().from(toursTable).orderBy(toursTable.created_at);
    res.json(tours.map(fmt));
  } catch (err) { req.log.error({ err }); res.status(500).json({ error: "Internal server error" }); }
});

router.post("/admin/tours", requireAdmin, async (req, res) => {
  try {
    const [tour] = await db.insert(toursTable).values(req.body as any).returning();
    res.status(201).json(fmt(tour));
  } catch (err) { req.log.error({ err }); res.status(500).json({ error: "Internal server error" }); }
});

router.get("/admin/tours/:id", requireAdmin, async (req, res) => {
  try {
    const [tour] = await db.select().from(toursTable).where(eq(toursTable.id, req.params["id"] as string));
    if (!tour) { res.status(404).json({ error: "Not found" }); return; }
    res.json(fmt(tour));
  } catch (err) { req.log.error({ err }); res.status(500).json({ error: "Internal server error" }); }
});

router.patch("/admin/tours/:id", requireAdmin, async (req, res) => {
  try {
    const [tour] = await db.update(toursTable).set(req.body as any).where(eq(toursTable.id, req.params["id"] as string)).returning();
    if (!tour) { res.status(404).json({ error: "Not found" }); return; }
    res.json(fmt(tour));
  } catch (err) { req.log.error({ err }); res.status(500).json({ error: "Internal server error" }); }
});

router.delete("/admin/tours/:id", requireAdmin, async (req, res) => {
  try {
    await db.delete(toursTable).where(eq(toursTable.id, req.params["id"] as string));
    res.status(204).end();
  } catch (err) { req.log.error({ err }); res.status(500).json({ error: "Internal server error" }); }
});

export default router;
