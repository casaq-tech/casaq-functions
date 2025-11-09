import { v2 as cloudinary } from "cloudinary";

export default async ({ req, res, log }) => {
  try {
    // Only allow authenticated users
    if (!req.headers["x-appwrite-user-id"]) {
      return res.json({ error: "Unauthorized" }, 401);
    }

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    // Generate a signed upload URL
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        upload_preset: process.env.UPLOAD_PRESET,
      },
      process.env.CLOUDINARY_API_SECRET
    );

    return res.json({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      timestamp,
      signature,
      upload_preset: process.env.UPLOAD_PRESET,
    });
  } catch (err) {
    log(err);
    return res.json({ error: "Internal Server Error" }, 500);
  }
};
