import { Router } from "express";
import { db, toursTable, bookingsTable, inquiriesTable, destinationsTable, blogPostsTable, testimonialsTable } from "@workspace/db";
import { sql, eq } from "drizzle-orm";
import { requireAdmin } from "../../middlewares/require-admin.js";

const router = Router();

// GET /api/admin/dashboard/stats
router.get("/admin/dashboard/stats", requireAdmin, async (req, res) => {
  try {
    const [[tourCount], [bookingStats], [inquiryCount], [destCount], [blogCount], [testimonialCount]] = await Promise.all([
      db.select({ count: sql<number>`count(*)::int` }).from(toursTable),
      db.select({
        total: sql<number>`count(*)::int`,
        new_today: sql<number>`count(*) filter (where ${bookingsTable.created_at} > now() - interval '24 hours')::int`,
        pending: sql<number>`count(*) filter (where ${bookingsTable.status} = 'pending')::int`,
      }).from(bookingsTable),
      db.select({ count: sql<number>`count(*)::int` }).from(inquiriesTable),
      db.select({ count: sql<number>`count(*)::int` }).from(destinationsTable),
      db.select({ count: sql<number>`count(*)::int` }).from(blogPostsTable),
      db.select({ count: sql<number>`count(*)::int` }).from(testimonialsTable),
    ]);

    res.json({
      total_tours: tourCount.count,
      total_bookings: bookingStats.total,
      new_bookings: bookingStats.new_today,
      pending_bookings: bookingStats.pending,
      total_inquiries: inquiryCount.count,
      total_destinations: destCount.count,
      total_blog_posts: blogCount.count,
      total_testimonials: testimonialCount.count,
    });
  } catch (err) {
    req.log.error({ err }, "Dashboard stats error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
