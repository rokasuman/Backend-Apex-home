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
      message
    });

    res.status(200).json({
      success: true,
      message: "Inquiry send successfully",
      inquriy,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      
    })
  }
};

//api to view the inquiry 
export const getSellerInquiries =async (req,res) =>{

    try {
        const inquires = await Inquriy.find({seller:req.user._id})
        .populate("buyer","name email phone")
        .populate("seller","titel price images city")
        .sort({createdAt:-1})

        res.json({
            success:true,
          count: inquires.length,
          inquires
        })
    } catch (error) {
       return res.status(500).json({
      success: false,
      message: error.message,
      
    }); 
    }
}

//api to mark the inquires as read 
export const readInquiries = async(req,res) =>{
    try {
        const inquires = await Inquriy.findById(req.params.id);
        if(!inquires){
            return res.status(404).json({
                success:false,
                message:"Inquiry not found"
            })
        }

        inquires.isRead =true,
        await inquires.save()

        return res.status(200).json({
            success:true,
            message:"Inquiry read successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}