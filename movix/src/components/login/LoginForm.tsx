import React, { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';
import PasswordInput from './PasswordInput';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import type { User } from '../../api/typeuser';

const LoginForm: React.FC = () => {
  // กลุ่ม state หลักของฟอร์ม login + effect
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // state สำหรับควบคุมข้อความแจ้งเตือนและ motion สั่น
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  // state สำหรับภาพพื้นหลังสไลด์ (index + fade in/out)
  const [currentImage, setCurrentImage] = useState(0);
  const [fade, setFade] = useState(true);

  const navigate = useNavigate();
  // helper สำหรับพาไปหน้า Register ด้วยปุ่มด้านล่าง
  const goToRegister = () => {
    navigate('/register');
  };

  // รวม path ของภาพทั้งหมดที่ใช้ random background
  const images = [
    '/src/assets/Bg1.jpg',
    '/src/assets/Bg2.jpg',
    '/src/assets/Bg3.jpg',
    '/src/assets/Bg4.jpg',
    '/src/assets/Bg5.jpg',
    '/src/assets/Bg6.jpg',
    '/src/assets/Bg7.jpg',
    '/src/assets/Bg8.jpg',
    '/src/assets/Bg9.jpg',
    '/src/assets/Bg10.jpg',
    '/src/assets/Bg11.jpg',
    '/src/assets/Bg12.jpg',
  ];

  // ใช้ useEffect เพื่อเปลี่ยนภาพ background อัตโนมัติทุก 4.5 วิ พร้อม fade
  // ตั้ง interval ให้ภาพพื้นหลังค่อย ๆ เปลี่ยนทุก 4.5 วินาที
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // เริ่ม fade out
      setTimeout(() => {
        setCurrentImage((prev) => (prev + 1) % images.length); // เปลี่ยนภาพ
        setFade(true); // fade in
      }, 700); // .. วิระหว่าง fade
    }, 4500); // ทุก .. วิ

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ฟังก์ชันหลัก: ตรวจสอบข้อมูลและเรียก MockAPI เพื่อ login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShake(false);

    if (!email.trim() || !password.trim()) {
      setError('⚠️ กรุณากรอกอีเมลและรหัสผ่านให้ครบ');
      setShake(true);
      return;
    }

    try {
      // ดึงข้อมูลผู้ใช้จาก MockAPI
      const res = await axios.get(
        'https://68f0fcef0b966ad50034f883.mockapi.io/Login'
      );
      const users = res.data;

      // ค้นหาผู้ใช้ที่อีเมลและรหัสผ่านตรงกัน
      const foundUser = users.find(
        (u: User) => u.gmail === email && u.pass === password
      );

      if (foundUser) {
        // อัปเดต flag isLogin = true เพื่อบอกว่า user กำลังใช้งานอยู่
        await axios.put(
          `https://68f0fcef0b966ad50034f883.mockapi.io/Login/${foundUser.id}`,
          {
            ...foundUser, // ต้องส่งข้อมูลทั้งหมดกลับไปด้วย
            isLogin: true,
          }
        );
        const userRole = foundUser.role || 'user'; // ถ้าไม่มี role ให้ default เป็น user
        alert(`เข้าสู่ระบบสำเร็จ ✅ (สิทธิ์: ${userRole})`);

        // นำทางตามสิทธิ์
        if (userRole === 'Admin') {
          navigate('/');
        } else {
          navigate('/');
        }
      } else {
        setError('⚠️ อีเมลหรือรหัสผ่านไม่ถูกต้อง');
        setShake(true);
      }
    } catch (err) {
      console.error(err);
      setError('⚠️ ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
      setShake(true);
    }

    setTimeout(() => setShake(false), 500);
  };

  return (
    // พืนหลัง
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {images.map((img, index) => (
        <motion.img
          key={index}
          src={img}
          alt={`background-${index}`}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            filter: 'contrast(1.1) saturate(1.2)',
          }}
          animate={{
            opacity: currentImage === index ? (fade ? 1 : 0) : 0,
            scale: currentImage === index ? 1.05 : 1,
          }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />
      ))}

      <div className="absolute inset-0 bg-black/30"></div>

      {/* กล่อง login form */}
      <motion.div
        className="bg-white/10 backdrop-blur-xl border border-white/40 p-8 m-4 rounded-3xl shadow-lg w-full max-w-md"
        animate={shake ? { x: [-8, 8, -6, 6, -4, 4, 0] } : { x: 0 }} // เอฟเฟกต์สั่น
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-3xl font-semibold text-center text-red-800 mb-10">
          MovieX
        </h2>

        {/* ฟอร์ม */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* อีเมล */}
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70"
              size={18}
            />
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
              onChange={(e) => setPassword(e.target.value)}
            />
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
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-white-400  hover: transition-all duration-300 hover:scale-105"
            >
              Forgot Password?
            </button>
          </div>

          {/* แสดงข้อความ error ถ้ามี error */}
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

          {/* ปุ่มเข้าสู่ระบบ */}
          <button
            type="submit"
            className="w-full py-2 font-semibold text-black bg-white rounded-2xl shadow-md
             hover:bg-gradient-to-r hover:from-red-500 hover:to-orange-400 hover:text-white
             hover:-translate-y-1 hover:shadow-lg transform transition-all duration-300"
          >
            Login
          </button>
        </form>

        {/* ลิงก์สมัครสมาชิก */}
        <p className="mt-4 text-center text-sm text-black">
          Don't have an account?{' '}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={goToRegister}
            className="text-white-400 hover:transition-all duration-300 hover:scale-105 ml-3"
          >
            {' '}
            Register
          </motion.button>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginForm;
