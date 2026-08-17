import { Router } from "express";
import { db, inquiriesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAdmin } from "../../middlewares/require-admin.js";

const router = Router();

function fmt(i: typeof inquiriesTable.$inferSelect) {
  return { ...i, created_at: i.created_at.toISOString() };
}

router.get("/admin/inquiries", requireAdmin, async (req, res) => {
  try {
    res.json((await db.select().from(inquiriesTable).orderBy(desc(inquiriesTable.created_at))).map(fmt));
  } catch (err) { req.log.error({ err }); res.status(500).json({ error: "Internal server error" }); }
});

router.delete("/admin/inquiries/:id", requireAdmin, async (req, res) => {
  try {
    await db.delete(inquiriesTable).where(eq(inquiriesTable.id, req.params["id"] as string));
    res.status(204).end();
  } catch (err) { req.log.error({ err }); res.status(500).json({ error: "Internal server error" }); }
});

export default router;
