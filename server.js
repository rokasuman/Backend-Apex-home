import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import dotenv from "dotenv"
import authroute from "./routes/auth.routes.js"
import userRouter from "./routes/user.routes.js"
import propertyRouter from "./routes/property.routes.js"
import inquiriesRouter from "./routes/inquries.router.js"
import wishListRouter from "./routes/wishlist.routes.js"
import contactRouter from "./routes/contact.routes.js"
import amdinRouter from "./routes/admin.routes.js"

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
app.use("/api/user",userRouter)
app.use("/api/property",propertyRouter)
app.use("/api/inquries",inquiriesRouter)
app.use("/api/wishlist",wishListRouter)
app.use("/api/contact",contactRouter)

//admin router 
app.use("/api/admin",amdinRouter)


app.get("/", (req, res) => {
    res.send("Api is working")
})

// listen the server 
app.listen(PORT, () => {
   console.log(`server is running on http://localhost:${PORT}`)
})