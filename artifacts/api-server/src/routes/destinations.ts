import { Router } from "express";
import { db, toursTable } from "@workspace/db";
import { sql } from "drizzle-orm";

const router = Router();

const DESTINATION_IMAGES: Record<string, string> = {
  "Maasai Mara": "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",
  "Amboseli": "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80",
  "Diani Beach": "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=800&q=80",
  "Tsavo": "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=800&q=80",
  "Mount Kenya": "https://images.unsplash.com/photo-1609198092458-38a293c7ac4b?w=800&q=80",
  "Samburu": "https://images.unsplash.com/photo-1551009175-15bdf9dcb580?w=800&q=80",
  "Nairobi": "https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=800&q=80",
  "Lake Nakuru": "https://images.unsplash.com/photo-1547745050-b4a9e0aa4e0e?w=800&q=80",
};

const DESTINATION_DESCRIPTIONS: Record<string, string> = {
  "Maasai Mara": "The world's most iconic safari destination, home to the great wildebeest migration.",
  "Amboseli": "Sweeping plains beneath the snow-capped peak of Mount Kilimanjaro.",
  "Diani Beach": "Pristine white-sand beaches and turquoise waters along Kenya's south coast.",
  "Tsavo": "Kenya's largest national park — vast, raw, and teeming with wildlife.",
  "Mount Kenya": "Africa's second-highest peak offers dramatic trekking and highland scenery.",
  "Samburu": "Remote northern wilderness with rare species found nowhere else in Kenya.",
  "Nairobi": "East Africa's dynamic capital — the gateway to world-class safaris.",
  "Lake Nakuru": "Flamingo-fringed soda lake famous for rhinos, lions, and dramatic birdlife.",
};

// GET /api/destinations
router.get("/destinations", async (req, res) => {
  try {
    const rows = await db
      .select({
        name: toursTable.destination,
        tour_count: sql<number>`count(*)::int`,
      })
      .from(toursTable)
      .groupBy(toursTable.destination)
      .orderBy(sql`count(*) desc`);

    const destinations = rows.map((row) => ({
      name: row.name,
      tour_count: row.tour_count,
      image_url: DESTINATION_IMAGES[row.name] ?? null,
      description: DESTINATION_DESCRIPTIONS[row.name] ?? null,
    }));

    res.json(destinations);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch destinations");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
