import { Router, type IRouter } from "express";
import healthRouter from "./health";
import toursRouter from "./tours";
import bookingsRouter from "./bookings";
import inquiriesRouter from "./inquiries";
import destinationsRouter from "./destinations";

const router: IRouter = Router();

router.use(healthRouter);
router.use(toursRouter);
router.use(bookingsRouter);
router.use(inquiriesRouter);
router.use(destinationsRouter);

export default router;
