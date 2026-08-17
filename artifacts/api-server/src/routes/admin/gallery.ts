import { Router } from "express";
import { db, galleryImagesTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { requireAdmin } from "../../middlewares/require-admin.js";

const router = Router();

function fmt(g: typeof galleryImagesTable.$inferSelect) {
  return { ...g, created_at: g.created_at.toISOString() };
}

router.get("/admin/gallery", requireAdmin, async (req, res) => {
  try {
    res.json((await db.select().from(galleryImagesTable).orderBy(asc(galleryImagesTable.sort_order))).map(fmt));
  } catch (err) { req.log.error({ err }); res.status(500).json({ error: "Internal server error" }); }
});

router.post("/admin/gallery", requireAdmin, async (req, res) => {
  try {
    const [img] = await db.insert(galleryImagesTable).values(req.body as any).returning();
    res.status(201).json(fmt(img));
  } catch (err) { req.log.error({ err }); res.status(500).json({ error: "Internal server error" }); }
});

router.delete("/admin/gallery/:id", requireAdmin, async (req, res) => {
  try {
    await db.delete(galleryImagesTable).where(eq(galleryImagesTable.id, req.params["id"] as string));
    res.status(204).end();
  } catch (err) { req.log.error({ err }); res.status(500).json({ error: "Internal server error" }); }
});

export default router;
