import { Router } from "express";
import bcrypt from "bcryptjs";
import { db, adminUsersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { signAdminToken } from "../../lib/jwt.js";
import { requireAdmin } from "../../middlewares/require-admin.js";

const router = Router();

function safeUser(u: typeof adminUsersTable.$inferSelect) {
  const { password_hash: _, ...safe } = u;
  return { ...safe, created_at: u.created_at.toISOString() };
}

// POST /api/admin/auth/login
router.post("/admin/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };
    if (!email || !password) {
      res.status(400).json({ error: "email and password are required" });
      return;
    }

    const [user] = await db.select().from(adminUsersTable).where(eq(adminUsersTable.email, email.toLowerCase()));
    if (!user || !user.is_active) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = await signAdminToken({ sub: user.id, email: user.email, role: user.role, name: user.name });
    res.json({ token, user: safeUser(user) });
  } catch (err) {
    req.log.error({ err }, "Login error");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/admin/auth/me
router.get("/admin/auth/me", requireAdmin, async (req, res) => {
  try {
    const [user] = await db.select().from(adminUsersTable).where(eq(adminUsersTable.id, req.admin!.sub));
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(safeUser(user));
  } catch (err) {
    req.log.error({ err }, "Get me error");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/admin/auth/change-password
router.post("/admin/auth/change-password", requireAdmin, async (req, res) => {
  try {
    const { current_password, new_password } = req.body as { current_password?: string; new_password?: string };
    if (!current_password || !new_password || new_password.length < 8) {
      res.status(400).json({ error: "Invalid request" });
      return;
    }

    const [user] = await db.select().from(adminUsersTable).where(eq(adminUsersTable.id, req.admin!.sub));
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const valid = await bcrypt.compare(current_password, user.password_hash);
    if (!valid) {
      res.status(400).json({ error: "Current password is incorrect" });
      return;
    }

    const password_hash = await bcrypt.hash(new_password, 12);
    await db.update(adminUsersTable).set({ password_hash }).where(eq(adminUsersTable.id, user.id));
    res.json({ message: "Password changed successfully" });
  } catch (err) {
    req.log.error({ err }, "Change password error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
