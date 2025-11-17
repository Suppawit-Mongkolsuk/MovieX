import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import SeatLayout from '../../components/layout/SeatLayout';
import SeatSummary from '../../components/layout/SeatSummary';
import type { Seat } from '../../api/typeseat';
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

  const [showtime, setShowtime] = useState<Showtime | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [theater, setTheater] = useState<Theater | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  useEffect(() => {
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

  if (loading || !showtime || !movie || !location || !theater) {
    return <div></div>;
  }

  return (
    <div className="text-white px-4 sm:px-6 pt-12 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div
        className="
        bg-white/10 backdrop-blur-lg
        border border-white/20
        rounded-2xl p-6 sm:p-8
        shadow-[0_0_20px_rgba(255,215,0,0.15)]
        transition
      "
      >
        <div className="flex flex-col sm:flex-row gap-5 sm:gap-12 items-center ">
          {/* โปสเตอร์ */}
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-36 h-52 sm:w-40 sm:h-60 object-cover rounded-xl shadow-lg border border-white/20"
          />

          {/* ข้อมูลหนัง */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-movix-gold tracking-wide mb-3">
              {movie.title}
            </h2>

            <div className="space-y-2 text-white/80 text-sm sm:text-base">
              <p>
                สาขา: <span className="text-white">{location.name}</span>
              </p>
              <p>
                โรง: <span className="text-white">{theater.name}</span> (
                {theater.type})
              </p>
              <p>
                วันที่: <span className="text-white">{showtime.date}</span>
              </p>

              <p className="flex items-center gap-1">
                เวลา:
                {showtime.times.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-1 bg-white/10 rounded-md border border-white/20 text-white text-xs sm:text-sm"
                  >
                    {t}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>

        {/* เส้นคั่นพรีเมียม */}
        <div className="mt-6 h-[1px] bg-gradient-to-r from-transparent via-movix-gold to-transparent opacity-60"></div>
      </div>

      {/*  โครงที่นั่ง */}
      <div className="mt-10">
        <SeatLayout
          theater={theater}
          onSelectChange={(selected) => setSelectedSeats(selected)}
        />

        <SeatSummary selectedSeats={selectedSeats} />
      </div>
    </div>
  );
}
