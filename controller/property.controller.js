import Property from "../models/property.model.js";
import Inquriy from "../models/inqurey.model.js";
import { uploadToCloudinary } from "../utlis/uploadToCloudinary.js";
import { deleteFromCloudinary } from "../utlis/uploadToCloudinary.js";
import jwt from "jsonwebtoken"

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

//get property details  
export const getProperyDetails = async(req,res) =>{
  try {
    const {id} = req.params;
    const property = await Property.findById(id)
    .populate("seller","name,email,phone,profilePic")

    if(!property){
      return res.status(404).json({
        success:false,
        message:"Property not found"
      })
    }

    //get the property views
    const vistorId = req.ip;
    const authHeader = req.header.authorization;

    if(!authHeader && authHeader.startsWith("Bear ")){
      try {
        const token = authHeader.split(" ")[1]
        const decoded = jwt.verify(process.env.JWT_SECRET)
        vistorId= decoded.id;
      } catch (error) {
        
      }
    }
    const isSellerChecking = vistorId === property.seller._id.toString();
    //only increase with vistor id
    if(!isSellerChecking && !property.viewedBy.includes(vistorId)){
      property.views +- 1;
      property.viewedBy.push(vistorId)
      await property.save()
    }
    //getting the similar property 
    const similarPropery = await Property.findById({
      _id:{$ne:property._id},
      city:property.city,
      propertyType:property.propertyType,
      status:property.status
    })
      .limit(4)
      .select(" title price images city area propertyType bhk areaSize status");

      res.json({
        success:true,
        property,
        similarPropery
      })
    
  } catch (error) {
      return res.status(500).json({
        success:false,
        message:error.message
    })
    
  }
}

//seller dashboard
export const sellerDashboard = async(req,res) =>{
  try {
    const sellerId = req.user._id;
    const seller= await Property.findById({seller:sellerId})
   //total property of seller
    const totalProperty = await Property.countDocuments({seller:sellerId})
    //active-property of the seller 
    const activeProperty = await Property.countDocuments({seller:sellerId,status:status})
    //sold-property
    const soldProperty = await Property.countDocuments({seller:sellerId,status:sold})
    //inqurey 
    const totalInqurey = await Inquriy.countDocuments({seller:sellerId})
    //total views of the property 
    const viewData = await Property.aggregate([
      {$match:{seller:sellerId}},
      {$group:{_id:null, totalViews: {$sum:"$views"}}},
    ]);

    //total views 
    const totalViews = viewData.length > 0 ? viewData[0].totalViews : 0;

    res.json({
      success:true,
      stats:{
        totalProperty,
        totalInqurey,
        totalViews,
        soldProperty,
        activeProperty
      }
    })

  } catch (error) {
    return res.status(500).json({
        success:false,
        message:error.message
    })
  }
}

//get the property count by type
export const getPropertyCounts = async(req,res)=>{
  try {
    const counts = await Property.aggregate([
      {$match:{status:"sale"}},
      {$group:{_id:"$propertyType",count:{$sum:1}}}
    ])
    const formattedCount = counts.reduce(( acc, curr) =>{
      acc[curr._id] = curr.count;
      return acc;
    },{})

    res.json({
      success:true,
      counts:formattedCount
    })
  } catch (error) {
     return res.status(500).json({
        success:false,
        message:error.message
    })
  }
  
}

