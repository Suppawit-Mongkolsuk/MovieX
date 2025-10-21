import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import { AnimatePresence, motion } from "framer-motion";

const App: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><LoginForm /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper><RegisterForm /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

  const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -50 }}
    transition={{ duration: 0.6, ease: "easeInOut" }}
    className="min-h-screen w-full"
  >
    {children}
  </motion.div>
);
export default App;