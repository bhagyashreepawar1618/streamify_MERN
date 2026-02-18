import { v2 as cloudinary } from "cloudinary";

const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.log("Cloudinary delete error:", error);
  }
};

export default deleteFromCloudinary;
