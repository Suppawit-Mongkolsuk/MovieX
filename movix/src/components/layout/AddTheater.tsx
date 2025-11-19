import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import axios from 'axios';
import Button from '../base/Button';
import { toast } from 'react-toastify';

interface Location {
  id: string;
  name: string;
}

interface TheaterForm {
  name: string;
  type: string;
  rows: number;
  cols: number;
  rowPrices: Record<string, number>;
}

export default function AddTheater({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false); // toggle dialog

  const [locationId, setLocationId] = useState('');
  const [theaters, setTheaters] = useState<TheaterForm[]>([
    {
      name: '',
      type: 'Standard',
      rows: 0,
      cols: 0,
      rowPrices: {},
    },
  ]); // อนุญาตเพิ่มหลายโรงใน batch เดียว

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
  const generateSeats = (
    theaterId: string,
    rows: number,
    cols: number,
    rowPrices: Record<string, number>
  ) => {
    const seats = [];

    for (let r = 1; r <= rows; r++) {
      const rowLabel = String.fromCharCode(64 + r); // 'A', 'B', ...

      const price = rowPrices[rowLabel] || 0;
      const seatType = price > 260 ? 'VIP' : 'Standard';

      for (let c = 1; c <= cols; c++) {
        const seatNumber = `${rowLabel}${c}`;

        seats.push({
          TheaterId: theaterId,
          seatRow: rowLabel,
          seatCol: c.toString(),
          seatNumber,
          seatType,
          seatPrice: price,
        });
      }
    }

    return seats;
  };

  const handleSubmit = async () => {
    if (!locationId) {
      toast.error('กรุณาเลือกสาขา');
      return;
    }

    if (theaters.length === 0) {
      toast.error('กรุณาเพิ่มโรงอย่างน้อย 1 โรง');
      return;
    }

    // เช็คว่าแต่ละโรงกรอกครบไหม
    for (let i = 0; i < theaters.length; i++) {
      const t = theaters[i];
      if (!t.name || t.rows <= 0 || t.cols <= 0) {
        toast.error(`กรุณากรอกข้อมูลให้ครบในโรงที่ ${i + 1}`);
        return;
      }
    }

    const loadingId = toast.loading('กำลังสร้างโรงหลายโรง...'); // เก็บ id ไว้ dismiss ทีหลัง

    try {
      // loop ทีละโรง
      for (const t of theaters) {
        // POST โรงใหม่
        const res = await axios.post(
          'https://68f0fcef0b966ad50034f883.mockapi.io/Theater',
          {
            name: t.name,
            type: t.type,
            locationId,
            rows: t.rows,
            cols: t.cols,
            seatCount: t.rows * t.cols,
            status: 'active',
          }
        );

        const theaterId = res.data.id;

        // generate seats ตาม rows/cols ของโรงนั้น ๆ
        const seats = generateSeats(theaterId, t.rows, t.cols, t.rowPrices);

        // ส่งเก้าอี้ทุกตัวขึ้น MockAPI เป็น array เดียว
        await axios.post(
          'https://68f0fcef0b966ad50034f883.mockapi.io/theaterSeats',
          {
            TheaterId: theaterId,
            seat: seats,
            seatPrice: 0,
          }
        );
      }

      toast.dismiss(loadingId);
      toast.success('สร้างโรงสำเร็จ!');

      // reset form
      setLocationId('');
      setTheaters([
        { name: '', type: 'Standard', rows: 0, cols: 0, rowPrices: {} },
      ]);

      setOpen(false);
      onSuccess();
    } catch (err) {
      console.error(err);
      toast.dismiss();
      toast.error('สร้างโรงไม่สำเร็จ');
    }
  };
  // ฟังก์ชันจัดการการเปลี่ยนแปลงข้อมูลฟอร์มโรง
  const handleTheaterChange = (
    index: number,
    field: keyof TheaterForm,
    value: string | number | Record<string, number>
  ) => {
    setTheaters((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value } as TheaterForm;
      return copy;
    });
  };
  // ฟังก์ชันเพิ่มฟอร์มโรงใหม่
  const addTheaterForm = () => {
    setTheaters((prev) => [
      ...prev,
      { name: '', type: 'Standard', rows: 0, cols: 0, rowPrices: {} },
    ]);
  };
  // ฟังก์ชันลบฟอร์มโรง
  const removeTheaterForm = (index: number) => {
    setTheaters((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      {/* ปุ่มเปิดฟอร์ม */}
      <Button onClick={() => setOpen(true)} variant="secondary" size="lg">
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
              max-h-[80vh] overflow-y-auto
            "
          >
            <h2 className="text-2xl font-bold text-movix-gold">
              เพิ่มโรงภาพยนตร์
            </h2>

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
            {/* ฟอร์มเพิ่มโรงหลายโรง */}
            {theaters.map((t, index) => (
              <div
                key={index}
                className="mt-4 rounded-lg border border-white/15 bg-white/5 p-4 space-y-3"
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-movix-gold">
                    โรงที่ {index + 1}
                  </p>
                  {theaters.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTheaterForm(index)}
                      className="text-xs px-2 py-1 rounded bg-red-500/80 text-white hover:bg-red-600"
                    >
                      ลบโรงนี้
                    </button>
                  )}
                </div>

                <div>
                  <label>ชื่อโรง</label>
                  <input
                    value={t.name}
                    onChange={(e) =>
                      handleTheaterChange(index, 'name', e.target.value)
                    }
                    className="w-full p-2 rounded bg-white/10 mt-1"
                    placeholder="เช่น โรง 1, Cinema Deluxe"
                  />
                </div>

                <div>
                  <label>ประเภทโรง</label>
                  <select
                    value={t.type}
                    onChange={(e) =>
                      handleTheaterChange(index, 'type', e.target.value)
                    }
                    className="w-full p-2 rounded bg-white/10 mt-1"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Premium">Premium</option>
                    <option value="IMAX">IMAX</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label>จำนวนแถว (Row)</label>
                    <input
                      type="number"
                      value={t.rows}
                      onChange={(e) =>
                        handleTheaterChange(
                          index,
                          'rows',
                          Number(e.target.value)
                        )
                      }
                      className="w-full p-2 rounded bg-white/10 mt-1"
                      min={1}
                    />
                  </div>

                  <div>
                    <label>จำนวนที่นั่งต่อแถว (Col)</label>
                    <input
                      type="number"
                      value={t.cols}
                      onChange={(e) =>
                        handleTheaterChange(
                          index,
                          'cols',
                          Number(e.target.value)
                        )
                      }
                      className="w-full p-2 rounded bg-white/10 mt-1"
                      min={1}
                    />
                  </div>
                </div>
                {/* กำหนดราคาแต่ละแถว */}
                {Array.from({ length: t.rows }, (_, i) => {
                  const label = String.fromCharCode(65 + i);
                  return (
                    <div className="flex items-center gap-2" key={label}>
                      <label>ราคาแถว {label}</label>
                      <input
                        type="number"
                        value={t.rowPrices[label] || 0}
                        onChange={(e) =>
                          handleTheaterChange(index, 'rowPrices', {
                            ...t.rowPrices,
                            [label]: Number(e.target.value),
                          })
                        }
                        className="w-24 p-1 rounded bg-white/10"
                      />
                    </div>
                  );
                })}
              </div>
            ))}

            <button
              type="button"
              onClick={addTheaterForm}
              className="mt-4 text-sm px-3 py-2 rounded bg-white/10 border border-dashed border-white/30 hover:bg-white/15"
            >
              + เพิ่มโรงอีก
            </button>

            {/* button */}
            <div className="flex justify-end gap-3 pt-3">
              <Dialog.Close asChild>
                <Button variant="danger" size="md">
                  ยกเลิก
                </Button>
              </Dialog.Close>

              <Button onClick={handleSubmit} variant="primary" size="md">
                สร้างโรง
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
