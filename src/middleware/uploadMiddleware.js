<<<<<<< HEAD
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;
=======
const multer = require("multer");
const { storage } = require("../config/cloudinary");

const upload = multer({ storage });

module.exports = upload;
>>>>>>> 4c3c48c046335d06bdc0ecb5c5447531e7d950e8
