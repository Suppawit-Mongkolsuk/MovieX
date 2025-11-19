import { motion, AnimatePresence } from 'framer-motion';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Navbarmenu } from '../../data/Navbar';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { NavbarmenuAdmin } from '../../data/Navbar';
import { NavLink } from 'react-router-dom';
import type { User } from '../../api/typeuser';
// เมนูสำหรับมือถือ/จอเล็ก เปิดปิดด้วยแอนิเมชัน และตรวจ role เพื่อโชว์เมนู admin เมื่อจำเป็น
interface ResponsiveProps {
  open: boolean;
}

const Responsive: React.FC<ResponsiveProps> = ({ open }) => {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const Role = await axios.get(
          'https://68f0fcef0b966ad50034f883.mockapi.io/Login'
        );
        // หา user ที่ล็อกอินอยู่ เพื่อดูว่าเป็น Admin หรือไม่
        const loggedInUser = (Role.data as User[]).find(
          (user) => user.isLogin === true
        );
        setUserRole(loggedInUser ? loggedInUser.role : null);
      } catch (error) {
        console.log('โหลดข้อมูลผู้ใช้ไม่สำเร็จ:', error);
        setUserRole(null);
      }
    };
    fetchUserRole();
  }, []);

  return (
    <DropdownMenu.Root modal={false}>
      <AnimatePresence mode="wait">
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="fixed top-16 left-0 w-full h-screen z-20"
          >
            <div className="uppercase bg-black/50 py-10 m-4 rounded-3xl flex flex-col items-center gap-10 md:hidden">
              {/* เช็ค role เพื่อแสดงเมนู */}
              {(userRole === 'Admin' ? NavbarmenuAdmin : Navbarmenu).map(
                (item) => (
                  <NavLink
                    key={item.id}
                    to={item.link}
                    className="text-white text-xl font-semibold"
                  >
                    {item.title}
                  </NavLink>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </DropdownMenu.Root>
  );
};

export default Responsive;
