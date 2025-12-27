// CartRedux.jsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import {
  addToCart,
  updateQty,
  removeFromCart,
  setProducts,
  setCart,
} from "../redux/cartSlice";

const CartRedux = () => {
  const dispatch = useDispatch();
  const { products = [], cart = [] } = useSelector((state) => state.cart);

  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]); // All categories
  const [selectedCategory, setSelectedCategory] = useState("All"); // Selected category

  // =======================
  // Show message in center modal
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
  // Fetch products and cart
  // =======================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/products");
        const data = await res.json();
        const updatedProducts = data.map((p) => ({
          ...p,
          image: p.image ? `http://localhost:4000/uploads/${p.image}` : null,
        }));
        dispatch(setProducts(updatedProducts));

        // Extract unique categories for filter
        const uniqueCategories = [
          "All",
          ...new Set(updatedProducts.map((p) => p.category)),
        ];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    const fetchCart = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/cart");
        const data = await res.json();
        const updatedCart = data.map((item) => ({
          ...item,
          image: item.image
            ? `http://localhost:4000/uploads/${item.image}`
            : null,
        }));
        dispatch(setCart(updatedCart));
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    };

    fetchProducts();
    fetchCart();
  }, [dispatch]);

  // =======================
  // Add to Cart
  // =======================
  const handleAddToCart = async (product) => {
    const productId = product._id || product.id;
    const existingItem = cart.find((item) => item._id === productId);

    if (existingItem) {
      if (existingItem.qty >= product.stock) {
        showMessage(`Only ${product.stock} items available in stock!`);
        return;
      }
      const newQty = existingItem.qty + 1;
      await fetch(`http://localhost:4000/api/cart/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qty: newQty }),
      });
      dispatch(updateQty({ id: productId, qty: newQty }));
      showMessage(`Quantity increased!`);
    } else {
      await fetch("http://localhost:4000/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, qty: 1 }),
      });
      dispatch(addToCart({ ...product, qty: 1, _id: productId }));
      showMessage(`Added to cart successfully!`);
    }
  };

  // =======================
  // Update quantity
  // =======================
  const handleUpdateQty = async (id, qty) => {
    const product = products.find((p) => (p._id || p.id) === id);
    if (!product) return;

    if (qty > product.stock) {
      showMessage(`Only ${product.stock} items available in stock!`);
      qty = product.stock;
    }

    if (qty <= 0) return handleRemoveFromCart(id);

    await fetch(`http://localhost:4000/api/cart/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ qty }),
    });

    dispatch(updateQty({ id, qty }));
  };

  // =======================
  // Remove from cart
  // =======================
  const handleRemoveFromCart = async (id) => {
    const removedItem = cart.find((item) => item._id === id);
    await fetch(`http://localhost:4000/api/cart/${id}`, { method: "DELETE" });
    dispatch(removeFromCart(id));
    if (removedItem) showMessage(`${removedItem.name} removed from cart!`);
  };

  // =======================
  // Calculate total
  // =======================
  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

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
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.4)" }}
          onClick={() => setShowModal(false)}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content text-center">
              <div className="modal-body">
                <h5 className="text-success">{message}</h5>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="d-flex justify-content-between mb-4">
        <h2>Our Products</h2>
        <button
          className="btn btn-success position-relative"
          data-bs-toggle="offcanvas"
          data-bs-target="#cartCanvas"
        >
          🛒 Cart
          {cart.length > 0 && (
            <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
              {cart.length}
            </span>
          )}
        </button>
      </div>

      {/* Category Filter */}
      <div className="mb-4">
        <label className="me-2 fw-bold">Filter by Category:</label>
        <select
          className="form-select w-auto d-inline"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Products */}
      <div className="row g-4">
        {filteredProducts.map((p) => (
          <div key={p._id} className="col-md-3">
            <div className="card h-100 shadow-sm">
              {p.image && (
                <img
                  src={p.image}
                  className="card-img-top"
                  style={{ height: 180, objectFit: "cover" }}
                  alt={p.name}
                />
              )}
              <div className="card-body text-center d-flex flex-column">
                <h5>{p.name}</h5>
                <p className="text-muted">{p.category}</p>
                <p className="fw-bold">₹{p.price}</p>
                <p className="small text-truncate">{p.description}</p>
                <button
                  className="btn btn-primary mt-auto"
                  onClick={() => handleAddToCart(p)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Offcanvas */}
      <div className="offcanvas offcanvas-end" id="cartCanvas">
        <div className="offcanvas-header">
          <h5>Your Cart</h5>
          <button className="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>

        <div className="offcanvas-body d-flex flex-column">
          {cart.length === 0 ? (
            <p>No items in cart</p>
          ) : (
            cart.map((item) => (
              <div
                key={item._id}
                className="d-flex justify-content-between align-items-center mb-3"
              >
                <div>
                  <h6>{item.name}</h6>
                  <p className="text-muted">{item.category}</p>
                  <p className="small">{item.description}</p>
                  <p>
                    ₹{item.price} × {item.qty}
                  </p>
                  <div className="btn-group btn-group-sm">
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => handleUpdateQty(item._id, item.qty - 1)}
                    >
                      -
                    </button>

                    <span className="btn btn-light">{item.qty}</span>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => handleUpdateQty(item._id, item.qty + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => handleRemoveFromCart(item._id)}
                >
                  Remove
                </button>
              </div>
            ))
          )}

          {cart.length > 0 && (
            <h5 className="mt-auto text-end">Total: ₹{total}</h5>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartRedux;
