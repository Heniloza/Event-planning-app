import PACKAGE from "../models/packageModel.js";
import VENDOR from "../models/vendorModel.js";
import cloudinary from "../utils/cloudinary.js";

export const createPackage = async (req, res) => {
    try {
        const {
            vendorId,
            name,
            description,
            price,
            services_included,
            image,
            policies,
            theme
        } = req.body;

    if (
      !vendorId ||
      !name ||
      !price ||
      !services_included ||
      !description ||
      !policies
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

      if (image) {
      const imageSizeInBytes = (image.length * 3) / 4;
      const maxSizeInBytes = 2 * 1024 * 1024;

      if (imageSizeInBytes > maxSizeInBytes) {
        return res.status(400).json({
          success: false,
          message:
            "Image size too large. Please upload an image smaller than 2MB.",
        });
      }
    }

    const vendor = await VENDOR.findById(vendorId);
        if (!vendor) {
            return res
            .status(404)
            .json({ success: false, message: "Vendor not found" });
    }

    const uploadedImage = await cloudinary.uploader.upload(image, {
        resource_type: "auto", 
    });

    const newPackage = await PACKAGE.create({
        vendor: vendorId,
        name,
        description,
        price,
        services_included,
        image:uploadedImage.secure_url ||"",
        policies,
        theme,
    });

    res.status(201).json({
        message: "Package created successfully",
        data: newPackage,
    });

    } catch (error) {
        console.error("Error in creating package:", error.message);
        res.status(500).json({ message: "Server Error" }); 
    }
}

export const getVendorPackage = async (req, res) => {
  try {
   const { vendorId } = req.query;

     if (!vendorId) {
       return res
         .status(400)
         .json({ success: false, message: "Vendor ID is required" });
     }

    const packages = await PACKAGE.find({ vendor: vendorId });

     if (!packages || packages.length === 0) {
       return res
         .status(404)
         .json({
           success: false,
           message: "No packages found for this vendor",
         });
     }

     res.status(200).json({
       message:"Vendor package fetched successfully",
       data: packages,
     });
  } catch (error) {
    console.error("Error in fetching vendor package:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getAllPackages = async (req, res) => {
  try {
    const packages = await PACKAGE.find().populate(
      "vendor",
      "business_name owner_name email phone location category"
    );

    if (!packages || packages.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No packages found" });
    }

    res.status(200).json({
      message: "All packages fetched successfully",
      data: packages,
    });
  } catch (error) {
    console.error("Error in fetching all packages:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};
