import { Router } from "express";
import { db, bookingsTable } from "@workspace/db";
import { CreateBookingBody } from "@workspace/api-zod";

const router = Router();

// POST /api/bookings
router.post("/bookings", async (req, res) => {
  try {
    const parsed = CreateBookingBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Validation error", details: parsed.error.issues });
      return;
    }

    const data = parsed.data;

    const [booking] = await db
      .insert(bookingsTable)
      .values({
        tour_id: data.tour_id ?? null,
        tour_title: data.tour_title ?? null,
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        travel_start_date: data.travel_start_date,
        travel_end_date: data.travel_end_date ?? null,
        num_travelers: data.num_travelers,
        accommodation_level: data.accommodation_level ?? null,
        special_requests: data.special_requests ?? null,
        add_ons: data.add_ons ?? [],
        status: "new",
      })
      .returning();

    res.status(201).json({
      ...booking,
      add_ons: booking.add_ons ?? [],
      created_at: booking.created_at.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to create booking");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
