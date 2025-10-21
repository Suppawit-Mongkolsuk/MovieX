import React, { useState , useEffect } from "react";
import { Mail } from "lucide-react";
import PasswordInput from "./PasswordInput";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const LoginForm: React.FC = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  const [currentImage , setCurrentImage] = useState(0);
  const [ , setFade] = useState(true);

  const navigate = useNavigate();
  const goToRegister = () => {
    navigate("/register");
};

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

  // เข้าเงื่อนไขถ้าใส่รหัสหรืออีเมลให้สั่น
    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setShake(false);

    setTimeout(() => {
    if (!email.trim() && !password.trim()) {
      setError("⚠️ กรุณากรอกอีเมลและรหัสผ่านให้ครบก่อนเข้าสู่ระบบ");
      setShake(true);
  } else if (!email.trim()) {
      setError("⚠️ กรุณากรอกอีเมลก่อนเข้าสู่ระบบ");
      setShake(true);
  } else if (!password.trim()) {
      setError("⚠️ กรุณากรอกรหัสผ่านก่อนเข้าสู่ระบบ");
      setShake(true);
  } else {
      setError("");
      alert(`เข้าสู่ระบบด้วยอีเมล: ${email} และรหัสผ่าน: ${password}`);
  }
 }, 50);
};

  return (                                                                                           // พืนหลัง
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
    {images.map((img, index) => (
        <motion.img
          key={index}
          src={img}
          alt={`background-${index}`}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: currentImage === index ? 1 : 0,
            filter: "contrast(1.1) saturate(1.2)",
          }}
          animate={{ opacity: currentImage === index ? 1 : 0 , scale: 1.05 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />
      ))}

    <div className="absolute inset-0 bg-black/30"></div>
        
      {/* กล่อง login form */}
      <motion.div
        className="bg-white/10 backdrop-blur-xl border border-white/40 p-8 rounded-3xl shadow-lg w-full max-w-md"
        animate={shake ? { x: [-8, 8, -6, 6, -4, 4, 0] } : { x: 0 }} // เอฟเฟกต์สั่น
        transition={{ duration: 0.4 }}>
        <h2 className="text-3xl font-semibold text-center text-red-800 mb-10">MoiveX</h2>

        {/* ฟอร์ม */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* อีเมล */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" size={18} />
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 py-2 bg-transparent border-b border-white/50 text-white placeholder-white/60 focus:outline-none focus:border-white transition"
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
            <a href="#"  className="text-blue-400 underline underline-offset-4 hover:text-blue-300 transition-all duration-300 hover:scale-105">
              Forgot Password?
            </a>
          </div>

          {/* แสดงข้อความ error ถ้ามี error */}
          <AnimatePresence>
            {error && (
              <motion.p
                className="text-red-400 text-center text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }} >
            {error}
              </motion.p>)}
          </AnimatePresence>

          {/* ปุ่มเข้าสู่ระบบ */}
          <button
            type="submit"
            className="w-full py-2 font-semibold text-black bg-white rounded-2xl shadow-md
             hover:bg-gradient-to-r hover:from-red-500 hover:to-orange-400 hover:text-white
             hover:-translate-y-1 hover:shadow-lg transform transition-all duration-300">
            Login
          </button>
        </form>

        {/* ลิงก์สมัครสมาชิก */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={goToRegister}
            className="text-blue-400 underline underline-offset-4 hover:text-blue-300 transition-all duration-300 hover:scale-105"> Register
            </motion.button>
          </p>
      </motion.div>
    </div>
  );
 };

export default LoginForm;