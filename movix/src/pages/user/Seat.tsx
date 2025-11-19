import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import SeatLayout from '../../components/layout/SeatLayout';
import SeatSummary from '../../components/layout/SeatSummary';
import type { Seat } from '../../api/typeseat';
import type { User } from '../../api/typeuser';
interface Showtime {
  id: string;
  movieID: string;
  locationId: string;
  theaterId: string;
  date: string;
  times: string[];
}

interface Movie {
  id: string;
  movieID: string;
  title: string;
  poster: string;
  time: number;
}

interface Location {
  id: string;
  name: string;
}

interface Theater {
  id: string;
  name: string;
  type: string;
}
export default function Seat() {
  const { showtimeId } = useParams();
  const navigate = useNavigate();

  // state สำหรับข้อมูลที่ต้องใช้ในการวาดที่นั่ง + ตรวจสอบผู้ใช้ล็อกอินไหม
  const [showtime, setShowtime] = useState<Showtime | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [theater, setTheater] = useState<Theater | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // โหลดรายละเอียด (showtime/movies/location/theater) ตาม id ที่รับจาก route
    const load = async () => {
      toast.loading('กำลังโหลดข้อมูล...');

      try {
        const st = await axios.get(
          `https://68f0fcef0b966ad50034f883.mockapi.io/Showtime/${showtimeId}`
        );
        setShowtime(st.data);

        const mv = await axios.get(
          `https://68f0fcef0b966ad50034f883.mockapi.io/movies?movieID=${st.data.movieID}`
        );
        setMovie(mv.data[0]);

        const lc = await axios.get(
          `https://68f0fcef0b966ad50034f883.mockapi.io/locations/${st.data.locationId}`
        );
        setLocation(lc.data);

        const th = await axios.get(
          `https://68f0fcef0b966ad50034f883.mockapi.io/Theater/${st.data.theaterId}`
        );
        toast.dismiss();
        setTheater(th.data);
      } catch (err) {
        console.error('โหลดข้อมูลล้มเหลว:', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [showtimeId]);

  useEffect(() => {
    // ตรวจสอบว่ามี user ไหนกำลังล็อกอินบ้าง เพื่อใช้ control ปุ่ม proceed
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          'https://68f0fcef0b966ad50034f883.mockapi.io/Login'
        );
        const logged = res.data.find((u: User) => u.isLogin === true);
        setIsLoggedIn(!!logged);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  if (loading || !showtime || !movie || !location || !theater) {
    return <div></div>;
  }

  return (
    <div className="text-white px-4 sm:px-6 lg:px-10 pt-20 pb-16 max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.35)]">
        <div className="flex flex-col xl:flex-row gap-6 xl:gap-12 items-center xl:items-start">
          {/* โปสเตอร์ */}
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-40 h-60 sm:w-48 sm:h-72 object-cover rounded-2xl shadow-lg border border-white/20"
          />

          {/* ข้อมูลหนัง */}
          <div className="w-full space-y-5">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-white/60 mb-2">
                  Showtime
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-movix-gold tracking-wide">
                  {movie.title}
                </h2>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {showtime.times.map((t) => (
                  <span
                    key={t}
                    className="px-4 py-2 bg-white/5 border border-white/15 rounded-full text-xs sm:text-sm"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-3 text-white/80 text-sm sm:text-base sm:grid-cols-2">
              <p>
                สาขา: <span className="text-white">{location.name}</span>
              </p>
              <p>
                โรง: <span className="text-white">{theater.name}</span> ({' '}
                {theater.type})
              </p>
              <p>
                วันที่: <span className="text-white">{showtime.date}</span>
              </p>
              <p>
                ระยะเวลา: <span className="text-white">{movie.time} นาที</span>
              </p>
            </div>
          </div>
        </div>

        {/* เส้นคั่นพรีเมียม */}
        <div className="mt-6 h-[1px] bg-gradient-to-r from-transparent via-movix-gold to-transparent opacity-60"></div>
      </div>

      {/*  โครงที่นั่ง + Summary */}
      <div className="space-y-8">
        <SeatLayout
          theater={theater}
          onSelectChange={(selected) => setSelectedSeats(selected)}
          showtimeId={showtime.id}
        />

        <SeatSummary
          selectedSeats={selectedSeats}
          onProceedToPayment={() =>
            navigate('/payment', {
              state: {
                selectedSeats,
                showtime,
                movie,
                location,
                theater,
                totalPrice: selectedSeats.reduce(
                  (sum, s) => sum + Number(s.seatPrice || 0),
                  0
                ),
              },
            })
          }
          // ส่ง flag isLoggedIn ไปเงื่อนไขการกดชำระเงิน
          isLoggedIn={isLoggedIn}
        />
      </div>
    </div>
  );
}
