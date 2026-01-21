import Product from "../models/productModel.js";

/* ================= CREATE PRODUCT ================= */
export const createProduct = async (req, res) => {
  try {
    const { name, price, description, image, category, countInStock } = req.body;

    if (!name || !price || !description || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const product = await Product.create({
      name,
      price,
      description,
      image,
      category,
      countInStock,
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

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Product fetch failed" });
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

    // ✅ MUST ADD THIS
    product.category = req.body.category ?? product.category;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

/* ================= DELETE PRODUCT ================= */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();

    return res.json({ message: "Product deleted ✅" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
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
