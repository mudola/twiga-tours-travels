import { Router } from "express";
import { db, siteSettingsTable } from "@workspace/db";
import { requireAdmin } from "../../middlewares/require-admin.js";

const router = Router();

router.get("/admin/settings", requireAdmin, async (req, res) => {
  try {
    res.json(await db.select().from(siteSettingsTable));
  } catch (err) { req.log.error({ err }); res.status(500).json({ error: "Internal server error" }); }
});

router.put("/admin/settings", requireAdmin, async (req, res) => {
  try {
    const { settings } = req.body as { settings?: Array<{ key: string; value: string }> };
    if (!Array.isArray(settings)) { res.status(400).json({ error: "settings array is required" }); return; }
    const results = await Promise.all(
      settings.map(({ key, value }) =>
        db.insert(siteSettingsTable).values({ key, value }).onConflictDoUpdate({ target: siteSettingsTable.key, set: { value, updated_at: new Date() } }).returning()
      )
    );
    res.json(results.flatMap((r) => r));
  } catch (err) { req.log.error({ err }); res.status(500).json({ error: "Internal server error" }); }
});

export default router;
