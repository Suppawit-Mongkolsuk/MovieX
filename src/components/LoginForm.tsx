import React, { useState } from "react";

const LoginForm: React.FC = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`เข้าสู่ระบบด้วยอีเมล: ${email} และรหัสผ่าน: ${password}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-r from-blue-400 to-indigo-600">
      {/* กล่อง login form */}
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        {/* หัวข้อ */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          เข้าสู่ระบบ                                                                                        
        </h2>

        {/* ฟอร์ม */}
        <form onSubmit={handleSubmit}>
          {/* ช่องกรอกอีเมล */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">อีเมล</label>
            <input
              type="email"
              placeholder="กรอกอีเมลของคุณ"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* ช่องกรอกรหัสผ่าน */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-1">รหัสผ่าน</label>
            <input
              type="password"
              placeholder="กรอกรหัสผ่านของคุณ"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* ปุ่มเข้าสู่ระบบ */}
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-black rounded-lg hover:bg-blue-700 transition"
          >
            เข้าสู่ระบบ
          </button>
        </form>

        {/* ลิงก์สมัครสมาชิก */}
        <p className="mt-4 text-center text-sm text-gray-600">
          ยังไม่มีบัญชี?{" "}
          <a href="#" className="text-blue-600 hover:underline">
            สมัครสมาชิก
          </a>
        </p>
      </div>
    </div>
  );
};


export default LoginForm;
