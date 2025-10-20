import React, { useState , useEffect } from "react";
import { Mail } from "lucide-react";
import PasswordInput from "./PasswordInput";

const LoginForm: React.FC = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [currentImage , setCurrentImage] = useState(0);
  const [fade, setFade] = useState(true);

  const images = [
    "/src/assets/Bg1.jpg",
    "/src/assets/Bg2.jpg",
    "/src/assets/Bg3.jpg",
    "/src/assets/Bg4.jpg",
    "/src/assets/Bg5.jpg",
    "/src/assets/Bg6.jpg",
    "/src/assets/Bg7.jpg",
    "/src/assets/Bg8.jpg"
  ];
// ใช้ useEffect เพื่อเปลี่ยนภาพทุก 5 วิ พร้อมทำ transition
  useEffect(() => {
    const interval = setInterval (() => {
      setFade(false); // เริ่ม fade out
      setTimeout(() => {
        setCurrentImage((prev) => (prev + 1)% images.length); // เปลี่ยนภาพ
        setFade(true); // fade in
      },1000); // .. วิระหว่าง fade
    },5000); // ทุก .. วิ

    return () => clearInterval(interval);
  },[]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`เข้าสู่ระบบด้วยอีเมล: ${email} และรหัสผ่าน: ${password}`);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">

      <img
        key={currentImage}
        src={images[currentImage]}
        alt="background"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
          fade ? "opacity-100" : "opacity-0"
        }`}
        style={{
          filter: "contrast(1.1) saturate(1.2)", //เพิ่มความคมของสี
        }}
      />
    <div className="absolute inset-0 bg-black/30"></div>
        
      {/* กล่อง login form */}
      <div className="bg-white/1 backdrop-blur-xl border border-white/50 p-8 rounded-3xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center text-red-800 mb-10">MoiveX</h2>

        {/* ฟอร์ม */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* อีเมล */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" size={18} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 py-2 bg-transparent border-b border-white/50 text-white placeholder-white/60 focus:outline-none focus:border-white transition"
              required
            />
          </div>

          {/* ช่องกรอกรหัสผ่าน */}
          <div className="mb-6">
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}/>
          </div>

          {/* ช่อง Remember me / Forgot Password */}
          <div className="flex items-center justify-between text-sm text-white/70">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="accent-white/80 w-4 h-4 rounded border-white/50 bg-transparent"
              />
              Remember me
            </label>

            <a href="#" className="hover:underline hover:text-white">
              Forgot Password?
            </a>
          </div>

          {/* ปุ่มเข้าสู่ระบบ */}
          <button
            type="submit"
            className="w-full py-2 font-semibold text-black bg-white rounded-2xl  "
          >
            Login
          </button>
        </form>

        {/* ลิงก์สมัครสมาชิก */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};


export default LoginForm;
