import express from "express"
import { authorize, protect } from "../middlewares/auth.middleware.js"
import { getSellerInquiries, readInquiries, sendInquiry } from "../controller/inquriy.controller.js"

const inquiriesRouter = express.Router()

inquiriesRouter.post("/",protect,authorize("buyer"),sendInquiry)
inquiriesRouter.get("/seller",protect,authorize("seller"),getSellerInquiries)
inquiriesRouter.patch("/:id/read",protect,readInquiries)

export default inquiriesRouter

