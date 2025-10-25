// CartUseState.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const CartUseState = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  // =======================
  // Fetch all products from backend
  // =======================
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/products");
      const updatedProducts = res.data.map((p) => ({
        ...p,
        image: p.image ? `http://localhost:4000/uploads/${p.image}` : null,
      }));
      setProducts(updatedProducts);
    } catch (err) {
      console.error("Error fetching products:", err.message);
    }
  };

  // =======================
  // Fetch cart items from backend
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
  // Add product to cart
  // =======================
  const addToCart = async (product) => {
    setCart((prevCart) => {
      const productId = product._id || product.id; // Use MongoDB _id
      const existing = prevCart.find((item) => item._id === productId);

      if (existing) {
        // Increment quantity
        const updatedCart = prevCart.map((item) =>
          item._id === productId ? { ...item, qty: item.qty + 1 } : item
        );

        // Optional: update backend
        axios
          .put(`http://localhost:4000/api/cart/${productId}`, {
            qty: existing.qty + 1,
          })
          .catch((err) => console.error("Error updating cart:", err.message));

        return updatedCart;
      } else {
        const newItem = { ...product, qty: 1, _id: productId };

        // Optional: add to backend
        axios
          .post("http://localhost:4000/api/cart", {
            productId: productId,
            qty: 1,
          })
          .catch((err) => console.error("Error adding to cart:", err.message));

        return [...prevCart, newItem];
      }
    });
  };

  // =======================
  // Update quantity in cart
  // =======================
  const updateQty = async (id, qty) => {
    if (qty <= 0) return removeFromCart(id);

    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item._id === id ? { ...item, qty } : item
      );

      // Update backend
      axios
        .put(`http://localhost:4000/api/cart/${id}`, { qty })
        .catch((err) => console.error("Error updating cart:", err.message));

      return updatedCart;
    });
  };

  // =======================
  // Remove item from cart
  // =======================
  const removeFromCart = async (id) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== id));

    // Remove from backend
    axios
      .delete(`http://localhost:4000/api/cart/${id}`)
      .catch((err) => console.error("Error removing from cart:", err.message));
  };

  // =======================
  // Calculate total
  // =======================
  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  // =======================
  // Render UI
  // =======================
  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h2 className="text-primary">Our Products</h2>
        <button
          className="btn btn-success position-relative"
          type="button"
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

      {/* Products Grid */}
      <div className="row g-4">
        {products.map((product) => (
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
                <h5 className="card-title">{product.name}</h5>
                <p className="text-muted fw-bold">₹{product.price}</p>
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

      {/* Offcanvas Cart */}
      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="cartOffcanvas"
        aria-labelledby="cartOffcanvasLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="cartOffcanvasLabel">
            Your Cart
          </h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
          ></button>
        </div>
        <div className="offcanvas-body d-flex flex-column">
          {cart.length === 0 ? (
            <p className="text-muted">No items in cart.</p>
          ) : (
            <div className="list-group">
              {cart.map((item) => {
                const subtotal = item.price * item.qty;
                return (
                  <div
                    key={item._id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div className="d-flex align-items-center">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="me-3 rounded"
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                          }}
                        />
                      )}
                      <div>
                        <h6 className="mb-1">{item.name}</h6>
                        <p className="mb-1">
                          Price: ₹{item.price} x {item.qty} = ₹{subtotal}
                        </p>
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
                    </div>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => removeFromCart(item._id)}
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {cart.length > 0 && (
            <div className="mt-auto pt-3 border-top">
              <h5 className="text-end">Total: ₹{total}</h5>
              <button className="btn btn-success w-100 mt-2">Checkout</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartUseState;
