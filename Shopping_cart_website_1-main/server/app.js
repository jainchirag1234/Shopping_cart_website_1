const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const productRoute = require("./route/productRoute");
const authRoutes = require("./route/authRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const cartRoutes = require("./route/cartRoutes");

app.use("/api/cart", cartRoutes);

app.use("/api", productRoute);
app.use("/api", authRoutes);

mongoose
  .connect("mongodb://127.0.0.1:27017/productDB")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

app.listen(4000, () => console.log("Server running on http://localhost:4000"));
