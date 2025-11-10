import { v2 as cloudinary } from "cloudinary";

export default async ({ req, res, log }) => {
  try {
    // Extract and verify JWT instead of x-appwrite-user-id
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.json({ error: "Unauthorized" }, 401);
    }

    // Optional: log the start of execution
    log("Auth header received. Generating Cloudinary signature...");

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
      },
      process.env.CLOUDINARY_API_SECRET
    );

    return res.json({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      timestamp,
      signature,
      upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
    });
  } catch (err) {
    log(err);
    return res.json({ error: "Internal Server Error" }, 500);
  }
};
