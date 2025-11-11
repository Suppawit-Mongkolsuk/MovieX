import { useState } from 'react';

interface FilterStatusProps {
  onFilterChange: (status: string) => void; //  callback ส่งค่ากลับ
}

export default function FilterStatus({ onFilterChange }: FilterStatusProps) {
  const [selected, setSelected] = useState('ทั้งหมด');

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelected(value);
    onFilterChange(value);
  };

  return (
    <div className="flex items-center gap-3 text-white">
      <select
        id="status-filter"
        value={selected}
        onChange={handleChange}
        className="bg-white/10 backdrop-blur-md border border-white/20
               text-white font-medium rounded-xl px-4 py-2 text-sm
               shadow-[0_4px_20px_rgba(255,255,255,0.1)]
               focus:outline-none focus:ring-2 focus:ring-white/40
               hover:bg-white/20 transition-all duration-300 cursor-pointer"
      >
        <option value="All" className="bg-black text-white">
          ทั้งหมด
        </option>
        <option value="Now Showing" className="bg-black text-white">
          กำลังฉาย
        </option>
        <option value="Ended" className="bg-black text-white">
          ออกโรง
        </option>
        <option value="Coming Soon" className="bg-black text-white">
          เร็วๆ นี้
        </option>
      </select>
    </div>
  );
}
