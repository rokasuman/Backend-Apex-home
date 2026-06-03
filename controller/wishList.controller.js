import Property from "../models/property.model.js";
import WishList from "../models/wishList.model.js";

//to add the property in wishlist
export const addPropertyWishList = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }
    //checking duplicate wishlist
    const existingWishList = await WishList.findOne({
      user: userId,
      property: id,
    });
    if (existingWishList) {
      return res.json({
        success: false,
        message: "Property already in WishList",
      });
    }
    // creating the wishlist
    const wishList = await WishList.create({
      user: userId,
      property: id,
    });
    //returning the response
    return res.status(200).json({
      success: true,
      message: "Added to Wishlist",
      wishList,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get the property wishlist
export const getPropertyWishList = async (req, res) => {
  try {
    const userId = req.user._id;
    const wishList = await WishList.find({
      user: userId,
    }).populate("property");

    if (!wishList || wishList.length === 0) {
      return res.json({
        success: false,
        message: "WishList is Empty",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Successfully loaded the WishList",
      wishList,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//romove the wishlsit
export const removeWishList = async (req, res) => {
  try {
    const userId = req.user._id;
    const { propertyId } = req.params;

    const wishList = await WishList.deleteOne({
      user: userId,
      property: propertyId,
    });
    if (wishList.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Wishlist item not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Deleted from wishList",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
