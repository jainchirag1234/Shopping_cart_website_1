const express = require("express");
const router = express.Router();
const multer = require("multer");
const Product = require("../model/Product");

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// POST /api/product
router.post("/product", upload.single("image"), async (req, res) => {
  try {
    const { name, price } = req.body;
    const image = req.file?.filename;

    if (!name || !price || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const product = new Product({ name, price: Number(price), image });
    const savedProduct = await product.save();

    res.status(201).json({ product: savedProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/products
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
