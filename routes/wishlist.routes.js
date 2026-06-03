import express from "express"
import { authorize, protect } from "../middlewares/auth.middleware.js"
import { addPropertyWishList, getPropertyWishList, removeWishList } from "../controller/wishList.controller.js"

const wishListRouter = express.Router()
wishListRouter.post("/:id",protect,addPropertyWishList)
wishListRouter.get("/",protect,getPropertyWishList)

wishListRouter.delete("/:propertyId",protect,removeWishList)

export default wishListRouter