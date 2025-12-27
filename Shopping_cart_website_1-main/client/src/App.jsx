import { useState, useEffect } from "react";
import "./App.css";
import CartUseState from "./comp/CartUseState";
import CartRedux from "./comp/CartRedux";
import AddProducts from "./comp/AddProducts";
import Register from "./comp/Register";
import Login from "./comp/Login";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  Link,
} from "react-router-dom";

/* ✅ Private Route Component */
function PrivateComponent({ children }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  return token ? children : null;
}

/* ✅ Shopping App */
function ShoppingApp() {
  const [activeCart, setActiveCart] = useState("useState");
  const token = localStorage.getItem("token");

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div className="container-fluid">
          <a className="navbar-brand fw-bold text-warning" href="#">
            🛒 Shopping Cart App
          </a>

          <div className="d-flex">
            {/* ✅ If NOT Logged In → Login/Register */}
            {!token ? (
              <>
                <Link className="btn btn-outline-light mx-2" to="/login">
                  Login
                </Link>
                <Link className="btn btn-outline-warning mx-2" to="/">
                  Register
                </Link>
              </>
            ) : (
              <>
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

                {/* ✅ Logout */}
                <button
                  className="btn btn-danger mx-2"
                  onClick={() => {
                    localStorage.removeItem("token");
                    window.location.href = "/login";
                  }}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        {activeCart === "addProduct" && <AddProducts />}
        {activeCart === "useState" && <CartUseState />}
        {activeCart === "redux" && <CartRedux />}
      </div>
    </>
  );
}

/* ✅ Main App */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* ✅ After Login → show cart */}
        <Route
          path="/useState"
          element={
            <PrivateComponent>
              <ShoppingApp />
            </PrivateComponent>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
