import express from "express"
import {config} from "dotenv"
config();
import connectDB from "./config/dbConnection.js"
import authRoutes from "./routes/authRoutes.js"
import vendorAuthRoutes from "./routes/vendorAuthRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import cors from "cors"
const app = express()
const PORT = process.env.PORT || 3000

connectDB(process.env.MONGO_URI)
  .then(() => console.log("CONNECTED TO DATABASE"))
  .catch((err) => console.log("Error in connection database", err));

app.use(
  cors({
    origin: true, //["http://localhost:8081", "exp://192.168.1.5:19000"],
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Routes
app.use("/api/auth",authRoutes) // http:localhost:3000/api/auth/signup
app.use("/api/vendor",vendorAuthRoutes)//http:localhost:3000/api/vendor
app.use("/api/admin",adminRoutes)

app.listen(PORT,()=>console.log(`SERVER STARTED AT PORT ${PORT}`))