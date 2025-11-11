import { useEffect, useState } from 'react';
import axios from 'axios';
import { NavbarAdmin } from '../../components/base/NavbarAdmin';
import { SearchBar } from '../../components/layout/SearchBar';
import { BaseSelectRole } from '../../components/layout/SelectRole';
import { BaseTable } from '../../components/base/Table';
import { ConfirmRoleDialog } from '../../components/layout/DialogConfirm';

interface User {
  id: string;
  name_user: string;
  gmail: string;
  phone: string;
  role: string;
  avatar: string;
  isLogin: boolean;
}

const ManageHome = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  // state สำหรับ popup
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingRole, setPendingRole] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // ดึงข้อมูลผู้ใช้จาก MockAPI
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          'https://68f0fcef0b966ad50034f883.mockapi.io/Login'
        );
        setUsers(res.data);
        setFilteredUsers(res.data);
      } catch (error) {
        console.error('โหลดข้อมูลผู้ใช้ไม่สำเร็จ:', error);
      }
    };
    fetchUsers();
  }, []);

  //  ฟังก์ชันเปิด popup
  const handleSelectRole = (user: User, newRole: string) => {
    setPendingRole(newRole);
    setSelectedUser(user);
    setConfirmOpen(true);
  };

  // ยืนยันเปลี่ยน role
  const handleConfirm = async () => {
    if (!selectedUser) return;
    await handleRoleChange(selectedUser.id, pendingRole);
    setConfirmOpen(false);
    setSelectedUser(null);
    setPendingRole('');
  };

  // ยกเลิก
  const handleCancel = () => {
    setConfirmOpen(false);
    setSelectedUser(null);
    setPendingRole('');
  };

  // ค้นหาผู้ใช้จากอีเมล ชื่อ หรือเบอร์โทร
  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredUsers(users);
      return;
    }
    const lowerQuery = query.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.gmail.toLowerCase().includes(lowerQuery) ||
        user.name_user.toLowerCase().includes(lowerQuery) ||
        user.phone.toLowerCase().includes(lowerQuery)
    );

    setFilteredUsers(filtered);
  };

  // ฟังก์ชันเปลี่ยน role ของ user (PUT ไปที่ MockAPI)
  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      await axios.put(
        `https://68f0fcef0b966ad50034f883.mockapi.io/Login/${id}`,
        { role: newRole }
      );
      setUsers((prev) =>
        prev.map((user) => (user.id === id ? { ...user, role: newRole } : user))
      );
      setFilteredUsers((prev) =>
        prev.map((user) => (user.id === id ? { ...user, role: newRole } : user))
      );
      console.log(`เปลี่ยน role ของ ${id} เป็น ${newRole}`);
    } catch (error) {
      console.error('อัปเดต role ไม่สำเร็จ:', error);
    }
  };

  return (
    <div className="pt-16 min-h-screen">
      <NavbarAdmin />

      {/* ตารางข้อมูลผู้ใช้ */}
      <div className="px-2 sm:px-4 md:px-12 mt-6 md:mt-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 md:mb-8">
          <h1 className="text-lg text-center sm:text-xl md:text-2xl font-bold ">
            📋 รายชื่อผู้ใช้ทั้งหมด
          </h1>
          <div className="w-full md:w-auto flex justify-center md:justify-end">
            <SearchBar placeholder="ค้นหารายชื่อ..." onSearch={handleSearch} />
          </div>
        </div>

        {/* ตาราง scroll  */}
        <div className="overflow-x-auto overflow-y-hidden rounded-lg shadow-md border border-white/10 backdrop-blur-sm">
          <div className="min-w-[700px] sm:min-w-full">
            <BaseTable
              columns={[
                'Avatar',
                'ชื่อผู้ใช้',
                'อีเมล',
                'เบอร์โทร',
                'Role',
                'สถานะล็อกอิน',
              ]}
              data={filteredUsers}
              renderRow={(user) => (
                <tr
                  key={user.id}
                  className="border-t border-gray-700 hover:bg-white/5 transition text-[11px] sm:text-sm md:text-base text-left"
                >
                  <td className="p-2 sm:p-3 md:p-4 text-left">
                    <img
                      src={user.avatar}
                      alt={user.name_user}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="p-2 sm:p-3 text-left">{user.name_user}</td>
                  <td className="p-2 sm:p-3 break-all text-left">
                    {user.gmail}
                  </td>
                  <td className="p-2 sm:p-3 text-left">{user.phone}</td>
                  <td className="p-2 sm:p-3 text-left">
                    <BaseSelectRole
                      value={user.role}
                      onChange={(newRole) => handleSelectRole(user, newRole)}
                    />
                  </td>
                  <td className="p-2 sm:p-3 text-left">
                    {user.isLogin ? (
                      <span className="text-green-500 font-semibold">
                        ออนไลน์
                      </span>
                    ) : (
                      <span className="text-gray-400">ออฟไลน์</span>
                    )}
                  </td>
                </tr>
              )}
            />
          </div>
        </div>
      </div>

      {/* Popup ยืนยันการเปลี่ยน Role */}
      <ConfirmRoleDialog
        open={confirmOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        newRole={pendingRole}
        userName={selectedUser?.name_user || ''}
      />
    </div>
  );
};

export default ManageHome;
