import { pgTable, text, integer, numeric, boolean, jsonb, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const toursTable = pgTable("tours", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  destination: text("destination").notNull(),
  duration_days: integer("duration_days").notNull(),
  price_from: numeric("price_from", { precision: 10, scale: 2 }).notNull(),
  summary: text("summary").notNull(),
  activity_type: text("activity_type").notNull().default("safari"),
  gallery_urls: text("gallery_urls").array().notNull().default([]),
  itinerary: jsonb("itinerary").notNull().default([]),
  inclusions: text("inclusions").array().notNull().default([]),
  exclusions: text("exclusions").array().notNull().default([]),
  is_featured: boolean("is_featured").notNull().default(false),
  max_group_size: integer("max_group_size"),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const insertTourSchema = createInsertSchema(toursTable).omit({ id: true, created_at: true });
export type InsertTour = z.infer<typeof insertTourSchema>;
export type Tour = typeof toursTable.$inferSelect;
