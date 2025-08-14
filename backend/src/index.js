import express from "express"
import {config} from "dotenv"
config();
import connectDB from "./config/dbConnection.js"
import authRoutes from "./routes/authRoutes.js"
const app = express()
const PORT = process.env.PORT || 3000

connectDB(process.env.MONGO_URI)
  .then(() => console.log("CONNECTED TO DATABASE"))
  .catch((err) => console.log("Error in connection database", err));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Routes
app.use("/api/auth",authRoutes)

app.listen(PORT,()=>console.log(`SERVER STARTED AT PORT ${PORT}`))