import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Button from '../base/Button';
import UploadImage from '../base/UploadImage';
import type { Movie } from '../../api/typeMovie';

interface EditMovieProps {
  movie: Movie;
  onUpdated: () => void; // ฟังก์ชัน callback เวลาแก้ไขเสร็จ
}

export default function EditMovie({ movie, onUpdated }: EditMovieProps) {
  const [open, setOpen] = useState(false);
  const [editedMovie, setEditedMovie] = useState(movie);

  // บันทึกข้อมลู
  const handleSave = async () => {
    try {
      console.log('🚀 เริ่มบันทึก:', editedMovie);
      // ตรวจสอบว่ากรอกข้อมูลครบไหม(เอา4พอขก.พิม)
      if (
        !editedMovie.title ||
        !editedMovie.trailer ||
        !editedMovie.date ||
        !editedMovie.endDate
      ) {
        console.log('❌ ข้อมูลไม่ครบ:', editedMovie);
        toast.error('กรุณากรอกข้อมูลให้ครบ');
        return;
      }
      await axios.put(
        `https://68f0fcef0b966ad50034f883.mockapi.io/movies/${movie.id}`,
        editedMovie
      );
      onUpdated();
      toast.success('แก้ไขข้อมูลหนังเรียบร้อยแล้ว');
      setOpen(false);
    } catch (error) {
      toast.error('แก้ไขไม่สำเร็จ');
      console.error(error);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button size="md" variant="secondary">
          เเก้ไข
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl shadow-xl p-6 pb-8 space-y-4 focus:outline-none">
          <Dialog.Title className="hidden md:block  text-xl font-bold text-center">
            แก้ไขข้อมูลภาพยนตร์
          </Dialog.Title>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="space-y-3 mr-4 md:mr-0 md:flex-1">
              {/* ชื่อเรื่อง */}
              <input
                type="text"
                placeholder="ชื่อภาพยนตร์"
                value={editedMovie.title}
                onChange={(e) =>
                  setEditedMovie({ ...editedMovie, title: e.target.value })
                }
                className="w-full bg-white/10 border border-gray-500 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-movix-gold"
              />
              {/* ตัวอย่าง */}
              <input
                type="text"
                placeholder="ลิ้งตัวอย่าง"
                value={editedMovie.trailer}
                onChange={(e) =>
                  setEditedMovie({ ...editedMovie, trailer: e.target.value })
                }
                className="w-full bg-white/10 border border-gray-500 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-movix-gold"
              />
              {/* หมวดหมู่ */}
              <input
                type="text"
                placeholder="หมวดหมู่ (เช่น Action)"
                value={editedMovie.genre}
                onChange={(e) =>
                  setEditedMovie({ ...editedMovie, genre: e.target.value })
                }
                className="w-full bg-white/10 border border-gray-500 rounded-md px-3 py-2 text-sm text-white"
              />
              {/* ระยะเวลา */}
              <input
                type="number"
                placeholder="ระยะเวลา(นาที)"
                value={editedMovie.time}
                onChange={(e) =>
                  setEditedMovie({ ...editedMovie, time: e.target.value })
                }
                className="w-full bg-white/10 border border-gray-500 rounded-md px-3 py-2 text-sm text-white"
              />
              {/* วันที่เริ่ม */}
              <input
                type="date"
                placeholder="วันที่เริ่มฉาย"
                value={editedMovie.date}
                onChange={(e) =>
                  setEditedMovie({ ...editedMovie, date: e.target.value })
                }
                className="w-full bg-white/10 border border-gray-500 rounded-md px-3 py-2 text-sm text-white"
              />
              {/* วันที่สิ้นสุด */}
              <input
                type="date"
                placeholder="วันที่สิ้นสุด"
                value={editedMovie.endDate}
                onChange={(e) =>
                  setEditedMovie({ ...editedMovie, endDate: e.target.value })
                }
                className="w-full bg-white/10 border border-gray-500 rounded-md px-3 py-2 text-sm text-white"
              />
              {/* สถานะ */}
              <select
                value={editedMovie.status}
                onChange={(e) =>
                  setEditedMovie({ ...editedMovie, status: e.target.value })
                }
                className="w-full bg-white/10 border border-gray-500 rounded-md px-3 py-2 text-sm text-white"
              >
                <option value="Now Showing">Now Showing</option>
                <option value="Coming Soon">Coming Soon</option>
                <option value="Ended">Ended</option>
              </select>
            </div>
            <div className="md:w-[260px] w-full flex flex-col items-center md:items-center">
              {/* 📸 Upload poster (เชื่อมกับ UploadImage) */}
              <UploadImage
                label="อัปโหลดโปสเตอร์ใหม่ (ถ้ามี)"
                onUpload={(url) =>
                  setEditedMovie({ ...editedMovie, poster: url })
                }
                auto={true}
                showActions={false}
              />
            </div>
          </div>
          <div className="flex justify-center gap-3 pt-4">
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                handleSave();
              }}
            >
              ยืนยัน
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
