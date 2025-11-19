import { useState } from 'react';
import * as Dropdown from '@radix-ui/react-dropdown-menu';
import { Check } from 'lucide-react';

interface FilterDropdownProps {
  label?: string;
  items: Array<string | { label: string; value: string }>;
  value: string;
  onChange: (v: string) => void;
}

export default function FilterDropdown({
  items,
  value,
  onChange,
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false); // state สำหรับเปิดปิดเมนู

  return (
    <Dropdown.Root open={open} onOpenChange={setOpen}>
      <Dropdown.Trigger asChild>
        <button
          className="
          bg-white/10 border border-white/20 px-4 py-2 rounded-lg 
          text-white flex items-center gap-2 hover:bg-white/20
        "
        >
          <span>{value}</span>
          <span className="opacity-70 text-sm">▼</span>
        </button>
      </Dropdown.Trigger>

      <Dropdown.Portal>
        <Dropdown.Content
          className="
            bg-black/60 backdrop-blur-xl text-white rounded-lg p-2 
            border border-white/20 shadow-lg
          "
          sideOffset={6}
        >
          {items.map((item) => {
            const isObj = typeof item === 'object';
            const label = isObj ? item.label : item;
            const valueItem = isObj ? item.value : item;
            return (
              <Dropdown.Item
                key={valueItem}
                onSelect={() => onChange(valueItem)}
                className="px-4 py-2 rounded-md hover:bg-white/20 cursor-pointer flex items-center gap-2"
              >
                {value === valueItem && <Check size={18} />}{' '}
                {/* โชว์ icon เมื่อเป็นตัวที่ถูกเลือกอยู่ */}
                <span>{label}</span>
              </Dropdown.Item>
            );
          })}
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  );
}
