import * as Dialog from '@radix-ui/react-dialog';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useState } from 'react';
import Button from '../base/Button';

export default function DeleteTheaterButton({
  theaterId,
  locationId,
  onSuccess,
}: {
  theaterId: string;
  locationId: string;
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false); // toggle dialog ยืนยันลบ

  const handleDelete = async () => {
    toast.loading('กำลังลบโรง...');
    try {
      // โหลด seats ทั้งหมดของโรง
      const res = await axios.get(
        `https://68f0fcef0b966ad50034f883.mockapi.io/Theater/${theaterId}/theaterSeats/`
      );

      // ลบ seat records ทีละอัน
      for (const seat of res.data) {
        await axios.delete(
          `https://68f0fcef0b966ad50034f883.mockapi.io/locations/${locationId}/Theater/${theaterId}/theaterSeats/${seat.id}`
        );
      }

      // ลบโรงภาพยนตร์
      await axios.delete(
        `https://68f0fcef0b966ad50034f883.mockapi.io/locations/${locationId}/Theater/${theaterId}`
      );

      toast.dismiss();
      toast.success('ลบโรงสำเร็จ');
      onSuccess(); // แจ้ง parent ให้ refresh list
    } catch (e) {
      console.error(e);
      toast.error('ลบโรงไม่สำเร็จ');
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="danger" size="md">
          ลบ
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-white/10 text-white p-6 rounded-xl border border-white/20 shadow-lg">
          <Dialog.Title className="text-lg font-bold mb-4">
            ยืนยันการลบโรงนี้?
          </Dialog.Title>

          <p className="text-white/80 mb-6">
            คุณต้องการลบโรงภาพยนตร์นี้จริงๆ หรือไม่?
          </p>

          <div className="flex justify-end gap-2">
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
