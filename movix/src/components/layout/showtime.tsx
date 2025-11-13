import { useEffect, useState } from 'react';
import axios from 'axios';

interface Showtime {
  id: string;
  movieId: string;
  locationId: string;
  theaterId: string;
  date: string;
  times: string[];
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

export default function ShowtimeSection({ movieId }: { movieId: string }) {
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [locations, setLocations] = useState<Location[]>([]);
  const [theatersData, setTheatersData] = useState<Theater[]>([]);

  // โหลดข้อมูลทั้งหมด
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resShowtime = await axios.get(
          `https://68f0fcef0b966ad50034f883.mockapi.io/Showtime?movieID=${movieId}`
        );
        setShowtimes(resShowtime.data);

        // เซ็ตวันเริ่มต้น
        if (resShowtime.data.length > 0) {
          setSelectedDate(resShowtime.data[0].date);
        }

        const resLocation = await axios.get(
          'https://68f0fcef0b966ad50034f883.mockapi.io/locations'
        );
        setLocations(resLocation.data);

        const resTheater = await axios.get(
          'https://68f0fcef0b966ad50034f883.mockapi.io/Theater'
        );
        setTheatersData(resTheater.data);
      } catch (err) {
        console.error('โหลดข้อมูลล้มเหลว:', err);
      }
    };

    fetchData();
  }, [movieId]);

  // ดึงวันที่ทั้งหมดจาก showtime จริง
  const uniqueDates = [...new Set(showtimes.map((st) => st.date))];

  // Filter เฉพาะวันที่เลือก
  const filtered = showtimes.filter((st) => st.date === selectedDate);

  // Group ตาม location
  const grouped: Record<string, Showtime[]> = {};
  filtered.forEach((st) => {
    if (!grouped[st.locationId]) grouped[st.locationId] = [];
    grouped[st.locationId].push(st);
  });

  const getLocationName = (id: string) =>
    locations.find((l) => l.id === id)?.name || id;

  const getTheaterName = (id: string) =>
    theatersData.find((t) => t.id === id)?.name || id;

  return (
    <div className="text-white mt-10 space-y-12 pb-10">
      {/* ปุ่มเลือกวัน */}
      <div className="flex gap-3 overflow-x-auto pb-3">
        {uniqueDates.map((d) => (
          <button
            key={d}
            onClick={() => setSelectedDate(d)}
            className={`px-5 py-2 rounded-lg whitespace-nowrap font-semibold transition-all ${
              selectedDate === d
                ? 'bg-movix-gold text-black shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {new Date(d).toLocaleDateString('th-TH', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
            })}
          </button>
        ))}
      </div>

      {/* รอบฉาย */}
      {Object.entries(grouped).map(([locationId, shows]) => (
        <div
          key={locationId}
          className="pt-8 border-t border-white/10 backdrop-blur-sm last:mb-8"
        >
          <h3 className="text-movix-gold font-bold text-xl mb-6">
            {getLocationName(locationId)}
          </h3>

          <div className="space-y-8">
            {shows.map((show) => (
              <div
                key={show.id}
                className="p-5 rounded-xl bg-white/5 border border-white/10 shadow-sm"
              >
                <p className="text-white/80 text-sm font-semibold mb-4">
                  {getTheaterName(show.theaterId)}
                </p>

                <div className="flex flex-wrap gap-3">
                  {show.times.map((t) => (
                    <button
                      key={t}
                      className="
                        px-4 py-2 rounded-full
                        bg-gradient-to-b from-white/15 to-white/5
                        border border-white/20
                        text-white/90 text-sm font-medium
                        hover:bg-movix-gold hover:text-black transition
                      "
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
