import mongoose from "mongoose";

export const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true  
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["buyer","seller","admin"],
        default:"buyer"
    },
    phone:{
        type:String
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    profilePic:{
        type:String
    },
    address:{
        type:String
    },
    isApproved:{
        type:String,
        default:true
    },
    isVerified:{
        type:String,
        default:false
    },
    verificationToken:{
        type:String,
    },
    resetPasswordToken:{
        type:String,
    },
    resetPasswordTime:{
        type:Date
    }

},{
    timestamps:true
})

const User = mongoose.model("User",userSchema)

export default User;