import { Router, type IRouter } from "express";
import healthRouter from "./health";
import toursRouter from "./tours";
import bookingsRouter from "./bookings";
import inquiriesRouter from "./inquiries";
import destinationsRouter from "./destinations";
import adminRouter from "./admin/index.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(toursRouter);
router.use(bookingsRouter);
router.use(inquiriesRouter);
router.use(destinationsRouter);
router.use(adminRouter);

export default router;
