import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function UserMenu() {
  const [isopen, setisopen] = useState(false); // ควบคุมการแสดงผลเมนู
  const [showModal, setshowModal] = useState(false); // ควบคุมการแสดงผล Modal
  const [file, setfile] = useState<File | null>(null); // เก็บไฟล์ที่เลือก
  const [isuser, setuser] = useState<any>(null); // เก็บข้อมูลผู้ใช้
  const [uploading, setuploading] = useState(false); // สถานะการอัปโหลดไฟล์

  useEffect(() => {
    // ดึงข้อมูลผู้ใช้จาก API เมื่อคอมโพเนนต์ถูกโหลด
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          'https://68f0fcef0b966ad50034f883.mockapi.io/Login'
        );
        setuser(res.data); // เก็บข้อมูลผู้ใช้ใน state
      } catch (error) {
        console.error('โหลดข้อมูลไม่สำเร็จ:', error);
      }
    };
    fetchUser();
  }, []);

  return (
    <div>
      <Link
        to="/login"
        className="ml-5 w-10 h-10 rounded-full border border-[#d4af37]/60 bg-white/10 flex items-center justify-center"
        aria-label="Profile"
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
          alt="Profile"
          className="w-full h-full object-cover rounded-full"
        />
      </Link>
    </div>
  );
}
