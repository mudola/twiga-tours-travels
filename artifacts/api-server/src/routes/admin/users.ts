import { Router } from "express";
import bcrypt from "bcryptjs";
import { db, adminUsersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin, requireRole } from "../../middlewares/require-admin.js";

const router = Router();

function safeUser(u: typeof adminUsersTable.$inferSelect) {
  const { password_hash: _pw, ...safe } = u;
  return { ...safe, created_at: u.created_at.toISOString() };
}

router.get("/admin/users", requireAdmin, requireRole("super_admin"), async (req, res) => {
  try {
    const rows = await db.select().from(adminUsersTable);
    res.json(rows.map(safeUser));
  } catch (err) {
    req.log.error({ err });
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/users", requireAdmin, requireRole("super_admin"), async (req, res) => {
  try {
    const { name, email, password, role } = req.body as { name: string; email: string; password: string; role: string };
    if (!name || !email || !password || !role) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }
    const password_hash = await bcrypt.hash(password, 12);
    const [user] = await db.insert(adminUsersTable).values({ name, email: email.toLowerCase(), password_hash, role }).returning();
    res.status(201).json(safeUser(user));
  } catch (err) {
    req.log.error({ err });
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/admin/users/:id", requireAdmin, requireRole("super_admin"), async (req, res) => {
  try {
    const id = req.params["id"] as string;
    const { name, email, role, is_active } = req.body as { name?: string; email?: string; role?: string; is_active?: boolean };
    const patch: Partial<typeof adminUsersTable.$inferInsert> = {};
    if (name !== undefined) patch.name = name;
    if (email !== undefined) patch.email = email.toLowerCase();
    if (role !== undefined) patch.role = role;
    if (is_active !== undefined) patch.is_active = is_active;
    const [user] = await db.update(adminUsersTable).set(patch).where(eq(adminUsersTable.id, id)).returning();
    if (!user) { res.status(404).json({ error: "Not found" }); return; }
    res.json(safeUser(user));
  } catch (err) {
    req.log.error({ err });
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/admin/users/:id", requireAdmin, requireRole("super_admin"), async (req, res) => {
  try {
    const id = req.params["id"] as string;
    if (id === req.admin!.sub) {
      res.status(400).json({ error: "Cannot delete your own account" });
      return;
    }
    await db.delete(adminUsersTable).where(eq(adminUsersTable.id, id));
    res.status(204).end();
  } catch (err) {
    req.log.error({ err });
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
