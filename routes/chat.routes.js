import express from "express"
import Chat from "../models/chat.model.js"

const chatRouter = express.Router()

chatRouter.post("/start",async(req,res)=>{
    try {
        const {propertyID,sellerId,buyerId:ProvidedBuyerId} = req.body;
        let buyerId,finalsellerId;

        if(!buyerId || !sellerId){
            return res.json({
                success:false,
                message:"Buyer or seller ID is missing"
            })
        }
        if(req.user.role === "Seller"){
            buyerId = ProvidedBuyerId,
            finalsellerId=req.user._id
        }else{
            buyerId = req.user._id,
            finalsellerId= sellerId
        }

        //checking the existing chat 
        let Chat = await Chat.findOne({
            buyer:buyerId,
            seller:finalsellerId
        })
        if(!Chat){
           Chat = await chat.create({
            property :propertyID,
            buyer:buyerId,
            seller:sellerId,
            messages:[]
           })
        }
        chat = await chat.findByID(chat._id)
        .populate("buyer","name email")
        .populate("seller","name email")
        .populate("property","name email")

        res.json(Chat)
    } catch (error) {
        return res.status(500).json({
        success:false,
        message:"Error while creating chat or getting previous chat",
        error:error.message
    })
    }
})

//to sned the message
chatRouter.post("/send",async(req,res)=>{
    try {
        const {chatId,text,image} = req.body;
        const userId = req.user.id;

        //geting the chat 
        const chat = await Chat.findById(chatId);
        if(!chat) return res.status(404).json({messge:"Chat not found"})

        //checking the if you are the part of chat 
        if(chat.buyer.toString() !== userId && chat.seller.toString() !==userId){
            return res.status(403).json({
                message:"You are not authorized"
            })
        }
        const newMessage = {
            sender: userId,
            text,
            image,
            createAt : Date.now()
        }
        chat.messages.push(newMessage)
        await chat.save()

        const savedMessage = chat.messages[chat.messages.length -1]
        res.json({chat,newMessage:savedMessage})

    } catch (error) {
        return res.json({
            message:"Error sending the message",
            error:error.message
        })
        
    }
})

// to get the chat for user 
chatRouter.get("/user",async(req,res)=>{
    try {
        const userId = req.user._id;
        const chats = await Chat.find({
            $or:[{buyer:userId},{seller:userId}]
        })
        .populate("buyer","name email")
        .populate("seller","name email")
        .populate("property","name email")
        .sort({updatedAt: -1})

        res.json(chats)

    } catch (error) {
       return res.json({
            message:"Error fetching the message",
            error:error.message
        }) 
    }
})

//to get the message 



export default chatRouter;