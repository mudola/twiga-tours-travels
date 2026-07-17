import { pgTable, text, integer, boolean, jsonb, timestamp, uuid, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const bookingsTable = pgTable("bookings", {
  id: uuid("id").primaryKey().defaultRandom(),
  tour_id: uuid("tour_id"),
  tour_title: text("tour_title"),
  full_name: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  travel_start_date: text("travel_start_date").notNull(),
  travel_end_date: text("travel_end_date"),
  num_travelers: integer("num_travelers").notNull(),
  accommodation_level: text("accommodation_level"),
  special_requests: text("special_requests"),
  add_ons: text("add_ons").array().notNull().default([]),
  status: text("status").notNull().default("new"),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const insertBookingSchema = createInsertSchema(bookingsTable).omit({ id: true, created_at: true, status: true });
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookingsTable.$inferSelect;
