import Product from "../models/productModel.js";
import cloudinary from "cloudinary";


/* ================= CREATE PRODUCT ================= */
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      weight, // ✅ add this
      description,
      image,
      category,
      countInStock,
    } = req.body;

    // ✅ include weight in validation
    if (!name || !price || !weight || !description || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }
console.log("WEIGHT FROM FRONTEND:", weight);



    const product = await Product.create({
      name,
      price,
      weight, // ✅ now defined
      description,
      image,
      category: category || "All",
      countInStock: countInStock || 0,
    });

    return res.status(201).json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ================= GET ALL PRODUCTS (WITH FILTER) ================= */
export const getProducts = async (req, res) => {
  try {
    const { category } = req.query;

    const filter = {};
    if (category) filter.category = category;

    const products = await Product.find(filter).sort({ createdAt: -1 });

    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ================= GET PRODUCT BY ID ================= */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json(product);
  } catch (error) {
    return res.status(500).json({ message: "Product fetch failed" });
  }
};

/* ================= UPDATE PRODUCT ================= */
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    product.name = req.body.name ?? product.name;
    product.price = req.body.price ?? product.price;
    product.image = req.body.image ?? product.image;
    product.description = req.body.description ?? product.description;
    product.countInStock = req.body.countInStock ?? product.countInStock;
   product.weight = req.body.weight || product.weight;

    // ✅ category update
    product.category = req.body.category ?? product.category;

    const updatedProduct = await product.save();
    return res.json(updatedProduct);
  } catch (error) {
    return res.status(500).json({ message: "Update failed", error: error.message });
  }
};

/* ================= DELETE PRODUCT ================= */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.image) {
      // full url
      const imageUrl = product.image;

      // remove domain
      const splitUrl = imageUrl.split("/upload/")[1];

      // remove version
      const withoutVersion = splitUrl.replace(/^v\d+\//, "");

      // remove extension
      const publicId = withoutVersion.replace(/\.[^/.]+$/, "");

      console.log("CLOUDINARY PUBLIC ID:", publicId);

      await cloudinary.uploader.destroy(publicId);
    }

    await product.deleteOne();

    res.json({ message: "Product + image deleted successfully ✅" });
  } catch (error) {
    console.log("DELETE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
/* ================= CREATE PRODUCT REVIEW ================= */
export const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ message: "Rating and comment are required" });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ✅ Prevent same user review twice
    const alreadyReviewed = product.reviews?.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: "Product already reviewed" });
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => acc + item.rating, 0) /
      product.reviews.length;

    await product.save();

    return res.status(201).json({ message: "Review added successfully ✅" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
