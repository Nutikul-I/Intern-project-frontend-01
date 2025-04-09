import React, { useState } from "react";
import "../assets/css/bootstrap.css";
import "../assets/css/style.css";
import Swal from 'sweetalert2';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);


  const handleLogin = (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(username)) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'กรุณากรอกอีเมลที่ถูกต้อง',
      });
      return;
    }

    if (username === "a@b.c" && password === "1234") {
      localStorage.setItem("ez-acc-tk", "your-token-here");
      window.location.href = "/console/dashboard";
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Login',
        text: 'Invalid username or password',
      });
    }
  };



  return (
    <div className="container-fluid vh-100 d-flex flex-column flex-md-row p-0">
      {/* Logo Section for Mobile */}
      <div
        className="d-md-none bg-primary text-white text-center position-relative d-flex align-items-center justify-content-center"
        style={{ height: "50vh" }} // เพิ่มความสูงเป็น 50%
      >
        <h1 className="fw-bold display-4 m-0">LOGO</h1>
        <div
          className="position-absolute w-100 h-100"
          style={{
            background: "url(/wave-pattern.png)",
            opacity: 0.2,
            top: 0,
            left: 0,
            backgroundSize: "cover",
          }}
        ></div>
      </div>

      {/* Form Section */}
      <div className="col-md-6 d-flex align-items-center justify-content-center bg-white p-5">
        <form
          onSubmit={handleLogin}
          className="w-100"
          style={{ maxWidth: "400px" }}
        >
          <h2 className="text-primary fw-bold mb-3">ยินดีต้อนรับ</h2>
          <p className="text-muted mb-4">
            กรุณาเข้าสู่ระบบด้วยอีเมลและรหัสผ่านของคุณ
          </p>

          {/* Email */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label text-muted">
              อีเมล
            </label>
            <input
              id="email"
              className="form-control"
              type="text"
              placeholder="example@gmail.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label text-muted">
              รหัสผ่าน
            </label>
            <input
              id="password"
              className="form-control"
              type="password"
              placeholder="รหัสผ่าน"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Toggle Remember Me */}
          <div className="form-check form-switch mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{
                backgroundColor: rememberMe ? "#0d6efd" : "#e9ecef", // สีฟ้าเมื่อ on / เทาเมื่อ off
                borderColor: rememberMe ? "#0d6efd" : "#ced4da",
                cursor: "pointer",
              }}
            />
            <label
              className="form-check-label text-muted ms-2"
              htmlFor="remember"
            >
              จำฉันไว้
            </label>
          </div>

          {/* Login Button */}
          <button className="btn btn-primary w-100">เข้าสู่ระบบ</button>
          <p className="text-center text-muted mt-3">เวอร์ชั่น 1.0.0</p>
        </form>
      </div>

      {/* Logo Section for Desktop */}
      <div
        className="col-md-6 d-none d-md-flex align-items-center justify-content-center bg-primary position-relative text-white"
        style={{ height: "100vh" }}
      >
        <h1 className="fw-bold display-3 m-0">LOGO</h1>
        <div
          className="position-absolute w-100 h-100"
          style={{
            background: "url(/wave-pattern.png)",
            opacity: 0.3,
            top: 0,
            left: 0,
            backgroundSize: "cover",
          }}
        ></div>
      </div>
    </div>
  );
};

export default Login;