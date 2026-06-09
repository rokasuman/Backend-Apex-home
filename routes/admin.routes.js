import express from "express";
import { authorize, protect } from "../middlewares/auth.middleware.js";
import {
  approvedSeller,
  blockUser,
  deleteProperty,
  deleteUser,
  getAllInquries,
  getAllPropertiesAdmin,
  getAllUser,
  getDashData,
  pendingSeller,
} from "../controller/admin.controller.js";

const amdinRouter = express.Router();
amdinRouter.use(protect, authorize("admin"));

//user
amdinRouter.get("/users", getAllUser);
amdinRouter.delete("/user/:userId", deleteUser);
amdinRouter.patch("/users/:userId/block", blockUser);

//porperties
amdinRouter.get("/get-all-properties", getAllPropertiesAdmin);
amdinRouter.delete("/properties/:propertyId/delete", deleteProperty);

//inquiries
amdinRouter.get("/all-inquiries", getAllInquries);
amdinRouter.get("/stats", getDashData);
amdinRouter.get("/pending-seller", pendingSeller);
amdinRouter.patch("/approved-seller/:Id",approvedSeller)

export default amdinRouter;
