import User from "../models/userModel.js";
import Property from "../models/property.model.js";
import Inquriy from "../models/inqurey.model.js";

//view all the user
export const getAllUser = async (req, res) => {
  try {
    const users = await User.find().select("password").sort({ createdAt: -1 });
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "All user data is loaded",
      count: users.length,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Block the particular user
export const blockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    return res.json({
      success: true,
      message: user.isBlocked ? "User blocked" : "User unblocked",
      isBlocked: user.isBlocked,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//delete the particular user
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User deleted Successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//all the property
export const getAllPropertiesAdmin = async (req, res) => {
  try {
    const properties = await Property.find()
      .populate("seller", "name email")
      .sort({ createdAt: -1 });
    if (!properties) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Loading all properties",
      count: properties.length,
      properties,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//delete properties
export const deleteProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const property = await Property.findByIdAndDelete(propertyId);
    if (property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Property deleted Successfully",
      property,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// view all the inquries
export const getAllInquries = async (req, res) => {
  try {
    const inquries = await Inquriy.find()
      .populate("buer", "name email")
      .populate("seller", "name email")
      .populate("property", "title price")
      .sort({ createdAt: -1 });

    if (!inquries) {
      return res.status(404).json({
        success: false,
        message: "Inquriy not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Loading all the Inquries",
      count: inquries.length,
      inquries,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//dashboard analytics
export const getDashData = async (req, res) => {
  try {
    const totalUser = await User.countDocuments();
    const totalProperties = await Property.countDocuments();

    const activeListing = await Property.countDocuments({
      status: "sale",
    });

    const soldProperties = await Property.countDocuments({
      status: "sold",
    });

    return res.status(200).json({
      success: true,
      message: "Loading Dash Data",
      totalProperties,
      totalUser,
      activeListing,
      soldProperties,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// to see all the pending seller
export const pendingSeller = async (req, res) => {
  try {
    const pendingSeller = await User.find({
      role: "seller",
      isApproved: false,
    }).select("-password");

    return res.status(200).json({
      success: true,
      message: "Loading all the pending seller",
    count:pendingSeller.length,
      pendingSeller,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    
    });
  }
};

//to approved the seller
export const approvedSeller = async (req, res) => {
  try {
    const { Id } = req.params;
    const seller = await User.findById(Id);

    //checking the seller
    if (!seller || seller.role !== "seller") {
      return res.status(404).json({
        success: false,
        message: "You are not seller or seller not found",
      });
    }
    seller.isApproved = true;
    await seller.save();

    return res.status(200).json({
      success: true,
      message: "Seller Approved Successfully",
      seller,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
