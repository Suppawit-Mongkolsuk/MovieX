import { useState } from 'react';
import { RiMovie2AiLine } from 'react-icons/ri';
import { Admin } from '../../data/Navbar';
import { IoMdMenu } from 'react-icons/io';
import ResponsiveAdmin from './responsive_navbarAdmin';
import { NavLink } from 'react-router-dom';

export function NavbarAdmin() {
  // state สำหรับเปิด/ปิดเมนู mobile
  const [open, setopen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/10 backdrop-blur-xl shadow-[0_2px_15px_rgba(0,0,0,0.3)]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex  items-center">
          {/* Logo */}
          <div className="flex items-center gap-2 text-base md:text-2xl font-bold text-white">
            <span className="text-red-600 text-3xl md:text-4xl">
              <RiMovie2AiLine />
            </span>
            <span className="tracking-wide">ADMIN</span>
          </div>

          {/* Menu */}
          <div className="hidden md:flex items-center justify-center mx-auto space-x-8 font-medium">
            {Admin.map((item) => (
              <NavLink
                key={item.id}
                to={item.link}
                className="text-white hover:text-gray-700 transition-colors duration-200"
              >
                {item.title}
              </NavLink>
            ))}
          </div>
          <div className="flex gap-3 ml-auto">
            <div
              className="md:hidden flex justify-end gap-3"
              onClick={() => setopen(!open)}
            >
              <IoMdMenu className="text-3xl" />
            </div>
          </div>
        </div>
      </nav>
      {/* menu mobile */}
      <ResponsiveAdmin open={open} />
    </>
  );
}
