import express from "express"
import { createContact, getAllContact } from "../controller/contact.controller.js";
import { authorize, protect } from "../middlewares/auth.middleware.js";

const contactRouter = express.Router()
contactRouter.post("/",createContact)
contactRouter.get("/",protect,authorize("admin"),getAllContact)

export default contactRouter;