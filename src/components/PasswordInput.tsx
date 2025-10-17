import React, { useState } from "react";

interface PasswordInputProps {
    id?: string;
    name?: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
    id = "password",
    name = "password",
    placeholder = "กรอกรหัสผ่านของคุณ",
    value,
    onChange,
    className = "",
}) => {
    const [visible, setVisible] = useState(false);

  const toggle = () => setVisible((v) => !v);

  return (
    <div className={`relative w-full ${className}`}>
      <input
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 pr-12 rounded-md border border-gray-300 bg-white/30 backdrop-blur-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        aria-describedby={`${id}-toggle`}
      />

      <button
        id={`${id}-toggle`}
        type="button"
        onClick={toggle}
        aria-pressed={visible}
        aria-label={visible ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-300"
      >
        {visible ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M9.88 9.88A3 3 0 0114.12 14.12M9.88 9.88L3.5 3.5M20.5 12.5C19.271 15.042 16.77 17 12 17c-1.826 0-3.346-.37-4.5-.99" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default PasswordInput;