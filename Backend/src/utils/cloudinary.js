import { v2 as cloudinary } from "cloudinary";

console.log(cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  }));


const uploadOnCloudinary = (fileBuffer, fileName) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "image",
          public_id: fileName,
          folder: "actionote",
          overwrite: true,
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return reject(error);
          }
          console.log("Cloudinary upload result:", result);
          resolve(result);
        }
      )
      .end(fileBuffer); // Upload the buffer
  });
};

export { uploadOnCloudinary };
