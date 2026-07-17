import { Router } from "express";
import { db, toursTable } from "@workspace/db";
import { eq, and, gte, lte, ilike, sql } from "drizzle-orm";
import { ListToursQueryParams } from "@workspace/api-zod";

const router = Router();

// GET /api/tours/featured — must come before /:slug
router.get("/tours/featured", async (req, res) => {
  try {
    const tours = await db
      .select()
      .from(toursTable)
      .where(eq(toursTable.is_featured, true))
      .limit(6);

    res.json(tours.map(formatTour));
  } catch (err) {
    req.log.error({ err }, "Failed to fetch featured tours");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/tours/stats
router.get("/tours/stats", async (req, res) => {
  try {
    const [stats] = await db
      .select({
        total_tours: sql<number>`count(*)::int`,
        destinations_count: sql<number>`count(distinct ${toursTable.destination})::int`,
        min_price: sql<number>`min(${toursTable.price_from})::numeric`,
        max_price: sql<number>`max(${toursTable.price_from})::numeric`,
      })
      .from(toursTable);

    const activityRows = await db
      .selectDistinct({ activity_type: toursTable.activity_type })
      .from(toursTable);

    res.json({
      total_tours: stats.total_tours,
      destinations_count: stats.destinations_count,
      min_price: Number(stats.min_price ?? 0),
      max_price: Number(stats.max_price ?? 0),
      activity_types: activityRows.map((r) => r.activity_type),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch tour stats");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/tours
router.get("/tours", async (req, res) => {
  try {
    const parsed = ListToursQueryParams.safeParse({
      destination: req.query.destination,
      min_duration: req.query.min_duration ? Number(req.query.min_duration) : undefined,
      max_duration: req.query.max_duration ? Number(req.query.max_duration) : undefined,
      min_price: req.query.min_price ? Number(req.query.min_price) : undefined,
      max_price: req.query.max_price ? Number(req.query.max_price) : undefined,
      activity_type: req.query.activity_type,
      is_featured: req.query.is_featured === "true" ? true : req.query.is_featured === "false" ? false : undefined,
    });

    const filters = [];

    if (parsed.success && parsed.data.destination) {
      filters.push(ilike(toursTable.destination, `%${parsed.data.destination}%`));
    }
    if (parsed.success && parsed.data.min_duration != null) {
      filters.push(gte(toursTable.duration_days, parsed.data.min_duration));
    }
    if (parsed.success && parsed.data.max_duration != null) {
      filters.push(lte(toursTable.duration_days, parsed.data.max_duration));
    }
    if (parsed.success && parsed.data.min_price != null) {
      filters.push(gte(toursTable.price_from, String(parsed.data.min_price)));
    }
    if (parsed.success && parsed.data.max_price != null) {
      filters.push(lte(toursTable.price_from, String(parsed.data.max_price)));
    }
    if (parsed.success && parsed.data.activity_type) {
      filters.push(eq(toursTable.activity_type, parsed.data.activity_type));
    }
    if (parsed.success && parsed.data.is_featured != null) {
      filters.push(eq(toursTable.is_featured, parsed.data.is_featured));
    }

    const tours = await db
      .select()
      .from(toursTable)
      .where(filters.length ? and(...filters) : undefined);

    res.json(tours.map(formatTour));
  } catch (err) {
    req.log.error({ err }, "Failed to fetch tours");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/tours/:slug
router.get("/tours/:slug", async (req, res) => {
  try {
    const [tour] = await db
      .select()
      .from(toursTable)
      .where(eq(toursTable.slug, req.params.slug));

    if (!tour) {
      res.status(404).json({ error: "Tour not found" });
      return;
    }

    res.json(formatTour(tour));
  } catch (err) {
    req.log.error({ err }, "Failed to fetch tour by slug");
    res.status(500).json({ error: "Internal server error" });
  }
});

function formatTour(tour: typeof toursTable.$inferSelect) {
  return {
    ...tour,
    price_from: Number(tour.price_from),
    gallery_urls: tour.gallery_urls ?? [],
    itinerary: tour.itinerary ?? [],
    inclusions: tour.inclusions ?? [],
    exclusions: tour.exclusions ?? [],
    created_at: tour.created_at.toISOString(),
  };
}

export default router;
