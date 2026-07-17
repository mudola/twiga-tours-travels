import { Router } from "express";
import { db, inquiriesTable } from "@workspace/db";
import { CreateInquiryBody } from "@workspace/api-zod";

const router = Router();

// POST /api/inquiries
router.post("/inquiries", async (req, res) => {
  try {
    const parsed = CreateInquiryBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Validation error", details: parsed.error.issues });
      return;
    }

    const data = parsed.data;

    const [inquiry] = await db
      .insert(inquiriesTable)
      .values({
        full_name: data.full_name,
        email: data.email,
        phone: data.phone ?? null,
        message: data.message,
      })
      .returning();

    res.status(201).json({
      ...inquiry,
      created_at: inquiry.created_at.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to create inquiry");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
