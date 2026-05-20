import mongoose from "mongoose";

const inquriySchema = new mongoose.Schema({

    property:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Property",
        required:true
    },
    buyer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    seller:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    message:{
        type:String,
        required:true
    },
    isRead:{
        type:Boolean,
        default:false
    }
},
 { timestamps: true }
)
const Inquriy = mongoose.model("Inquriy",inquriySchema)
export default Inquriy;