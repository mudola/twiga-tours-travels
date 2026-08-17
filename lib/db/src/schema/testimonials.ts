import { pgTable, text, integer, boolean, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const testimonialsTable = pgTable("testimonials", {
  id: uuid("id").primaryKey().defaultRandom(),
  author_name: text("author_name").notNull(),
  author_title: text("author_title"),
  avatar_url: text("avatar_url"),
  content: text("content").notNull(),
  rating: integer("rating").notNull().default(5),
  is_approved: boolean("is_approved").notNull().default(false),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertTestimonialSchema = createInsertSchema(testimonialsTable).omit({ id: true, created_at: true, updated_at: true });
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonialsTable.$inferSelect;
