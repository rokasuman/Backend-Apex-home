import User from "../models/userModel.js";
import { uploadToCloudinary } from "../utlis/uploadToCloudinary.js";

//ger user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//gettting the public profile
export const getPublicProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "name profilePic role createdAt",
    );
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
       success:true,
       user
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

//update profile 
export const updateProfile = async(req,res) =>{
try {
    const {name,address,phone,removeProfilePic} = req.body;
    const user = await User.findById(req.user._id)

    if(!user){
        return res.status(404).json({
            success:false,
            message:"User not found"
        })
    }
    //image handling
    if(req.file){
        const result = await uploadToCloudinary(req.file.buffer,"profile")
        user.profilePic = result.secure_url;

    }else if(removeProfilePic === "true"){
        user.profilePic = null;
    }
    if(name !== undefined) user.name = name;
    if(phone !==undefined) user.phone= phone;
   if(address !== undefined) user.address = address;

    const updatedUser = await user.save()
    res.json({
        success:true,
        message:"Profile updated Successfully",
        user:updatedUser
    })


} catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
}

}
