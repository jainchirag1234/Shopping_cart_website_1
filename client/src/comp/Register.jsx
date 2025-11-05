import React, { useState } from "react";
import axios from "axios";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }
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
    setErrors({}); // clear previous errors
    try {
      const res = await axios.post("http://localhost:4000/api/register", form);
      setMsg(res.data.message);
    } catch (err) {
      setMsg("Something went wrong");
    }
  };

  return (
    <div style={{ width: "300px", margin: "auto", marginTop: "100px" }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <br></br>
        {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
        <br />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <br></br>
        {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
        <br />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <br></br>
        {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
        <br />

        <button type="submit">Register</button>
      </form>
      <p>{msg}</p>
      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
}

export default Register;
