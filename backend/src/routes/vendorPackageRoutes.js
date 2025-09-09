import express from "express";
import { createPackage, getAllPackages, getVendorPackage } from "../controllers/packageController.js";

const router = express.Router();

router.post("/create",createPackage)
router.get("/get",getVendorPackage)
router.get("/getAll",getAllPackages)

export default router;