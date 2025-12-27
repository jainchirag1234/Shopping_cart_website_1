// CartUseState.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const CartUseState = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // =======================
  // Show modal message
  // =======================
  const showMessage = (text) => {
    setMessage(text);
    setShowModal(true);
    setTimeout(() => {
      setShowModal(false);
      setMessage("");
    }, 2500);
  };

  // =======================
  // Fetch products
  // =======================
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/products");

      const updatedProducts = res.data.map((p) => ({
        ...p,
        image: p.image ? `http://localhost:4000/uploads/${p.image}` : null,
      }));

      setProducts(updatedProducts);

      const uniqueCategories = [
        "All",
        ...new Set(res.data.map((p) => p.category)),
      ];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error("Error fetching products:", err.message);
    }
  };

  // =======================
  // Fetch cart
  // =======================
  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/cart");

      const updatedCart = res.data.map((item) => ({
        ...item,
        image: item.image
          ? `http://localhost:4000/uploads/${item.image}`
          : null,
      }));

      setCart(updatedCart);
    } catch (err) {
      console.error("Error fetching cart:", err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  // =======================
  // Add to cart
  // =======================
  const addToCart = async (product) => {
    setCart((prevCart) => {
      const productId = product._id || product.id;
      const existing = prevCart.find((item) => item._id === productId);

      if (existing) {
        const updatedCart = prevCart.map((item) =>
          item._id === productId ? { ...item, qty: item.qty + 1 } : item
        );

        axios.put(`http://localhost:4000/api/cart/${productId}`, {
          qty: existing.qty + 1,
        });

        showMessage("Quantity increased!");
        return updatedCart;
      } else {
        const newItem = { ...product, qty: 1, _id: productId };

        axios.post("http://localhost:4000/api/cart", {
          productId,
          qty: 1,
        });

        showMessage("Added to cart successfully!");
        return [...prevCart, newItem];
      }
    });
  };

  // =======================
  // Update quantity
  // =======================
  const updateQty = (id, qty) => {
    if (qty <= 0) return removeFromCart(id);

    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item._id === id ? { ...item, qty } : item
      );

      axios.put(`http://localhost:4000/api/cart/${id}`, { qty });
      return updatedCart;
    });
  };

  // =======================
  // Remove from cart
  // =======================
  const removeFromCart = (id) => {
    const removedItem = cart.find((item) => item._id === id);

    setCart((prevCart) => prevCart.filter((item) => item._id !== id));

    axios.delete(`http://localhost:4000/api/cart/${id}`);

    if (removedItem) showMessage(`${removedItem.name} removed from cart!`);
  };

  // =======================
  // Total
  // =======================
  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  // =======================
  // Filter products
  // =======================
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="container py-5">
      {/* Modal */}
      {showModal && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            backgroundColor: "rgba(0,0,0,0.4)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content text-center border-success shadow">
              <div className="modal-body">
                <h5 className="text-success fw-bold">{message}</h5>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="d-flex align-items-center mb-4">
        <h2 className="text-primary me-auto">Our Products</h2>

        <select
          className="form-select mx-auto"
          style={{ width: "200px" }}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <button
          className="btn btn-success position-relative ms-auto"
          data-bs-toggle="offcanvas"
          data-bs-target="#cartOffcanvas"
        >
          🛒 Cart
          {cart.length > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {cart.length}
            </span>
          )}
        </button>
      </div>

      {/* Products */}
      <div className="row g-4">
        {filteredProducts.map((product) => (
          <div key={product._id} className="col-md-3">
            <div className="card shadow-sm h-100 border-0">
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="card-img-top"
                  style={{ height: "180px", objectFit: "cover" }}
                />
              )}
              <div className="card-body d-flex flex-column text-center">
                <h5>{product.name}</h5>
                <p className="fw-bold">₹{product.price}</p>
                <button
                  className="btn btn-primary mt-auto"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Offcanvas */}
      <div className="offcanvas offcanvas-end" id="cartOffcanvas">
        <div className="offcanvas-header">
          <h5>Your Cart</h5>
          <button className="btn-close" data-bs-dismiss="offcanvas" />
        </div>

        <div className="offcanvas-body">
          {cart.length === 0 ? (
            <p className="text-muted">No items in cart</p>
          ) : (
            cart.map((item) => (
              <div
                key={item._id}
                className="d-flex justify-content-between mb-3"
              >
                <div>
                  <h6>{item.name}</h6>
                  <p>₹{item.price}</p>
                  <div className="btn-group btn-group-sm">
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => updateQty(item._id, item.qty - 1)}
                    >
                      -
                    </button>
                    <span className="btn btn-light">{item.qty}</span>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => updateQty(item._id, item.qty + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => removeFromCart(item._id)}
                >
                  Remove
                </button>
              </div>
            ))
          )}

          {cart.length > 0 && (
            <h5 className="text-end mt-3">Total: ₹{total}</h5>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartUseState;
