import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Dialog from '@radix-ui/react-dialog';
import type { User } from '../../api/typeuser';
import UploadImage from './UploadImage';

export default function UserMenu() {
  const [user, setUser] = useState<User | null>(null); // เก็บข้อมูล user ปัจจุบัน
  const [openDialog, setOpenDialog] = useState(false); // เปิด/ปิด modal

  // 🚀 ดึงข้อมูล user จาก MockAPI
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          'https://68f0fcef0b966ad50034f883.mockapi.io/Login'
        );
        const loggedInUser = (res.data as User[]).find(
          (u) => u.isLogin === true
        );
        setUser(loggedInUser || null);
      } catch (error) {
        console.error('โหลดข้อมูลผู้ใช้ไม่สำเร็จ:', error);
      }
    };
    fetchUser();
  }, []);

  // ออกจากระบบ
  const handleLogout = async () => {
    if (!user) return;
    await axios.put(
      `https://68f0fcef0b966ad50034f883.mockapi.io/Login/${user.id}`,
      {
        isLogin: false,
      }
    );
    setUser(null);
    // reload
    window.location.reload();
  };
  // อัปโหลดรูปภาพใหม่
  const handleUploaded = async (url: string) => {
    if (!user) return;
    try {
      await axios.put(
        `https://68f0fcef0b966ad50034f883.mockapi.io/Login/${user.id}`,
        { avatar: url }
      );
      setUser({ ...user, avatar: url });
      setOpenDialog(false);
    } catch (error) {
      console.error('อัปเดตรูปโปรไฟล์ไม่สำเร็จ:', error);
    }
  };

  return (
    <div>
      <DropdownMenu.Root>
        {/* ปุ่มโปรไฟล์ */}
        <DropdownMenu.Trigger asChild>
          <img
            src={
              user?.avatar ||
              'https://cdn-icons-png.flaticon.com/512/847/847969.png'
            }
            alt="profile"
            className="w-8 h-8  md:w-10 md:h-10 rounded-full border-2 border-white/50 cursor-pointer"
            onFocusCapture={(e) => e.stopPropagation()}
          />
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <div>
            <DropdownMenu.Content
              className="mt-3 min-w-[200px] bg-black/90 text-white rounded-lg border border-movix-gold p-1 shadow-lg"
              sideOffset={8}
            >
              {user ? (
                <>
                  <p className="px-3 py-2 text-sm">Role - {user.role}</p>
                  {/* เปิด modal สำหรับอัปโหลดรูป */}
                  <DropdownMenu.Item
                    onSelect={() => setOpenDialog(true)}
                    className="px-3 py-2 text-sm hover:bg-movix-gold/10 rounded-md cursor-pointer"
                  >
                    เพิ่มรูปโปรไฟล์
                  </DropdownMenu.Item>

                  <DropdownMenu.Item
                    onSelect={handleLogout}
                    className="px-3 py-2 text-sm text-red-400 hover:bg-red-600/20 rounded-md cursor-pointer"
                  >
                    ออกจากระบบ
                  </DropdownMenu.Item>
                </>
              ) : (
                <Link
                  to="/login"
                  className="block text-center px-3 py-2 hover:bg-movix-gold/10 rounded-md"
                >
                  เข้าสู่ระบบ
                </Link>
              )}
            </DropdownMenu.Content>
          </div>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      {/* 📦 Dialog ของ Radix (modal อัปโหลดรูป) */}
      <Dialog.Root open={openDialog} onOpenChange={setOpenDialog}>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-black/70 backdrop-blur-sm fixed inset-0" />
          <Dialog.Content
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
            w-[90%] max-w-sm bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl shadow-xl p-6"
          >
            <UploadImage
              label="อัปโหลดรูปโปรไฟล์"
              onUpload={handleUploaded}
              auto={false}
              showActions={true}
            />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
