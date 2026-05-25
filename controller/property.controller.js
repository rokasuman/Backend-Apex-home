import Property from "../models/property.model.js";
import Inquriy from "../models/inqurey.model.js";
import { uploadToCloudinary } from "../utlis/uploadToCloudinary.js";
import { deleteFromCloudinary } from "../utlis/uploadToCloudinary.js";

//adding the property
export const addProperty = async (req, res) => {
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

    const parsedAmenities =
  typeof amenities === "string"
    ? amenities.split(",").map(item => item.trim())
    : amenities;

    // image urls array
    let images = [];

    // upload images to cloudinary
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.path);

        images.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
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
      amenities:parsedAmenities,
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
};

//get the property
export const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ seller: req.user._id });
    if (properties.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Property is not found",
      });
    } else {
      return res.status(200).json({
        status: true,
        message: "Property Found Successfully",
        properties,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// update property
export const updatedProperty = async (req, res) => {
  try {
    const { id } = req.params;

    // find property
    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }
    
    // check ownership
    if (property.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }


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
      status,
    } = req.body;

    // update images if new images uploaded
    let images = property.images;

    if (req.files && req.files.length > 0) {
      images = [];

      for (const file of req.files) {
        const result = await uploadToCloudinary(file.path);

        images.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
    }

    // update property
    property.title = title || property.title;
    property.description = description || property.description;
    property.price = price || property.price;
    property.city = city || property.city;
    property.area = area || property.area;
    property.pincode = pincode || property.pincode;
    property.propertyType = propertyType || property.propertyType;
    property.bhk = bhk || property.bhk;
    property.bathrooms = bathrooms || property.bathrooms;
    property.areaSize = areaSize || property.areaSize;
    property.furnishing = furnishing || property.furnishing;
    property.amenities = typeof amenities == "String" ? amenities.split(",").map(item =>item.trim) : amenities ?? property.amenities;
    property.status = status || property.status;
    property.images = images;

    await property.save();

    return res.status(200).json({
      success: true,
      message: "Property updated successfully",
      property,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//delete the property
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    //checking the owner
    if (property.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not Authorized",
      });
    }

    //deleting the images
    if(property.images.length > 0){
        for(let image of property.images){
            await deleteFromCloudinary(image.public_id)
        }
    }
    await property.deleteOne()

    return res.status(200).json({
        success:true,
        message:"Property deleted Successfully"
    })
  } catch (error){
    return res.status(500).json({
        success:false,
        message:error.message
    })
  }
};

//update property status 
export const updatePropertyStatus = async(req,res) =>{

  try {
    const property = await Property.findById(req.params.id)

    if(!property){
      return res.status(404).json({
        success:false,
        message:"Property not found"
      })
    }
    //checking the owner
    if(property.seller.toString !== req.user._id.toString()){
      return res.status(403).json({
        success: false,
        message: "Not Authorized",
      });
    }
    property.status = req.body.status;
    await property.save()
    res.json({
      success:true,
      message:"Property status updated successfully",
      property
    })
  } catch (error) {
     return res.status(500).json({
        success:false,
        message:error.message
    })
  }
}

//get all property
export const getAllProperties = async(req,res) =>{

  try {
    const properties = await Property.find()
    .populate("seller","name email")
    .sort({createdAt: -1})

    return res.status(200).json({
      success:true,
      count: properties.length,
      properties
    })
  } catch (error) {
    return res.status(500).json({
        success:false,
        message:error.message
    })
  }
}

