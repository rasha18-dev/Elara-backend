<<<<<<< HEAD
import dotenv from "dotenv";
dotenv.config(); // ✅ IMPORTANT (loads env before config)

import { v2 as cloudinary } from "cloudinary";
=======
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
>>>>>>> 4c3c48c046335d06bdc0ecb5c5447531e7d950e8

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
<<<<<<< HEAD
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
=======
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "elara-products",
    allowed_formats: ["jpg", "png", "jpeg"]
  }
});

module.exports = { cloudinary, storage };
>>>>>>> 4c3c48c046335d06bdc0ecb5c5447531e7d950e8
