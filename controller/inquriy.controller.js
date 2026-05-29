import Inquriy from "../models/inqurey.model.js";
import Property from "../models/property.model.js";

export const sendInquiry = async (req, res) => {
  try {
    const { propertyId, message } = req.body;
    const property = await Property.findById(propertyId).populate("seller");

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    const inquriy = await Inquriy.create({
      property: property._id,
      buyer: req.user._id,
      seller: property.seller._id,
      message,
    });

    res.status(200).json({
      success: true,
      message: "Inquiry send successfully",
      message,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
