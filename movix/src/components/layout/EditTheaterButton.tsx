import * as Dialog from '@radix-ui/react-dialog';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import Button from '../base/Button';

interface Theater {
  id: string;
  name: string;
  type: string;
  rows: number;
  cols: number;
  locationId: string;
}

interface Seat {
  TheaterId: string;
  seatRow: string;
  seatCol: string;
  seatNumber: string;
  seatType: string;
  seatPrice: number;
}

export default function EditTheaterButton({
  theater,
  onSuccess,
}: {
  theater: Theater;
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false); // คุม dialog แก้ไขโรง

  // โหลดค่าเริ่มต้นของโรง
  const [name, setName] = useState(theater.name);
  const [type, setType] = useState(theater.type);
  const [rows, setRows] = useState<number>(theater.rows);
  const [cols, setCols] = useState<number>(theater.cols);

  // ⭐ ราคาแถว (Row Price Mapping)
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const initialPrices: Record<string, number> = {};

  for (let r = 0; r < theater.rows; r++) {
    initialPrices[alphabet[r]] = 200; // default 200 ต่อแถว
  }

  const [rowPrices, setRowPrices] =
    useState<Record<string, number>>(initialPrices); // mapping ราคาแยกตามแถว

  // โหลดราคาเก้าอี้เดิมมาใช้ตั้งต้น (ถ้ามี)
  useEffect(() => {
    const loadSeatPrices = async () => {
      try {
        const res = await axios.get(
          `https://68f0fcef0b966ad50034f883.mockapi.io/theaterSeats/${theater.id}`
        );

        const seats: Seat[] = Array.isArray(res.data?.seat)
          ? res.data.seat
          : [];

        const priceMap: Record<string, number> = { ...rowPrices };

        seats.forEach((s: Seat) => {
          priceMap[s.seatRow] = s.seatPrice;
        });

        setRowPrices(priceMap);
      } catch {
        console.log('โหลดราคาไม่ได้ แต่ใช้ default แทน');
      }
    };

    loadSeatPrices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // บันทึกข้อมูล
  const handleEdit = async () => {
    toast.loading('กำลังแก้ไขโรง...'); // แจ้งสถานะทันทีระหว่างรอ API

    try {
      // 1) อัปเดตข้อมูลโรงหลัก (ชื่อ/ประเภท/rows/cols)
      await axios.put(
        `https://68f0fcef0b966ad50034f883.mockapi.io/Theater/${theater.id}`,
        {
          name: name.trim(),
          type: type.trim(),
          rows: Number(rows),
          cols: Number(cols),
          locationId: theater.locationId,
        }
      );

      // อัปเดตเก้าอี้ใหม่พร้อมราคา
      await regenerateSeats();

      toast.dismiss();
      toast.success('แก้ไขโรงสำเร็จ!');

      onSuccess();
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.dismiss();
      toast.error('แก้ไขโรงไม่สำเร็จ');
    }
  };

  // สร้างที่นั่งใหม่ตาม rows/cols + ราคาแถว
  const regenerateSeats = async (): Promise<void> => {
    const newSeats: Seat[] = [];
    // สร้างที่นั่งใหม่ทั้งหมด
    for (let r = 0; r < rows; r++) {
      const rowLabel = alphabet[r];
      const price = rowPrices[rowLabel] || 0;
      // สร้างที่นั่งในแถวนั้น
      for (let c = 1; c <= cols; c++) {
        newSeats.push({
          TheaterId: theater.id,
          seatRow: rowLabel,
          seatCol: String(c),
          seatNumber: `${rowLabel}${c}`,
          seatType: price > 220 ? 'VIP' : 'Standard',
          seatPrice: price,
        });
      }
    }
    // อัปเดตที่นั่งทั้งหมดใน MockAPI
    await axios.put(
      `https://68f0fcef0b966ad50034f883.mockapi.io/theaterSeats/${theater.id}`,
      { seat: newSeats as Seat[] }
    );
  };
  // UI ปุ่ม + dialog แก้ไข
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="secondary" size="md">
          แก้ไข
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

        <Dialog.Content
          className="
            fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
            w-[90%] max-w-md bg-white/10 text-white p-6 rounded-xl 
            border border-white/20 shadow-lg
            max-h-[90vh] overflow-y-auto
            pt-10
          "
        >
          <Dialog.Title className="text-xl font-bold mb-4">
            แก้ไขข้อมูลโรง
          </Dialog.Title>

          <div className="space-y-3">
            {/* ชื่อโรง */}
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded bg-white/10 border border-white/20"
              placeholder="ชื่อโรง"
            />

            {/* ประเภท */}
            <input
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-2 rounded bg-white/10 border border-white/20"
              placeholder="ประเภทโรง"
            />

            {/* Rows */}
            <input
              type="number"
              value={rows}
              onChange={(e) => setRows(e.target.valueAsNumber)}
              className="w-full p-2 rounded bg-white/10 border border-white/20"
              placeholder="จำนวนแถว"
              min={1}
            />

            {/* Cols */}
            <input
              type="number"
              value={cols}
              onChange={(e) => setCols(e.target.valueAsNumber)}
              className="w-full p-2 rounded bg-white/10 border border-white/20"
              placeholder="จำนวนที่นั่งต่อแถว"
              min={1}
            />

            {/* ฟอร์มกำหนดราคาแถว */}
            <div className="mt-4 pt-4">
              <p className="font-semibold mb-2">กำหนดราคาแต่ละแถว</p>

              {Array.from({ length: rows }).map((_, index) => {
                const rowLabel = alphabet[index];
                return (
                  <div
                    key={rowLabel}
                    className="flex items-center justify-between mb-2"
                  >
                    <span>แถว {rowLabel}</span>
                    <input
                      type="number"
                      className="w-24 p-1 rounded bg-white/10 border border-white/20"
                      value={rowPrices[rowLabel] || 0}
                      onChange={(e) =>
                        setRowPrices({
                          ...rowPrices,
                          [rowLabel]: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                );
              })}
            </div>

            {/* ปุ่ม */}
            <div className="flex justify-end gap-2 mt-12">
              <Dialog.Close asChild>
                <Button variant="danger" size="md">
                  ยกเลิก
                </Button>
              </Dialog.Close>

              <Button variant="primary" size="md" onClick={handleEdit}>
                บันทึก
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
