import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

interface SearchBarProps {
  placeholder?: string;
  onChange?: (value: string) => void;
}

export const SearchBar = ({
  placeholder = 'ค้นหา...',
  onChange,
}: SearchBarProps) => {
  return (
    <div className="relative">
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />

      <input
        type="text"
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        className="pl-9 pr-4 py-1.5 rounded-full bg-black/40 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-500 w-48 lg:w-60 transition-all duration-200"
      />
    </div>
  );
};
