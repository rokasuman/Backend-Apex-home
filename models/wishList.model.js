import mongoose from "mongoose";

export const wishListSchemna = new mongoose.Schema({
user:{
    type:mongoose.Schema.Types.ObjectId,
    rel:"User"
},
property:{
    type:mongoose.Schema.Types.ObjectId,
    rel:"Property"
}
})
const WishList = mongoose.model("WishList",wishListSchemna)
export default WishList