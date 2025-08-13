import express from "express"
import {config} from "dotenv"
config();
import authRoutes from "./routes/authRoutes.js"
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Routes
app.use("/api/auth",authRoutes)

app.listen(PORT,()=>console.log(`SERVER STARTED AT PORT ${PORT}`))