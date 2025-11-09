import * as Select from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';

interface BaseSelectRoleProps {
  value?: string;
  onChange: (newValue: string) => void;
}

export const BaseSelectRole = ({
  value = 'user', // ตั้งค่าเริ่มต้นเป็น User
  onChange,
}: BaseSelectRoleProps) => {
  return (
    <Select.Root value={value} onValueChange={onChange} defaultValue="User">
      {/* ปุ่มกด dropdown */}
      <Select.Trigger
        className="inline-flex items-center justify-between px-3 py-1 
                   border border-gray-600 rounded-lg shadow-sm text-sm 
                   bg-transparent text-white hover:bg-white/10 
                   transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-movix-gold"
        aria-label="Role"
      >
        {/* แสดงค่าที่เลือก */}
        <Select.Value placeholder="user" />
        <Select.Icon>
          <ChevronDown size={16} className="text-movix-gold ml-2" />
        </Select.Icon>
      </Select.Trigger>

      {/* Dropdown */}
      <Select.Content
        className="bg-[#1f1f1f] text-white rounded-lg shadow-lg border border-gray-700 mt-2 overflow-hidden"
        position="popper"
      >
        <Select.Viewport>
          {/* User */}
          <Select.Item
            value="user" // ✅ ตรงกับ placeholder
            className="cursor-pointer px-3 py-2 hover:bg-movix-gold/20 flex items-center justify-between"
          >
            <Select.ItemText>Users</Select.ItemText>
            {value === 'User' && <Check size={16} className="text-green-400" />}
          </Select.Item>

          {/* Admin */}
          <Select.Item
            value="Admin"
            className="cursor-pointer px-3 py-2 hover:bg-red-600/40 flex items-center justify-between"
          >
            <Select.ItemText>Admin</Select.ItemText>
            {value === 'Admin' && <Check size={16} className="text-red-400" />}
          </Select.Item>
        </Select.Viewport>
      </Select.Content>
    </Select.Root>
  );
};
