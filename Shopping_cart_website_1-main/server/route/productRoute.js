const express = require("express");
const router = express.Router();
const multer = require("multer");
const Product = require("../model/Product");

// ===== Multer config =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// ===== POST /api/products =====
router.post("/products", upload.single("image"), async (req, res) => {
  try {
    const { name, price, category, description } = req.body; // Added description
    const image = req.file?.filename;

    if (!name || !price || !category || !description || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const product = new Product({
      name,
      price: Number(price),
      category,
      description, // Save description
      image,
    });

    const savedProduct = await product.save();
    res.status(201).json({ product: savedProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ===== GET /api/products?category=someCategory =====
router.get("/products", async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
