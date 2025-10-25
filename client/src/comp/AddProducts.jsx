import React, { useState } from "react";
import axios from "axios";

const AddProducts = ({ onProductAdded }) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !price || !image) {
      alert("Please fill all fields!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", title);
      formData.append("price", price);
      formData.append("image", image);

      const res = await axios.post(
        "http://localhost:4000/api/product",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert("Product added successfully!");

      // Call parent callback to refresh products in CartUseState
      if (onProductAdded) onProductAdded(res.data.product);

      // Reset form
      setTitle("");
      setPrice("");
      setImage(null);
      setPreview(null);
    } catch (err) {
      console.error("Error adding product:", err);
      alert("Failed to add product.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Product Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter product title"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Price (₹)</label>
          <input
            type="number"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Product Image</label>
          <input
            type="file"
            className="form-control"
            onChange={handleImageChange}
          />
        </div>

        {preview && (
          <div className="mb-3">
            <img
              src={preview}
              alt="Preview"
              style={{ width: "150px", height: "150px", objectFit: "cover" }}
            />
          </div>
        )}

        <button type="submit" className="btn btn-primary">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProducts;
