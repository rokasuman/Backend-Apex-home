import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import sendEmail from "../utlis/sendEmail.js";
import validator from "validator";
import jwt from "jsonwebtoken";

export const registration = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation check for the field
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    //validating the email
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }
    //validataing the password
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // Check user exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Try different email",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate token
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      isApproved: role === "seller" ? false : true,
      verificationToken,
    });

    // Send email
    try {
      await sendEmail({
        email,
        subject: "Verify your email - ApexHome",
        message: `<p>Your email verification code is <strong>${verificationToken}</strong></p>
                  <p>Please enter this code to activate your account</p>`,
      });
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
    }

    return res.status(201).json({
      success: true,
      message: "User registered. Check email for verification code",
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//api to login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
  return res.status(400).json({
    success: false,
    message: "Email and password are required",
  });
}
    //validating the email and password
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }
    //find by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    //verfiying the user
    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Please verify your email or contact support",
      });
    }
    //checking the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    //checking if the user is blocked
    if (user.isBlocked) {
      return res.status(400).json({
        success: false,
        message: "Your account has been blocked. Please contact support",
      });
    }
    // creating the token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );
    return res.json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

//get the userProfile
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found "
      });
    }
     return res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
