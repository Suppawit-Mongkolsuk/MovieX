import { useEffect, useState } from 'react'; // import useEffect, useState
import { Navbarmenu } from '../../data/Navbar';
import { NavbarmenuAdmin } from '../../data/Navbar';
import { RiMovie2AiLine } from 'react-icons/ri';
import { FaSearch } from 'react-icons/fa';
import { IoMdMenu } from 'react-icons/io';
import Responsive from './responsive_navbar';
import UserMenu from './user_manu';
import axios from 'axios';

function Navbar() {
  // state สำหรับเปิด/ปิดเมนู mobile
  const [open, setopen] = useState(false);
  // state สำหรับเก็บ role ของ user ที่ล็อกอิน
  const [userRole, setUserRole] = useState<string | null>(null);

  // ดึงข้อมูล role ของ user จาก MockAPI
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get(
          'https://68f0fcef0b966ad50034f883.mockapi.io/Login'
        );
        // ตรวจ role ของ user ที่ล็อกอินอยู่
        const loggedInUser = response.data.find(
          (user: any) => user.isLogin === true
        );
        setUserRole(loggedInUser ? loggedInUser.role : null);
      } catch (error) {
        console.error('โหลดข้อมูลผู้ใช้ไม่สำเร็จ:', error);
        setUserRole(null);
      }
    };
    fetchUserRole();
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/10 backdrop-blur-xl  shadow-[0_2px_15px_rgba(0,0,0,0.3)]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 text-base md:text-2xl font-bold text-white gap-x-1">
            <span className="text-red-600 text-3xl md:text-4xl">
              <RiMovie2AiLine />
            </span>
            <span className="tracking-wide">MOVIX</span>
          </div>

          {/* Menu: แสดงเมนูตาม role ของ user */}
          <div className="hidden md:flex items-center space-x-8  font-medium">
            {/* ถ้า userRole เป็น Admin ให้ใช้ NavbarmenuAdmin, ถ้าไม่ใช่หรือไม่มี role ให้ใช้ Navbarmenu */}
            {(userRole === 'Admin' ? NavbarmenuAdmin : Navbarmenu).map(
              (item) => (
                <a
                  key={item.id}
                  href={item.link}
                  className="text-white hover:text-gray-700 transition-colors duration-200"
                >
                  {item.title}
                </a>
              )
            )}
          </div>
          {/* Search Bar */}
          <div className="hidden lg:flex items-center relative lg:justify-end">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#d4af37] text-lg" />
            <input
              type="text"
              placeholder="Search movies..."
              className="pl-10 pr-4 py-1.5 rounded-full border border-[#d4af37]/60 bg-black/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d4af37] w-48 lg:w-60 transition-all duration-200 "
            />
            {/* Profile Icon */}
            <div className="ml-3">
              <UserMenu />
            </div>
          </div>

          {/* ปุ่มกด Mobile */}
          <div className="lg:hidden flex gap-3">
            <UserMenu />
            <div className="md:hidden" onClick={() => setopen(!open)}>
              <IoMdMenu className="text-3xl " />
            </div>
          </div>
        </div>
      </nav>
      {/* menu mobile */}
      <Responsive open={open} />
    </>
  );
}

export default Navbar;
