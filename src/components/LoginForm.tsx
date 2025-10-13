import React, { useState } from "react";
import "./LoginForm.css";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Email: ${email}\nPassword: ${password}`);
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="login-title">เข้าสู่ระบบ</h2>

        <div className="form-group">
          <label htmlFor="email">อีเมล</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="กรอกอีเมลของคุณ"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">รหัสผ่าน</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="กรอกรหัสผ่าน"
            required
          />
        </div>

        <button type="submit" className="btn-login">
          เข้าสู่ระบบ
        </button>

        <p className="register-text">
          ยังไม่มีบัญชี? <a href="#" className="link">สมัครสมาชิก</a>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
