import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [], // all products
  cart: [], // items in cart
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Set all products
    setProducts: (state, action) => {
      state.products = action.payload;
    },

    // Set cart (for initial load)
    setCart: (state, action) => {
      state.cart = action.payload;
    },

    // Add product to cart
    addToCart: (state, action) => {
      const productId = action.payload._id || action.payload.id;
      const productStock = action.payload.stock || 1;

      // Find existing item in cart
      const existingItem = state.cart.find((item) => item._id === productId);

      if (existingItem) {
        // Increment qty if stock allows
        if (existingItem.qty < productStock) {
          existingItem.qty += 1;
        } else {
          alert(`Only ${productStock} items in stock!`);
        }
      } else {
        // Add new item
        state.cart.push({ ...action.payload, qty: 1, _id: productId });
      }
    },

    // Remove from cart
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter((item) => item._id !== action.payload);
    },

    // Update quantity
    updateQty: (state, action) => {
      const { id, qty } = action.payload;
      const product = state.products.find((p) => p._id === id || p.id === id);
      const cartItem = state.cart.find((i) => i._id === id);
      if (!cartItem || !product) return;

      if (qty > product.stock) {
        alert(`Only ${product.stock} items in stock!`);
        cartItem.qty = product.stock;
      } else if (qty <= 0) {
        // Remove if qty <= 0
        state.cart = state.cart.filter((i) => i._id !== id);
      } else {
        cartItem.qty = qty;
      }
    },

    // Clear entire cart
    clearCart: (state) => {
      state.cart = [];
    },
  },
});

export const {
  setProducts,
  setCart,
  addToCart,
  removeFromCart,
  updateQty,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
