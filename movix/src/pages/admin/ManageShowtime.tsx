import { useEffect, useState } from 'react';
import axios from 'axios';
import AddShowtime from '../../components/layout/AddShowtime';

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
    loadShowtimes(); // โหลดตอนเปิดหน้า
  }, []);

  return (
    <div className="p-6">
      {/* ⭐ ปุ่ม Add Showtime เรียก AddShowtime */}
      <AddShowtime onSuccess={loadShowtimes} />
    </div>
  );
}
