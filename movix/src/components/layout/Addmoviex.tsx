import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import axios from 'axios';
import Button from '../base/Button';
import UploadImage from '../base/UploadImage';
import { toast } from 'react-toastify';

export default function AddMovieDialog({ onAdded }: { onAdded: () => void }) {
  const [open, setOpen] = useState(false); //สำหรับเปิดปิด ppopup
  const [newMovie, setNewMovie] = useState({
    title: '',
    trailer: '',
    genre: '',
    time: '',
    date: '',
    endDate: '',
    status: 'Coming Soon', // ปรับค่า default status ให้ตรงกับตอนเริ่มต้น
    poster: '',
  }); // เก็บค่าหนัง

  // 📤 ฟังก์ชันบันทึกหนังใหม่ลง MockAPI
  const handleSave = async () => {
    try {
      console.log('🚀 เริ่มบันทึก:', newMovie);
      // ตรวจสอบว่ากรอกข้อมูลครบไหม
      if (!newMovie.title || !newMovie.poster || !newMovie.trailer) {
        console.log('❌ ข้อมูลไม่ครบ:', newMovie);
        toast.error('กรุณากรอกข้อมูลให้ครบ');
        return;
      }

      // เรียก axios.post() เพื่อส่งข้อมูลไป MockAPI
      console.log('📤 เตรียมส่งข้อมูล:', newMovie);
      await axios.post(
        'https://68f0fcef0b966ad50034f883.mockapi.io/movies',
        newMovie
      );
      toast.success('เพิ่มหนังใหม่สำเร็จ ✅');

      // เคลียร์ค่า form หลังเพิ่มเสร็จ
      setNewMovie({
        title: '',
        trailer: '',
        genre: '',
        time: '',
        date: '',
        endDate: '',
        status: 'Coming Soon', // ปรับค่า default status ให้ตรงกับตอนเริ่มต้น
        poster: '',
      });

      setOpen(false); // ปิด Dialog
      onAdded(); // เรียก refresh ข้อมูลในตารางหลัก
    } catch (error) {
      console.error('เพิ่มหนังไม่สำเร็จ:', error);
      toast.error('เพิ่มหนังไม่สำเร็จ ❌');
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="secondary" size="lg">
          + Add Movie
        </Button>
      </Dialog.Trigger>
      <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <Dialog.Portal>
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl shadow-xl p-6 pb-8 space-y-4 focus:outline-none">
          <Dialog.Title className="hidden md:block text-xl font-semibold text-center">
            🎬 เพิ่มภาพยนตร์ใหม่
          </Dialog.Title>

          {/* ปรับ layout ฟอร์มจาก flex gap-4 เป็น flex flex-col md:flex-row gap-8 เพื่อรองรับ responsive */}
          <div className="flex flex-col md:flex-row gap-8">
            <div className="space-y-3 mr-4 md:mr-0 md:flex-1">
              {/* ชื่อเรื่อง */}
              <input
                type="text"
                placeholder="ชื่อภาพยนตร์"
                value={newMovie.title}
                onChange={(e) =>
                  setNewMovie({ ...newMovie, title: e.target.value })
                }
                className="w-full bg-white/10 border border-gray-500 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-movix-gold"
              />
              {/* ตัวอย่าง */}
              <input
                type="text"
                placeholder="ลิ้งตัวอย่าง"
                value={newMovie.trailer}
                onChange={(e) =>
                  setNewMovie({ ...newMovie, trailer: e.target.value })
                }
                className="w-full bg-white/10 border border-gray-500 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-movix-gold"
              />
              {/* หมวดหมู่ */}
              <input
                type="text"
                placeholder="หมวดหมู่ (เช่น Action)"
                value={newMovie.genre}
                onChange={(e) =>
                  setNewMovie({ ...newMovie, genre: e.target.value })
                }
                className="w-full bg-white/10 border border-gray-500 rounded-md px-3 py-2 text-sm text-white"
              />
              {/* ระยะเวลา */}
              <input
                type="number"
                placeholder="ระยะเวลา(นาที)"
                value={newMovie.time}
                onChange={(e) =>
                  setNewMovie({ ...newMovie, time: e.target.value })
                }
                className="w-full bg-white/10 border border-gray-500 rounded-md px-3 py-2 text-sm text-white"
              />
              {/* วันที่เริ่ม */}
              <input
                type="date"
                placeholder="วันที่เริ่มฉาย"
                value={newMovie.date}
                onChange={(e) =>
                  setNewMovie({ ...newMovie, date: e.target.value })
                }
                className="w-full bg-white/10 border border-gray-500 rounded-md px-3 py-2 text-sm text-white"
              />
              {/* วันที่สิ้นสุด */}
              <input
                type="date"
                placeholder="วันที่สิ้นสุด"
                value={newMovie.endDate}
                onChange={(e) =>
                  setNewMovie({ ...newMovie, endDate: e.target.value })
                }
                className="w-full bg-white/10 border border-gray-500 rounded-md px-3 py-2 text-sm text-white"
              />
              {/* สถานะ */}
              <select
                value={newMovie.status}
                onChange={(e) =>
                  setNewMovie({ ...newMovie, status: e.target.value })
                }
                className="w-full bg-white/10 border border-gray-500 rounded-md px-3 py-2 text-sm text-white"
              >
                <option value="Now Showing">Now Showing</option>
                <option value="Coming Soon">Coming Soon</option>
              </select>
            </div>
            <div className="md:w-[260px] w-full flex flex-col items-center md:items-center">
              {/* 📸 Upload poster (เชื่อมกับ UploadImage) */}
              <UploadImage
                label="อัปโหลดโปสเตอร์ภาพยนตร์"
                auto={true}
                showActions={false}
                onUpload={(url: string) =>
                  setNewMovie({ ...newMovie, poster: url })
                }
              />
            </div>
          </div>
          <div className="flex justify-center gap-3 pt-4">
            <Button variant="primary" size="md" onClick={handleSave}>
              บันทึก
            </Button>
            <Dialog.Close asChild>
              <Button variant="danger" size="md">
                ยกเลิก
              </Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
