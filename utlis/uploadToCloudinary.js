import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export const uploadToCloudinary = (buffer, folder = "general") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};
//deleting the image 
export const deleteFromCloudinary = async (public_id) => {
  try {
    await cloudinary.v2.uploader.destroy(public_id)
  } catch (error) {
    console.log(error);
  }
};