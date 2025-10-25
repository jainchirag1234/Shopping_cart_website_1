import { useState } from "react";
import "./App.css";
import CartUseState from "./comp/CartUseState";
import CartRedux from "./comp/CartRedux";
import AddProducts from "./comp/AddProducts"; // ✅ import AddProducts

function App() {
  const [activeCart, setActiveCart] = useState("useState"); // default view

  return (
    <>
      {/* ✅ Modern Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div className="container-fluid">
          <a className="navbar-brand fw-bold text-warning" href="#">
            🛒 My Cart App
          </a>
          <div className="d-flex">
            <button
              className={`btn mx-2 ${
                activeCart === "useState"
                  ? "btn-warning text-dark fw-bold"
                  : "btn-outline-light"
              }`}
              onClick={() => setActiveCart("useState")}
            >
              Cart (useState)
            </button>
            <button
              className={`btn mx-2 ${
                activeCart === "redux"
                  ? "btn-success fw-bold"
                  : "btn-outline-light"
              }`}
              onClick={() => setActiveCart("redux")}
            >
              Cart (Redux)
            </button>
            <button
              className={`btn mx-2 ${
                activeCart === "addProduct"
                  ? "btn-info text-dark fw-bold"
                  : "btn-outline-light"
              }`}
              onClick={() => setActiveCart("addProduct")}
            >
              Add Product
            </button>
          </div>
        </div>
      </nav>

      {/* ✅ Page Content */}
      <div className="container mt-4">
        {activeCart === "useState" && <CartUseState />}
        {activeCart === "redux" && <CartRedux />}
        {activeCart === "addProduct" && <AddProducts />}{" "}
        {/* ✅ AddProducts render */}
      </div>
    </>
  );
}

export default App;
