const express = require("express");
const router = express.Router();
const Cart = require("../model/Cart");
const Product = require("../model/Product");

// =======================
// GET CART ITEMS
// =======================
router.get("/", async (req, res) => {
  try {
    const cartItems = await Cart.find().populate("productId");
    res.json(
      cartItems.map((item) => ({
        _id: item._id,
        productId: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        image: item.productId.image,
        qty: item.qty,
      }))
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =======================
// ADD TO CART
// =======================
router.post("/", async (req, res) => {
  const { productId, qty } = req.body;

  try {
    const existingItem = await Cart.findOne({ productId });

    if (existingItem) {
      existingItem.qty += qty;
      await existingItem.save();
      return res.json(existingItem);
    }

    const cartItem = new Cart({ productId, qty });
    await cartItem.save();
    res.status(201).json(cartItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// =======================
// UPDATE QTY
// =======================
router.put("/:id", async (req, res) => {
  const { qty } = req.body;

  try {
    const item = await Cart.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.qty = qty;
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// =======================
// DELETE ITEM
// =======================
router.delete("/:id", async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.json({ message: "Item removed from cart" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
