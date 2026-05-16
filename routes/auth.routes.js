import express from "express"
import { forgotPassword, getMe, login, registration, resetPassword, verifyEmail } from "../controller/authcontroller.js"
import { protect } from "../middlewares/auth.middleware.js"


const authroute = express.Router()

authroute.post("/register",registration)
authroute.post("/login",login)

authroute.get("/me",protect,getMe)
authroute.post("/verify-email",verifyEmail)

authroute.post("/forgot-password",forgotPassword)
authroute.post("/reset-password/:token",resetPassword)

export default authroute;