import { Router } from "express";
import { db, blogPostsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAdmin } from "../../middlewares/require-admin.js";

const router = Router();

function fmt(p: typeof blogPostsTable.$inferSelect) {
  return { ...p, tags: p.tags ?? [], created_at: p.created_at.toISOString(), updated_at: p.updated_at.toISOString() };
}

router.get("/admin/blog", requireAdmin, async (req, res) => {
  try {
    res.json((await db.select().from(blogPostsTable).orderBy(desc(blogPostsTable.created_at))).map(fmt));
  } catch (err) { req.log.error({ err }); res.status(500).json({ error: "Internal server error" }); }
});

router.post("/admin/blog", requireAdmin, async (req, res) => {
  try {
    const [post] = await db.insert(blogPostsTable).values(req.body as any).returning();
    res.status(201).json(fmt(post));
  } catch (err) { req.log.error({ err }); res.status(500).json({ error: "Internal server error" }); }
});

router.get("/admin/blog/:id", requireAdmin, async (req, res) => {
  try {
    const [post] = await db.select().from(blogPostsTable).where(eq(blogPostsTable.id, req.params["id"] as string));
    if (!post) { res.status(404).json({ error: "Not found" }); return; }
    res.json(fmt(post));
  } catch (err) { req.log.error({ err }); res.status(500).json({ error: "Internal server error" }); }
});

router.patch("/admin/blog/:id", requireAdmin, async (req, res) => {
  try {
    const [post] = await db.update(blogPostsTable).set(req.body as any).where(eq(blogPostsTable.id, req.params["id"] as string)).returning();
    if (!post) { res.status(404).json({ error: "Not found" }); return; }
    res.json(fmt(post));
  } catch (err) { req.log.error({ err }); res.status(500).json({ error: "Internal server error" }); }
});

router.delete("/admin/blog/:id", requireAdmin, async (req, res) => {
  try {
    await db.delete(blogPostsTable).where(eq(blogPostsTable.id, req.params["id"] as string));
    res.status(204).end();
  } catch (err) { req.log.error({ err }); res.status(500).json({ error: "Internal server error" }); }
});

export default router;
