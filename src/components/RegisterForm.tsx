import React, { useState, useEffect} from "react";
import { Mail, Lock, Phone } from "lucide-react";
import { motion , AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const RegisterForm: React.FC = () => {

    const [phone, setPhone] = useState<string>("");
    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [shake, setShake] = useState(false);

    const [currentImage, setCurrentImage] = useState(0);
    const [ , setFade] = useState(true);

    const navigate = useNavigate();

    const images = [
    "/src/assets/Bg1.jpg",
    "/src/assets/Bg2.jpg",
    "/src/assets/Bg3.jpg",
    "/src/assets/Bg4.jpg",
    "/src/assets/Bg5.jpg",
  ];

   useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentImage((prev) => (prev + 1) % images.length);
        setFade(true);
      }, 1000);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // ตรวจสอบข้อมูลก่อนสมัคร
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("⚠️ กรุณากรอกข้อมูลให้ครบทุกช่อง");
      setShake(true);
    } else if (password !== confirmPassword) {
      setError("⚠️ รหัสผ่านไม่ตรงกัน");
      setShake(true);
    } else if (!/^\d+$/.test(phone)) {
      setError("⚠️ กรุณากรอกเบอร์โทรศัพท์เฉพาะตัวเลขเท่านั้น");
      setShake(true);
    } else if (phone.length < 10) {
      setError("⚠️ เบอร์โทรศัพท์ต้องมีอย่างน้อย 10 หลัก");
      setShake(true);
    } else if (!/^(09|08|06)\d{8}$/.test(phone)) {
      setError("⚠️ เบอร์โทรศัพท์ต้องขึ้นต้นด้วย 09, 08 หรือ 06");
      setShake(true);
    } else {
      setError("");
      alert(`สมัครสมาชิกสำเร็จ! 🎉\nเบอร์โทร: ${phone}\nอีเมล: ${email}`);
    }

    setTimeout(() => setShake(false), 500);
  };

  return (                                                                                              // พืนหลัง
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
      <div className="absolute inset-0 bg-black/40"></div>

      {/* กล่องสมัครสมาชิก */}
      <motion.div
        className="bg-white/10 backdrop-blur-xl border border-white/40 p-8 rounded-3xl shadow-lg w-full max-w-md"
        animate={shake ? { x: [-8, 8, -6, 6, -4, 4, 0] } : { x: 0 }}
        transition={{ duration: 0.4 }}>
        <h2 className="text-3xl font-semibold text-center text-red-800 mb-10">Create Account</h2>

     {/* ฟอร์ม */}
        <form onSubmit={handleSubmit} className="space-y-6">
        
          {/* เบอร์โทรศัพท์ */}
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" size={18} />
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            setPhone(value);
    }
}
    className="w-full pl-10 py-2 bg-transparent border-b border-white/50 text-white placeholder-white/60 focus:outline-none focus:border-white transition"/>
          </div>

          {/* อีเมล */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" size={18} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 py-2 bg-transparent border-b border-white/50 text-white placeholder-white/60 focus:outline-none focus:border-white transition"
            />
          </div>

          {/* รหัสผ่าน */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" size={18} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 py-2 bg-transparent border-b border-white/50 text-white placeholder-white/60 focus:outline-none focus:border-white transition"
            />
          </div>

          {/* ยืนยันรหัสผ่าน */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" size={18} />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 py-2 bg-transparent border-b border-white/50 text-white placeholder-white/60 focus:outline-none focus:border-white transition"
            />
          </div>

          {/* แสดง error */}
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
          </AnimatePresence>

          {/* ปุ่มสมัคร */}
          <button
            type="submit"
            className="w-full py-2 font-semibold text-black bg-white rounded-2xl shadow-md
                       hover:bg-gradient-to-r hover:from-red-500 hover:to-orange-400 hover:text-white
                       hover:shadow-red-500/50 hover:-translate-y-1 transform transition-all duration-300"
          >
            Register
          </button>
        </form>

        {/* ลิงก์กลับไปหน้า login */}
        <p className="mt-4 text-center text-sm text-gray-400">
      Already have an account?{" "}
      <button
        type="button"
        onClick={() => navigate("/")}
        className="text-blue-400 underline underline-offset-4 hover:text-blue-300 transition-all duration-300 hover:scale-105">Login</button>
            </p>
      </motion.div>
    </div>
  );
};

export default RegisterForm;