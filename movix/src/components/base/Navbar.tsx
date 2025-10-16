import React from 'react';
import { Navbarmenu } from '../../data/Navbar';
import { RiMovie2AiLine } from "react-icons/ri";
import { FaSearch } from "react-icons/fa";
import { IoMdMenu } from "react-icons/io";
import Responsive from './responsive_navbar';

function Navbar() {
  const [open, setopen] = React.useState(false);

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

        {/* Menu */}
        <div className="hidden md:flex items-center space-x-8  font-medium">
          {Navbarmenu.map((item) => (
            <a
              key={item.id}
              href={item.link}
              className="text-white hover:text-gray-700 transition-colors duration-200"
            >
              {item.title}
            </a>
          ))}
        </div>
        {/* Search Bar */}
        <div className="hidden md:flex items-center relative lg:justify-end">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#d4af37] text-lg" />
          <input
            type="text"
            placeholder="Search movies..."
            className="pl-10 pr-4 py-1.5 rounded-full border border-[#d4af37]/60 bg-black/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d4af37] w-48 lg:w-60 transition-all duration-200 "
          />
          {/* Profile Icon */}
          <button
            className="w-10 h-10 rounded-full border border-[#d4af37]/60 bg-white/10 flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-[#d4af37] transition-all duration-200 ml-2"
            aria-label="Profile"
          >  
          <img
              src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
            />
          </button>
        </div>

        {/* ปุ่มกด Mobile */}
        <div className='md:hidden' onClick={() => setopen(!open)}>
          <IoMdMenu className='text-3xl'/>
        </div>
      </div>
    </nav>
    {/* menu mobile */}
    <Responsive open = {open}/>
  </>
  );
}

export default Navbar;