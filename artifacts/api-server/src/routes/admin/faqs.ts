import { Router } from "express";
import { db, faqsTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { requireAdmin } from "../../middlewares/require-admin.js";

const router = Router();

function fmt(f: typeof faqsTable.$inferSelect) {
  return { ...f, created_at: f.created_at.toISOString() };
}

router.get("/admin/faqs", requireAdmin, async (req, res) => {
  try {
    res.json((await db.select().from(faqsTable).orderBy(asc(faqsTable.sort_order))).map(fmt));
  } catch (err) { req.log.error({ err }); res.status(500).json({ error: "Internal server error" }); }
});

router.post("/admin/faqs", requireAdmin, async (req, res) => {
  try {
    const [faq] = await db.insert(faqsTable).values(req.body as any).returning();
    res.status(201).json(fmt(faq));
  } catch (err) { req.log.error({ err }); res.status(500).json({ error: "Internal server error" }); }
});

router.patch("/admin/faqs/:id", requireAdmin, async (req, res) => {
  try {
    const [faq] = await db.update(faqsTable).set(req.body as any).where(eq(faqsTable.id, req.params["id"] as string)).returning();
    if (!faq) { res.status(404).json({ error: "Not found" }); return; }
    res.json(fmt(faq));
  } catch (err) { req.log.error({ err }); res.status(500).json({ error: "Internal server error" }); }
});

router.delete("/admin/faqs/:id", requireAdmin, async (req, res) => {
  try {
    await db.delete(faqsTable).where(eq(faqsTable.id, req.params["id"] as string));
    res.status(204).end();
  } catch (err) { req.log.error({ err }); res.status(500).json({ error: "Internal server error" }); }
});

export default router;
