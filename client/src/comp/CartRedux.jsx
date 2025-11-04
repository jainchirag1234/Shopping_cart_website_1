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
        const res = await fetch("http://localhost:4000/api/product");
        const data = await res.json();
        const updatedProducts = data.map((p) => ({
          ...p,
          image: p.image ? `http://localhost:4000/uploads/${p.image}` : null,
        }));
        dispatch(setProducts(updatedProducts));
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
    // showMessage(`${product.name} quantity updated!`);
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

  return (
    <div className="container py-5">
      {/* ✅ Center Modal Message */}
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
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h2 className="text-primary">Products</h2>
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
        {products.map((product) => {
          const productId = product._id || product.id;
          return (
            <div key={productId} className="col-md-3">
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
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          );
        })}
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
                          ₹{item.price} x {item.qty} = ₹{subtotal}
                        </p>
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() =>
                              handleUpdateQty(item._id, item.qty - 1)
                            }
                          >
                            -
                          </button>
                          <span className="btn btn-light">{item.qty}</span>
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() =>
                              handleUpdateQty(item._id, item.qty + 1)
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleRemoveFromCart(item._id)}
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartRedux;
