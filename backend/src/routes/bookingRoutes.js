import express from "express";
import { bookServiceController } from "../controllers/bookingController.js";

const router = express.Router();

router.post("/book", bookServiceController);

export default router;