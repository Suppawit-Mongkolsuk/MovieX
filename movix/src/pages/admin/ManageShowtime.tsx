import { useEffect, useState } from 'react';
import axios from 'axios';
import AddShowtime from '../../components/layout/AddShowtime';

interface Showtime {
  id: string;
  movieID: string;
  locationId: string;
  theaterId: string;
  date: string;
  enddate: string;
  times: string[];
}

interface Theater {
  id: string;
  name: string;
  type: string;
  locationId: string;
  status: string;
}

export default function ManageShowtime() {
  const [showtimes, setShowtimes] = useState([]);

  // โหลดข้อมูลรอบหนังจาก MockAPI
  const loadShowtimes = async () => {
    const res = await axios.get(
      'https://68f0fcef0b966ad50034f883.mockapi.io/Showtime'
    );
    setShowtimes(res.data);
  };

  useEffect(() => {
    const resetTheaterStatus = async () => {
      try {
        const [showRes, thRes] = await Promise.all([
          axios.get('https://68f0fcef0b966ad50034f883.mockapi.io/Showtime'),
          axios.get('https://68f0fcef0b966ad50034f883.mockapi.io/Theater'),
        ]);

        const showtimes = showRes.data;
        const theaters = thRes.data;

        const today = new Date().toISOString().slice(0, 10);

        // โรงที่ยังมีรอบ >= วันนี้ → ยังไม่ว่าง
        const busyTheaters = new Set(
          showtimes
            .filter((st: Showtime) => st.enddate >= today)
            .map((st: Showtime) => st.theaterId)
        );

        for (const th of theaters as Theater[]) {
          const shouldBeActive = !busyTheaters.has(th.id);

          if (shouldBeActive && th.status !== 'active') {
            await axios.put(
              `https://68f0fcef0b966ad50034f883.mockapi.io/Theater/${th.id}`,
              { status: 'active' }
            );
          }
        }
      } catch (err) {
        console.error('Auto reset failed:', err);
      }
    };

    resetTheaterStatus();
  }, []);

  return (
    <div className="p-6">
      {/* ⭐ ปุ่ม Add Showtime เรียก AddShowtime */}
      <AddShowtime onSuccess={loadShowtimes} />
    </div>
  );
}
