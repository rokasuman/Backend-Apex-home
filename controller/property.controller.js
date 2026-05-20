import Property from "../models/property.model";
import Inquriy from "../models/inqurey.model";
import { uploadToCloudinary } from "../utlis/uploadToCloudinary";

//adding the property 
export const addProperty = async(req,res)=>{
     try {
    const {
      title,
      description,
      price,
      city,
      area,
      pincode,
      propertyType,
      bhk,
      bathrooms,
      areaSize,
      furnishing,
      amenities,
    } = req.body;

    // image urls array
    let images = [];

    // upload images to cloudinary
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.path);

        images.push(result.secure_url);
      }
    }

    // create property
    const property = await Property.create({
      title,
      description,
      price,
      city,
      area,
      pincode,
      propertyType,
      bhk,
      bathrooms,
      areaSize,
      furnishing,
      amenities,
      images,
      seller: req.user._id,
    });

    return res.status(200).json({
      success: true,
      message: "Property added successfully",
      property,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}