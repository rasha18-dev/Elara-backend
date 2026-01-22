import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = async (req, res) => {
  try {
    console.log("FILE:", req.file);
    
    if (!req.file) {
      return res.status(400).json({ message: "No image file received" });
    }

    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "elara-products",
    });

    return res.status(200).json({
      imageUrl: result.secure_url,
    });
  } catch (error) {
    console.log("UPLOAD ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};
