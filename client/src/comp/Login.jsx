import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; // ✅ import useNavigate

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");

  const navigate = useNavigate(); // ✅ create navigate object

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:4000/api/login", form);

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        setMsg("Login Successful ✅");

        // ✅ Redirect to Cart page
        setTimeout(() => {
          navigate("/useState"); // <-- your cart route
        }, 800);
      } else {
        setMsg(res.data.message);
      }
    } catch (err) {
      setMsg("Something went wrong ❌");
    }
  };

  return (
    <div style={{ width: "300px", margin: "auto", marginTop: "100px" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <br />
        <br />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <br />
        <br />

        <button type="submit">Login</button>
      </form>

      <p>{msg}</p>

      <p>
        Don’t have an account? <Link to="/">Register</Link>
      </p>
    </div>
  );
}

export default Login;
