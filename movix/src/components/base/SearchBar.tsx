import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export const SearchBar = ({ placeholder, onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    // เมื่อพิมพ์แล้วส่งค่ากลับไปให้หน้าหลัก
    if (onSearch) {
      onSearch(e.target.value);
    }
  };
  return (
    <div className="relative">
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />

      <input
        type="text"
        value={query}
        placeholder={placeholder}
        onChange={handleChange}
        className="pl-9 pr-4 py-1.5 rounded-full bg-black/40 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-500 w-48 lg:w-60 transition-all duration-200"
      />
    </div>
  );
};
