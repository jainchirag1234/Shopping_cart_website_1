import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      const res = await axios.post("http://localhost:4000/api/login", form);

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        setMsg("Login Successful ✅");

        setTimeout(() => {
          navigate("/useState");
        }, 800);
      } else {
        setMsg(res.data.message);
      }
    } catch (err) {
      setMsg("Something went wrong ❌");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          className="login-input"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        {errors.email && <p className="error-text">{errors.email}</p>}

        <input
          type="password"
          placeholder="Password"
          className="login-input"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        {errors.password && <p className="error-text">{errors.password}</p>}

        <button type="submit" className="login-btn">
          Login
        </button>
      </form>

      {msg && <p className="message">{msg}</p>}

      <p className="register-link">
        Don’t have an account? <Link to="/">Register</Link>
      </p>
    </div>
  );
}

export default Login;
