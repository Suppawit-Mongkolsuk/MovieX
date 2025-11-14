import axios from 'axios';
import * as Dialog from '@radix-ui/react-dialog';
import Button from '../../components/base/Button';
import { toast } from 'react-hot-toast';

interface Props {
  id: string;
  theaterId: string;
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

export default function DeleteShowtimeButton({
  id,
  theaterId,
  onSuccess,
}: Props) {
  const handleDelete = async () => {
    try {
      // ลบรายการ
      await axios.delete(
        `https://68f0fcef0b966ad50034f883.mockapi.io/Showtime/${id}`
      );

      // เช็คว่าโรงนี้ยังมีรอบอื่นอีกไหม
      const res = await axios.get(
        `https://68f0fcef0b966ad50034f883.mockapi.io/Showtime`
      );

      const stillUsed = res.data.some(
        (st: Showtime) => st.theaterId === theaterId
      );

      // ถ้าไม่มีแล้ว → reset เป็น active
      if (!stillUsed) {
        await axios.put(
          `https://68f0fcef0b966ad50034f883.mockapi.io/Theater/${theaterId}`,
          { status: 'active' }
        );
      }

      toast.success('ลบรอบหนังสำเร็จ');
      onSuccess();
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error('ลบไม่สำเร็จ!');
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button className="bg-red-500 text-white px-3 py-1">ลบ</Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-[90%] max-w-sm bg-white/10 text-white border border-white/20 p-5 rounded-xl -translate-x-1/2 -translate-y-1/2">
          <h3 className="text-xl font-bold mb-4 text-red-400">ลบรอบหนัง?</h3>
          <p className="text-white/70 mb-5">คุณแน่ใจว่าต้องการลบรายการนี้?</p>

          <div className="flex justify-end gap-3">
            <Dialog.Close asChild>
              <Button className="bg-gray-500 text-white px-4 py-2">
                ยกเลิก
              </Button>
            </Dialog.Close>

            <Button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2"
            >
              ลบเลย
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
