import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import dotenv from "dotenv"
import authroute from "./routes/auth.routes.js"
dotenv.config()

const app = express()
const PORT = 4000

//db
connectDB()

// MIDDLEWARE
app.use(express.json())
app.use(cors())

// routes
app.use("/api/auth",authroute)

app.get("/", (req, res) => {
    res.send("Api is working")
})

// listen the server 
app.listen(PORT, () => {
   console.log(`server is running on http://localhost:${PORT}`)
})