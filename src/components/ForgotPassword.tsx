import React, { useState, useEffect } from "react";
import { Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");
  const [shake, setShake] = useState(false);
  const [successEffect, setSuccessEffect] = useState(false);

  const [currentImage, setCurrentImage] = useState(0);
  const [fade, setFade] = useState(true);
  const [pageFade, setPageFade] = useState(true);

  const navigate = useNavigate();

  const images = [
    "/src/assets/Bg1.jpg",
    "/src/assets/Bg2.jpg",
    "/src/assets/Bg3.jpg",
    "/src/assets/Bg4.jpg",
    "/src/assets/Bg5.jpg",
    "/src/assets/Bg6.jpg",
    "/src/assets/Bg7.jpg",
    "/src/assets/Bg8.jpg",
    "/src/assets/Bg9.jpg",
    "/src/assets/Bg10.jpg",
    "/src/assets/Bg11.jpg",
    "/src/assets/Bg12.jpg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentImage((prev) => (prev + 1) % images.length);
        setFade(true);
      }, 700);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const englishRegex = /^[A-Za-z0-9@._-]+$/;
    const thaiRegex = /[ก-๙]/;

  if (!email.trim()) {
    setError("⚠️ กรุณากรอกอีเมลของคุณ");
    setShake(false);
    setTimeout(() => setShake(true), 0);
    return;
  } else if (thaiRegex.test(email)) {
    setError("⚠️ ห้ามกรอกอักษรภาษาไทย");
    setShake(false);
    setTimeout(() => setShake(true), 0);
    return;
  } else if (!englishRegex.test(email)) {
    setError("⚠️ กรุณากรอกเฉพาะอักษรภาษาอังกฤษ ตัวเลข หรือเครื่องหมายที่ใช้ในอีเมลเท่านั้น");
    setShake(false);
    setTimeout(() => setShake(true), 0);
    return;
  } else if (!email.includes("@") || !email.includes(".")) {
    setError("⚠️ กรุณากรอกอีเมลให้ครบ เช่น example@gmail.com");
    setShake(false);
    setTimeout(() => setShake(true), 0);
    return;
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    setError("⚠️ กรุณากรอกอีเมลให้ถูกต้อง");
    setShake(false);
    setTimeout(() => setShake(true), 0);
    return;
  }

  setError("");
  try {
    const res = await axios.post("http://localhost:5000/api/forgot-password", { email });
    setSuccess(`✅ ${res.data.message}`);
    setSuccessEffect(true);
    setTimeout(() => setSuccessEffect(false), 1200);
  } catch (err: any) {
    setError(err.response?.data?.message || "กรุณาลองใหม่อีกครั้ง");
    setShake(true);
  }

    setTimeout(() => setShake(false), 500);
  };

  return (
    <motion.div
  className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
  initial={{ opacity: 0 }}
  animate={{ opacity: pageFade ? 1 : 0 }}
  transition={{ duration: 0.8, ease: "easeInOut" }}
>
  {images.map((img, index) => (
    <motion.img
      key={index}
      src={img}
      alt={`background-${index}`}
      className="absolute inset-0 w-full h-full object-cover"
      style={{
        filter: "contrast(1.1) saturate(1.2)",
      }}
      animate={{
        opacity: currentImage === index ? (fade ? 1 : 0) : 0,
        scale: currentImage === index ? 1.05 : 1,
      }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
    />
))}

      <div className="absolute inset-0 bg-black/40"></div>

      {/* กล่อง Forgot Password */}
      <motion.div
        className="bg-white/10 backdrop-blur-xl border border-white/40 p-8 rounded-3xl shadow-lg w-full max-w-md"
        animate={shake ? { x: [-8, 8, -6, 6, -4, 4, 0] } : { x: 0 }}
        transition={{ duration: 0.4 }}>
        <h2 className="text-3xl font-semibold text-center text-red-800 mb-8">
          Forgot Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70"
              size={18}
            />
            <input
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 py-2 bg-transparent border-b border-white/50 text-white placeholder-white/60 focus:outline-none focus:border-white transition"
            />
          </div>

          {/* แสดงข้อความแจ้งเตือน */}
          <AnimatePresence>
            {error && (
              <motion.p
                className="text-red-400 text-center text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {error}
              </motion.p>
            )}
            {success && (
              <motion.p
                className="text-green-400 text-center text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {success}
              </motion.p>
            )}
          </AnimatePresence>

          {/* ปุ่มส่งอีเมลพร้อมแอนิเมชัน */}
          <motion.button
          key={successEffect ? "success" : "normal"}
            type="submit"
            className="w-full py-2 font-semibold text-black bg-white rounded-2xl shadow-md
                       hover:bg-gradient-to-r hover:from-red-500 hover:to-orange-400 hover:text-white
                       hover:shadow-red-500/50 hover:-translate-y-1 transform transition-all duration-300"
            animate={
              successEffect
                ? {
                    scale: [1, 1.1, 1],
                    boxShadow: [
                      "0 0 0px white",
                      "0 0 20px white",
                      "0 0 0px white",
                    ],
                  }
                : {}
            }
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            Send Reset Link
          </motion.button>
        </form>

        {/* ลิงก์กลับไป Login */}
        <p className="mt-4 text-center text-sm text-gray-400">
          Remember your password?{" "}
          <button
            type="button"
            onClick={() => {
                setPageFade(false);
                setTimeout(() => navigate("/"), 800);
        }}
            className="text-blue-400 underline underline-offset-4 hover:text-blue-300 transition-all duration-300 hover:scale-105">
            Login
            </button>
            </p>
      </motion.div>
    </motion.div>
  );
};

export default ForgotPasswordForm;