import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import axios from 'axios';
import Button from '../base/Button';
import { toast } from 'react-toastify';

interface Location {
  id: string;
  name: string;
}

export default function AddTheater({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);

  // state ของฟอร์ม
  const [name, setName] = useState('');
  const [type, setType] = useState('Standard');
  const [locationId, setLocationId] = useState('');
  const [rows, setRows] = useState<number>(0);
  const [cols, setCols] = useState<number>(0);

  // location list
  const [locations, setLocations] = useState<Location[]>([]);

  // โหลดสาขาทั้งหมด
  useEffect(() => {
    axios
      .get('https://68f0fcef0b966ad50034f883.mockapi.io/locations')
      .then((res) => setLocations(res.data))
      .catch(() => toast.error('โหลดสาขาไม่สำเร็จ'));
  }, []);

  // ฟังก์ชันสร้างเก้าอี้ทั้งหมด (Row × Col)
  const generateSeats = (theaterId: string, rows: number, cols: number) => {
    const seats = [];

    for (let r = 1; r <= rows; r++) {
      const rowLabel = String.fromCharCode(64 + r); // 'A', 'B', ...

      for (let c = 1; c <= cols; c++) {
        const seatNumber = `${rowLabel}${c}`;

        seats.push({
          TheaterId: theaterId,
          seatRow: rowLabel,
          seatCol: c.toString(),
          seatNumber,
          seatType: 'Standard',
          seatPrice: 0,
        });
      }
    }

    return seats;
  };

  // submit
  const handleSubmit = async () => {
    if (!name || !locationId || rows <= 0 || cols <= 0) {
      toast.error('กรอกข้อมูลให้ครบทุกช่อง');
      return;
    }

    toast.loading('กำลังสร้างโรง...');

    try {
      // 1) POST โรงใหม่
      const res = await axios.post(
        'https://68f0fcef0b966ad50034f883.mockapi.io/Theater',
        {
          name,
          type,
          locationId,
          rows,
          cols,
          seatCount: rows * cols,
          status: 'active',
        }
      );

      const theaterId = res.data.id;

      // 2generate seat
      const seats = generateSeats(theaterId, rows, cols);

      // 3) ส่งเก้าอี้ทุกตัวขึ้น MockAPI (แบบ array เดียว)
      await axios.post(
        'https://68f0fcef0b966ad50034f883.mockapi.io/theaterSeats',
        {
          TheaterId: theaterId,
          seat: seats,
          seatPrice: 0,
        }
      );

      toast.dismiss();
      toast.success('สร้างโรงสำเร็จ!');

      // reset form
      setName('');
      setType('Standard');
      setLocationId('');
      setRows(0);
      setCols(0);

      setOpen(false);
      onSuccess();
    } catch (err) {
      console.error(err);
      toast.error('สร้างโรงไม่สำเร็จ');
    }
  };

  return (
    <>
      {/* ปุ่มเปิดฟอร์ม */}
      <Button
        onClick={() => setOpen(true)}
        className="bg-movix-gold text-black px-6"
      >
        + Add Theater
      </Button>

      {/* Popup dialog */}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

          <Dialog.Content
            className="
              fixed top-1/2 left-1/2 
              -translate-x-1/2 -translate-y-1/2
              bg-white/10 backdrop-blur-xl
              border border-white/20 
              rounded-xl p-6 w-[90%] max-w-lg text-white
              space-y-5 z-[9999]
            "
          >
            <h2 className="text-2xl font-bold text-movix-gold">
              เพิ่มโรงภาพยนตร์
            </h2>

            {/* ชื่อโรง */}
            <div>
              <label>ชื่อโรง</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 rounded bg-white/10 mt-1"
                placeholder="เช่น โรง 1, Cinema Deluxe"
              />
            </div>

            {/* ประเภทโรง */}
            <div>
              <label>ประเภทโรง</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-2 rounded bg-white/10 mt-1"
              >
                <option value="Standard">Standard</option>
                <option value="Premium">Premium</option>
                <option value="IMAX">IMAX</option>
              </select>
            </div>

            {/* สาขา */}
            <div>
              <label>เลือกสาขา</label>
              <select
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                className="w-full p-2 rounded bg-white/10 mt-1"
              >
                <option value="">-- เลือกสาขา --</option>
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Row / Col */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label>จำนวนแถว (Row)</label>
                <input
                  type="number"
                  value={rows}
                  onChange={(e) => setRows(Number(e.target.value))}
                  className="w-full p-2 rounded bg-white/10 mt-1"
                  min={1}
                />
              </div>

              <div>
                <label>จำนวนที่นั่งต่อแถว (Col)</label>
                <input
                  type="number"
                  value={cols}
                  onChange={(e) => setCols(Number(e.target.value))}
                  className="w-full p-2 rounded bg-white/10 mt-1"
                  min={1}
                />
              </div>
            </div>

            {/* button */}
            <div className="flex justify-end gap-3 pt-3">
              <Dialog.Close asChild>
                <Button className="bg-gray-600">ยกเลิก</Button>
              </Dialog.Close>

              <Button
                onClick={handleSubmit}
                className="bg-movix-gold text-black px-6"
              >
                สร้างโรง
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
