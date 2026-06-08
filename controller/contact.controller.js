import Contact from "../models/contact.models.js";
import sendEmail from "../utlis/sendEmail.js";

//creating the contact 
export const createContact = async(req,res) =>{
    try{
    const {name,email, phone, role, message} = req.body;
    const contact = new Contact({name,email,phone,role,message});
    await contact.save()

     const adminEmail = process.env.EMAIL_USER;
        const adminMessage = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
                <h2 style="color: #0d9488;">New Contact Request</h2>
                <p>You have received a new message from the platform.</p>
                <div style="background: #f8fafc; padding: 20px; border-radius: 10px; border: 1px solid #e2e8f0;">
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
                    <p><strong>Role:</strong> ${role}</p>
                    <p style="margin-top: 15px;"><strong>Message:</strong></p>
                    <p style="font-style: italic; color: #475569;">"${message}"</p>
                </div>
                </div>
            </div>
        `;

        //send email 
        try {
            await sendEmail({
                to:adminEmail,
                subject:`New Contact Message from ${name}`,
                message:adminMessage
            })
        } catch (error) {
           console.log("Admin email fail",error)
        }
    return res.status(200).json({
        success:true,
        message:"Message sent Successfully"
    })
       
    }catch(error){
        console.log("Contact error",error)
        return res.status(500).json({
            success:false,
            message:"Failed to send the email"
        })

    }
}

//get all contact to admin 
export const getAllContact = async (req,res) =>{
    try {
       const contacts = await Contact.find().sort({createdAt : -1}) 
       return res.status(200).json({
        success:true,
        message:"Loaded all the contact",
        contacts,
       })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Faild to load the contact"
        })
        
    }
}