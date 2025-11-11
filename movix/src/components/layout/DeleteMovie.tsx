import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Button from '../base/Button';

interface DeleteMovieProps {
  movieId: string; // ID ของหนังที่จะลบ
  title: string; //  ชื่อหนัง (ไว้แสดงตอนถามยืนยัน)
  onDeleted: () => void; //  ฟังก์ชันรีโหลดข้อมูลหลังลบสำเร็จ
}

export default function DeleteMovie({
  movieId,
  title,
  onDeleted,
}: DeleteMovieProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  //  ฟังก์ชันลบข้อมูลหนัง
  const handleDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `https://68f0fcef0b966ad50034f883.mockapi.io/movies/${movieId}`
      );
      toast.success(`ลบ "${title}" สำเร็จ!`);
      setOpen(false);
      onDeleted(); // 🔁 เรียกฟังก์ชัน refresh ข้อมูล
    } catch (error) {
      console.error('❌ ลบไม่สำเร็จ:', error);
      toast.error('ลบข้อมูลหนังไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {/* ปุ่มเปิด Dialog */}
      <Dialog.Trigger asChild>
        <Button variant="danger" size="md">
          ลบ
        </Button>
      </Dialog.Trigger>

      {/* กล่องยืนยันการลบ */}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
          bg-black/80 border border-red-500/50 text-white p-6 rounded-xl shadow-xl w-[90%] max-w-sm"
        >
          <Dialog.Title className="text-lg font-semibold mb-3 text-center text-red-400">
            ⚠️ ยืนยันการลบภาพยนตร์
          </Dialog.Title>

          <p className="text-center mb-6 text-sm text-gray-300">
            แน่ใจหรือไม่ว่าต้องการลบ{' '}
            <span className="font-bold text-white">{title}</span> ?
          </p>

          <div className="flex justify-center gap-3">
            <Dialog.Close asChild>
              <Button variant="secondary" size="sm">
                ยกเลิก
              </Button>
            </Dialog.Close>

            <Button
              onClick={handleDelete}
              disabled={loading}
              variant="danger"
              size="sm"
              className="disabled:opacity-50"
            >
              {loading ? 'กำลังลบ...' : 'ยืนยันลบ'}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
