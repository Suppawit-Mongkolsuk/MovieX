import { useEffect, useState } from 'react';
import axios from 'axios';
import { NavbarAdmin } from '../../components/base/NavbarAdmin';
import { SearchBar } from '../../components/base/SearchBar';

// ✅ ปรับ interface ให้ตรงกับข้อมูลใน MockAPI
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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // 📦 ดึงข้อมูลจาก MockAPI จริงของเติ้ล
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

  // 🔍 ฟังก์ชันค้นหาจากชื่อผู้ใช้ (name_user)
  const handleSearch = (query: string) => {
    const filtered = users.filter((user) =>
      user.name_user.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  return (
    <div className="pt-16 min-h-screen">
      <NavbarAdmin />

      <div className="mt-12 mr-4 p-4 flex justify-end md:mr-12">
        <SearchBar placeholder="ค้นหารายชื่อ..." onSearch={handleSearch} />
      </div>

      <div className="mx-4 md:mx-12 mt-8">
        <h1 className="text-2xl font-bold mb-4">📋 รายชื่อผู้ใช้ทั้งหมด</h1>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-xl">
            <thead>
              <tr className="text-left bg-gray-100">
                <th className="p-3">Avatar</th>
                <th className="p-3">ชื่อผู้ใช้</th>
                <th className="p-3">อีเมล</th>
                <th className="p-3">เบอร์โทร</th>
                <th className="p-3">Role</th>
                <th className="p-3">สถานะล็อกอิน</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-t border-gray-200">
                  <td className="p-3">
                    <img
                      src={user.avatar}
                      alt={user.name_user}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="p-3">{user.name_user}</td>
                  <td className="p-3">{user.gmail}</td>
                  <td className="p-3">{user.phone}</td>
                  <td
                    className={`p-3 font-semibold ${
                      user.role === 'Admin' ? 'text-red-600' : 'text-gray-700'
                    }`}
                  >
                    {user.role}
                  </td>
                  <td className="p-3">
                    {user.isLogin ? '✅ เข้าระบบอยู่' : '❌ ออฟไลน์'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageHome;
