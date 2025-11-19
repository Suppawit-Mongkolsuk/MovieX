import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

// props ทั้งหมดที่ component นี้รองรับ (เผื่อใช้ซ้ำ)
interface PasswordInputProps {
  id?: string;
  name?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  id = 'password',
  name = 'password',
  placeholder = 'Enter your password',
  value,
  onChange,
  className = '',
}) => {
  // visible เอาไว้สลับการโชว์/ซ่อนรหัสผ่าน
  const [visible, setVisible] = useState(false);
  const toggle = () => setVisible((v) => !v);

  return (
    <div className={`relative w-full ${className}`}>
      {/* ไอคอนรูปกุญแจอยู่ด้านซ้ายของ input */}
      <Lock
        className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70"
        size={18}
      />

      <input
        id={id}
        name={name}
        type={visible ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-10 py-2 bg-transparent border-b border-white/50 text-white placeholder-white/60 focus:outline-none focus:border-white/50 transition"
      />

      {/* ปุ่มด้านขวาใช้สลับการแสดงรหัสผ่าน พร้อมเปลี่ยน icon ตามสถานะ */}
      <button
        type="button"
        onClick={toggle}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
};

export default PasswordInput;
