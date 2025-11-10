import express from "express";
import { createPackage, deletePackageController, getAllPackages, getPackageHistory, getVendorPackage } from "../controllers/packageController.js";

const router = express.Router();

router.post("/create",createPackage)
router.get("/get",getVendorPackage)
router.get("/getAll",getAllPackages)
router.delete("/delete",deletePackageController)
router.post("/getHistory", getPackageHistory);

export default router;