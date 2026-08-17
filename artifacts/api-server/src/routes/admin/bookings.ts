import { Router } from "express";
import { db, bookingsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAdmin } from "../../middlewares/require-admin.js";

const router = Router();

function fmt(b: typeof bookingsTable.$inferSelect) {
  return { ...b, add_ons: b.add_ons ?? [], created_at: b.created_at.toISOString() };
}

router.get("/admin/bookings", requireAdmin, async (req, res) => {
  try {
    const rows = await db.select().from(bookingsTable).orderBy(desc(bookingsTable.created_at));
    res.json(rows.map(fmt));
  } catch (err) { req.log.error({ err }); res.status(500).json({ error: "Internal server error" }); }
});

router.patch("/admin/bookings/:id/status", requireAdmin, async (req, res) => {
  try {
    const { status } = req.body as { status?: string };
    if (!status) { res.status(400).json({ error: "status is required" }); return; }
    const [booking] = await db.update(bookingsTable).set({ status }).where(eq(bookingsTable.id, req.params["id"] as string)).returning();
    if (!booking) { res.status(404).json({ error: "Not found" }); return; }
    res.json(fmt(booking));
  } catch (err) { req.log.error({ err }); res.status(500).json({ error: "Internal server error" }); }
});

export default router;
