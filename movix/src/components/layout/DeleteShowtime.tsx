import axios from 'axios';
import * as Dialog from '@radix-ui/react-dialog';
import Button from '../../components/base/Button';
import { toast } from 'react-toastify';

interface Props {
  movieID: string;
  locationId: string;
  theaterId?: string;
  onSuccess: () => void;
}

interface Showtime {
  id: string;
  movieID: string;
  locationId: string;
  theaterId: string;
  date: string;
  enddate: string;
  times: string[];
}
// ปุ่มลบรอบหนัง
export default function DeleteShowtimeButton({
  movieID,
  locationId,
  theaterId,
  onSuccess,
}: Props) {
  const handleDelete = async () => {
    // ถ้าไม่มี theaterId ให้หยุดและแจ้งเตือน
    if (!theaterId) {
      toast.error('ไม่พบรหัสโรงภาพยนตร์สำหรับลบรอบหนัง');
      return;
    }
    // แสดง Toast โหลด
    const loadingId = toast.loading('กำลังลบข้อมูลรอบหนัง...');

    try {
      // โหลดรายการทั้งหมด
      const res = await axios.get(
        `https://68f0fcef0b966ad50034f883.mockapi.io/Showtime`
      );
      const all = res.data.filter(
        (st: Showtime) =>
          st.movieID === movieID &&
          st.locationId === locationId &&
          st.theaterId === theaterId
      );

      // ลบทั้งหมด
      for (const item of all) {
        await axios.delete(
          `https://68f0fcef0b966ad50034f883.mockapi.io/Showtime/${item.id}`
        );
      }

      // เช็คว่าโรงนี้ยังมีรอบอื่นอีกไหม
      const refreshed = await axios.get(
        `https://68f0fcef0b966ad50034f883.mockapi.io/Showtime`
      );
      const stillUsed = refreshed.data.some(
        (st: Showtime) => st.theaterId === theaterId
      );

      // ถ้าไม่มีแล้ว → reset เป็น active
      if (!stillUsed) {
        await axios.put(
          `https://68f0fcef0b966ad50034f883.mockapi.io/Theater/${theaterId}`,
          { status: 'active' }
        );
      }

      toast.dismiss(loadingId);
      toast.success('ลบรอบหนังสำเร็จ!');
      onSuccess();
    } catch (err) {
      console.error('Delete failed:', err);
      toast.dismiss(loadingId);
      toast.error('ลบไม่สำเร็จ!');
    }
  };
  // UI ปุ่มลบพร้อมกล่องยืนยัน
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant="danger" size="md">
          ลบ
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
          bg-black/80 border border-red-500/50 text-white p-6 rounded-xl shadow-xl w-[90%] max-w-sm"
        >
          <h3 className="text-xl font-bold mb-4 text-red-400">ลบรอบหนัง?</h3>
          <p className="text-white/70 mb-5">คุณแน่ใจว่าต้องการลบรายการนี้?</p>

          <div className="flex justify-end gap-3">
            <Dialog.Close asChild>
              <Button variant="danger" size="md">
                ยกเลิก
              </Button>
            </Dialog.Close>

            <Button onClick={handleDelete} variant="primary" size="md">
              ตกลง
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
