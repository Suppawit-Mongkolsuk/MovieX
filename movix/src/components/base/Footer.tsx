import React from 'react';
import { motion } from 'framer-motion';
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaLine,
} from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-black/80 text-white py-8 flex flex-col items-center justify-center gap-6 border-t border-white/10 backdrop-blur-md shadow-inner">
      {/* Call Center */}
      <motion.h2
        className="text-lg font-semibold text-gray-200"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        📞 <span className="text-white">MovieX Call Center:</span>{' '}
        <span className="text-red-500 font-bold">1919</span>
      </motion.h2>

      {/* Social Icons */}
      <div className="flex space-x-6">
        {/* Facebook */}
        <motion.a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.2, color: '#1877F2' }}
          transition={{ duration: 0.3 }}
          className="hover:drop-shadow-[0_0_6px_#1877F2]"
        >
          <FaFacebook size={26} />
        </motion.a>

        {/* Twitter */}
        <motion.a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.2, color: '#1DA1F2' }}
          transition={{ duration: 0.3 }}
          className="hover:drop-shadow-[0_0_6px_#1DA1F2]"
        >
          <FaTwitter size={26} />
        </motion.a>

        {/* Instagram */}
        <motion.a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.2, color: '#E4405F' }}
          transition={{ duration: 0.3 }}
          className="hover:drop-shadow-[0_0_6px_#E4405F]"
        >
          <FaInstagram size={26} />
        </motion.a>

        {/* YouTube */}
        <motion.a
          href="https://youtube.com"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.2, color: '#FF0000' }}
          transition={{ duration: 0.3 }}
          className="hover:drop-shadow-[0_0_6px_#FF0000]"
        >
          <FaYoutube size={26} />
        </motion.a>

        {/* Line */}
        <motion.a
          href="https://line.me"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.2, color: '#00C300' }}
          transition={{ duration: 0.3 }}
          className="hover:drop-shadow-[0_0_6px_#00C300]"
        >
          <FaLine size={26} />
        </motion.a>
      </div>

      {/* Copyright */}
      <p className="text-xs text-gray-500 mt-4">
        © {new Date().getFullYear()} MovieX — All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
