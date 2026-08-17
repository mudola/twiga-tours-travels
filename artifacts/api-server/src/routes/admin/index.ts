import { Router } from "express";
import authRouter from "./auth.js";
import dashboardRouter from "./dashboard.js";
import toursRouter from "./tours.js";
import destinationsRouter from "./destinations.js";
import bookingsRouter from "./bookings.js";
import inquiriesRouter from "./inquiries.js";
import galleryRouter from "./gallery.js";
import testimonialsRouter from "./testimonials.js";
import blogRouter from "./blog.js";
import faqsRouter from "./faqs.js";
import teamRouter from "./team.js";
import settingsRouter from "./settings.js";
import usersRouter from "./users.js";

const router = Router();

router.use(authRouter);
router.use(dashboardRouter);
router.use(toursRouter);
router.use(destinationsRouter);
router.use(bookingsRouter);
router.use(inquiriesRouter);
router.use(galleryRouter);
router.use(testimonialsRouter);
router.use(blogRouter);
router.use(faqsRouter);
router.use(teamRouter);
router.use(settingsRouter);
router.use(usersRouter);

export default router;
