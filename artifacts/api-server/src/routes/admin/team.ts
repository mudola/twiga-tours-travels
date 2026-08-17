import { Router } from "express";
import { db, teamMembersTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { requireAdmin } from "../../middlewares/require-admin.js";

const router = Router();

function fmt(m: typeof teamMembersTable.$inferSelect) {
  return { ...m, created_at: m.created_at.toISOString() };
}

router.get("/admin/team", requireAdmin, async (req, res) => {
  try {
    res.json((await db.select().from(teamMembersTable).orderBy(asc(teamMembersTable.sort_order))).map(fmt));
  } catch (err) { req.log.error({ err }); res.status(500).json({ error: "Internal server error" }); }
});

router.post("/admin/team", requireAdmin, async (req, res) => {
  try {
    const [member] = await db.insert(teamMembersTable).values(req.body as any).returning();
    res.status(201).json(fmt(member));
  } catch (err) { req.log.error({ err }); res.status(500).json({ error: "Internal server error" }); }
});

router.patch("/admin/team/:id", requireAdmin, async (req, res) => {
  try {
    const [member] = await db.update(teamMembersTable).set(req.body as any).where(eq(teamMembersTable.id, req.params["id"] as string)).returning();
    if (!member) { res.status(404).json({ error: "Not found" }); return; }
    res.json(fmt(member));
  } catch (err) { req.log.error({ err }); res.status(500).json({ error: "Internal server error" }); }
});

router.delete("/admin/team/:id", requireAdmin, async (req, res) => {
  try {
    await db.delete(teamMembersTable).where(eq(teamMembersTable.id, req.params["id"] as string));
    res.status(204).end();
  } catch (err) { req.log.error({ err }); res.status(500).json({ error: "Internal server error" }); }
});

export default router;
