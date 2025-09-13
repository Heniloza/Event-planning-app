import BOOKING from "../models/bookingModel.js";
import PACKAGE from "../models/packageModel.js";



export const bookServiceController  = async (req, res) => {
    try {
         const { userId, packageId, eventDate, guests } = req.body;

         if (!userId || !packageId || !eventDate || !guests) {
           return res.status(400).json({ message: "All fields are required" });
         }

         const pkg = await PACKAGE.findById(packageId);
         if (!pkg) {
           return res.status(404).json({ message: "Package not found" });
         }

         const newBooking = await BOOKING.create({
           userId,
           packageId,
           eventDate,
           guests,
         });
            

         return res.status(201).json({
           message: "Booking created successfully",
           data: newBooking,
         });



    } catch (error) {
        console.error("Error in bookServiceController:", error);
        res.status(500).json({ message: "Server error in booking service" });
    }
}