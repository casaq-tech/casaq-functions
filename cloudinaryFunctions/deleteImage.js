import { v2 as cloudinary } from "cloudinary";

export default async ({ req, res, log }) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.json({ error: "Unauthorized" }, 401);
    }

    const url = new URL(req.url);
    const publicId = url.searchParams.get("public_id");

    if (!publicId) return res.json({ error: "Missing public_id" }, 400);

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === "ok") {
      return res.json({ success: true });
    }

    return res.json({ success: false, message: result.result });
  } catch (err) {
    log(err);
    return res.json({ error: "Internal Server Error" }, 500);
  }
};
