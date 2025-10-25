const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const productRoute = require("./route/productRoute");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // serve images
app.use("/api", productRoute);

mongoose
  .connect("mongodb://127.0.0.1:27017/productDB")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

app.listen(4000, () => console.log("Server running on http://localhost:4000"));
