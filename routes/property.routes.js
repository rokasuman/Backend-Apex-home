import express from "express"
import { addProperty, deleteProperty, getAllProperties, getMyProperties, getPropertyCounts, getProperyDetails, sellerDashboard, updatedProperty, updatePropertyStatus } from "../controller/property.controller.js";
import { authorize, protect } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const propertyRouter = express.Router()

//to get all property 
propertyRouter.get("/",getAllProperties)

//protected-routes 
propertyRouter.post("/",protect,authorize("seller"),upload.array("images",10),addProperty)
propertyRouter.get("/my",protect,authorize("seller"),getMyProperties)
propertyRouter.put("/:id",protect,authorize("seller"),upload.array("images",10),updatedProperty)
propertyRouter.get("/seller/dashboard",protect,authorize("seller"),sellerDashboard)

propertyRouter.delete("/:id",protect,authorize("seller"),deleteProperty)
propertyRouter.patch("/:id",protect,authorize("seller"),updatePropertyStatus)

propertyRouter.get("/count",getPropertyCounts)
propertyRouter.get("/:id",getProperyDetails)

export default propertyRouter;