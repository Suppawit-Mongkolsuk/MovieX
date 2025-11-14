import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../../components/base/Button';
import * as Dialog from '@radix-ui/react-dialog';
import { toast } from 'react-toastify';

export default function AddShowtime({ onSuccess }: { onSuccess: () => void }) {
  // เปิด/ปิด Dialog ฟอร์ม
  const [open, setOpen] = useState(false);

  // ข้อมูล master จาก MockAPI
  const [movies, setMovies] = useState([]);
  const [locations, setLocations] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [showtimes, setShowtimes] = useState([]); // ใช้ตรวจว่าโรงไหนถูกใช้ไปแล้ว

  // ค่าที่เลือกในฟอร์ม
  const [movieId, setMovieId] = useState('');
  const [locationId, setLocationId] = useState('');
  const [theaterId, setTheaterId] = useState('');

  // เวลา
  const [times, setTimes] = useState<string[]>([]);
  const [timeInput, setTimeInput] = useState('');

  // วันที่เริ่ม – วันที่จบ
  const [date, setDate] = useState('');
  const [enddate, setEnddate] = useState('');

  // โหลดข้อมูลจาก MockAPI
  useEffect(() => {
    const load = async () => {
      try {
        const m = await axios.get(
          'https://68f0fcef0b966ad50034f883.mockapi.io/movies'
        );
        const l = await axios.get(
          'https://68f0fcef0b966ad50034f883.mockapi.io/locations'
        );
        const t = await axios.get(
          'https://68f0fcef0b966ad50034f883.mockapi.io/Theater'
        );
        const s = await axios.get(
          'https://68f0fcef0b966ad50034f883.mockapi.io/Showtime'
        );

        // เก็บข้อมูลลง state
        setMovies(m.data);
        setLocations(l.data);
        setTheaters(t.data);
        setShowtimes(s.data);
      } catch (err) {
        console.error('โหลดข้อมูลล้มเหลว:', err);
        toast.error('โหลดข้อมูลไม่สำเร็จ');
      }
    };

    load();
  }, []);

  // เพิ่มเวลา 1 ช่อง
  const addTime = () => {
    if (!timeInput.trim()) return;
    setTimes((prev) => [...prev, timeInput.trim()]);
    setTimeInput('');
  };

  // ฟังก์ชันสร้างช่วงวัน เช่น 1–3 = ["2025-10-01","2025-10-02","2025-10-03"]
  const generateRange = (start: string, end: string) => {
    const result: string[] = [];
    let c = new Date(start);
    const last = new Date(end);

    while (c <= last) {
      result.push(c.toISOString().slice(0, 10));
      c.setDate(c.getDate() + 1);
    }
    return result;
  };

  // ---------------------------------------------------------
  // คำนวณว่าโรงไหน "ถูกใช้แล้ว" ในช่วงวันที่เลือก
  // ---------------------------------------------------------
  let takenTheaters: string[] = [];

  if (date && enddate) {
    const days = generateRange(date, enddate);

    // หา showtime ที่วันทับกัน
    const overlap = showtimes.filter((st: any) => days.includes(st.date));

    // เก็บ ID โรงที่ถูกใช้แล้ว
    takenTheaters = overlap.map((st: any) => st.theaterId);
  }

  // ---------------------------------------------------------
  // Filter โรงที่เหมาะสม:
  // 1. อยู่ในสาขาที่เลือก
  // 2. status = active
  // 3. ไม่อยู่ใน takenTheaters
  // ---------------------------------------------------------
  const filteredTheaters = theaters.filter(
    (t: any) =>
      t.locationId === locationId && // ของโรงเป็น locationId
      t.status === 'active' &&
      !takenTheaters.includes(t.id)
  );

  // ---------------------------------------------------------
  // 🟡 ฟังก์ชันกดสร้างรอบหนัง
  // ---------------------------------------------------------
  const handleCreate = async () => {
    if (
      !movieId ||
      !locationId ||
      !theaterId ||
      !date ||
      !enddate ||
      times.length === 0
    ) {
      toast.error('กรอกข้อมูลให้ครบก่อน!');
      return;
    }

    toast.loading('กำลังสร้างรอบหนัง...');

    const days = generateRange(date, enddate);

    try {
      // POST ขึ้น MockAPI วันละ 1 record
      for (const d of days) {
        await axios.post(
          'https://68f0fcef0b966ad50034f883.mockapi.io/Showtime',
          {
            movieID: movieId,
            locationId,
            theaterId,
            date: d,
            enddate: enddate,
            times,
          }
        );
      }

      //  อัปเดตสถานะโรงเป็นไม่พร้อมใช้งาน
      await axios.put(
        `https://68f0fcef0b966ad50034f883.mockapi.io/Theater/${theaterId}`,
        { status: 'not_available' }
      );

      toast.dismiss();
      toast.success('สร้างรอบหนังสำเร็จ!');

      setOpen(false);
      onSuccess(); // รีเฟรชตารางหน้า Admin
    } catch (err) {
      console.error('สร้างไม่สำเร็จ:', err);
      toast.error('สร้างรอบหนังไม่สำเร็จ');
    }
  };

  return (
    <>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <Button
            onClick={() => setOpen(true)}
            className="bg-movix-gold text-black px-6"
          >
            + Add Showtime
          </Button>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <Dialog.Content
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
            bg-white/10 border border-white/20 backdrop-blur-xl rounded-xl p-6 w-full max-w-lg text-white space-y-5"
          >
            <h2 className="text-xl font-bold text-movix-gold">เพิ่มรอบหนัง</h2>

            {/* เลือกหนัง */}
            <div>
              <label>เลือกหนัง</label>
              <select
                className="w-full p-2 rounded bg-white/10 mt-1"
                onChange={(e) => setMovieId(e.target.value)}
              >
                <option value="">-- เลือกหนัง --</option>
                {movies.map((m: any) => (
                  <option key={m.id} value={m.movieID}>
                    {m.title}
                  </option>
                ))}
              </select>
            </div>

            {/* เลือกสาขา */}
            <div>
              <label>เลือกสาขา</label>
              <select
                className="w-full p-2 rounded bg-white/10 mt-1"
                onChange={(e) => setLocationId(e.target.value)}
              >
                <option value="">-- เลือกสาขา --</option>
                {locations.map((l: any) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>

            {/* เลือกโรง */}
            <div>
              <label>เลือกโรง</label>
              <select
                className="w-full p-2 rounded bg-white/10 mt-1"
                disabled={!locationId}
                onChange={(e) => setTheaterId(e.target.value)}
              >
                <option value="">-- เลือกโรง --</option>

                {filteredTheaters.length === 0 &&
                  locationId &&
                  date &&
                  enddate && (
                    <option disabled>ไม่มีโรงว่างในวันที่เลือก</option>
                  )}

                {filteredTheaters.map((t: any) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.type})
                  </option>
                ))}
              </select>
            </div>

            {/* เพิ่มเวลา */}
            <div>
              <label>เพิ่มเวลา</label>
              <div className="flex gap-2 mt-1">
                <input
                  type="text"
                  value={timeInput}
                  onChange={(e) => setTimeInput(e.target.value)}
                  placeholder="เช่น 11:30"
                  className="flex-1 p-2 rounded bg-white/10"
                />
                <Button
                  onClick={addTime}
                  className="bg-movix-gold text-black px-4"
                >
                  เพิ่ม
                </Button>
              </div>

              {/* แสดงเวลา */}
              <div className="flex gap-2 flex-wrap mt-2">
                {times.map((t, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-white/20 rounded-full text-sm"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* วันที่ */}
            <div>
              <label>วันที่เริ่ม</label>
              <input
                type="date"
                className="w-full p-2 bg-white/10 rounded mt-1"
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div>
              <label>วันที่จบ</label>
              <input
                type="date"
                className="w-full p-2 bg-white/10 rounded mt-1"
                onChange={(e) => setEnddate(e.target.value)}
              />
            </div>

            {/* ปุ่ม */}
            <div className="flex justify-end gap-3 pt-3">
              <Dialog.Close asChild>
                <Button variant="danger" size="md">
                  ยกเลิก
                </Button>
              </Dialog.Close>
              <Button onClick={handleCreate} variant="primary" size="md">
                สร้างรอบหนัง
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
