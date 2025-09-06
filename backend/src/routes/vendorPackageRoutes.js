import express from "express";
import { createPackage, getVendorPackage } from "../controllers/packageController.js";

const router = express.Router();

router.post("/create",createPackage)

router.get("/get",getVendorPackage)

export default router;