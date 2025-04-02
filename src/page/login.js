import React, { useState } from "react";
import "../assets/css/style.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      alert("Invalid email format");
      return;
    }

    if (email === "a@b.c" && password === "1234") {
      localStorage.setItem("ez-acc-tk", "your-token-here");
      window.location.href = "/console";
    } else {
      alert("Invalid username or password");
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex flex-column flex-md-row align-items-stretch bg-light">
      {/* Left side */}
      <div className="col-12 col-md-6 d-flex flex-column align-items-center justify-content-center p-4 bg-white">
        <h2 className="text-primary mb-3 FCIconic-Bold">ยินดีต้อนรับ</h2>
        <p className="text-muted text-center">กรุณากรอกอีเมลและรหัสผ่านเพื่อเข้าใช้งานระบบ</p>
        <form className="w-100" onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">อีเมล</label>
            <input
              className="form-control"
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">รหัสผ่าน</label>
            <input
              className="form-control"
              type="password"
              placeholder="รหัสผ่าน"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-check form-switch mb-3">
            <input className="form-check-input" type="checkbox" id="rememberMe" />
            <label className="form-check-label" htmlFor="rememberMe">จดจำ</label>
          </div>
          <button type="submit" className="btn btn-primary w-100">เข้าสู่ระบบ</button>
        </form>
        <p className="mt-3 text-muted small">version 1.0.0</p>
      </div>
      {/* Right side */}
      <div className="d-none d-md-flex col-md-6 align-items-center justify-content-center bg-primary text-white">
        <h1 className="fw-bold">LOGO</h1>
      </div>

    </div>

  );
};

export default Login;
