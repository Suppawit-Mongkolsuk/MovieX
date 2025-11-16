import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Showtime {
  id: string;
  movieID: string;
  locationId: string;
  theaterId: string;
  date: string;
  enddate: string;
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

type GroupedMap = Record<
  string,
  {
    theaterId: string;
    times: string[];
    showIds: string[];
  }
>;

export default function ShowtimeSection({ movieId }: { movieId: string }) {
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [locations, setLocations] = useState<Location[]>([]);
  const [theatersData, setTheatersData] = useState<Theater[]>([]);

  const navigate = useNavigate();

  // โหลดข้อมูลทั้งหมด
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resShowtime = await axios.get(
          `https://68f0fcef0b966ad50034f883.mockapi.io/Showtime?movieID=${movieId}`
        );
        setShowtimes(resShowtime.data);

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

  // วันทั้งหมด
  const uniqueDates = [...new Set(showtimes.map((st) => st.date))];

  // filter ตามวันที่เลือก
  const filtered = showtimes.filter((st) => st.date === selectedDate);

  // group ตาม location
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
            {/* ⭐ Group แยกตามโรงแบบ type-safe แล้ว */}
            {Object.entries(
              shows.reduce<GroupedMap>((acc, st) => {
                if (!acc[st.theaterId]) {
                  acc[st.theaterId] = {
                    theaterId: st.theaterId,
                    times: [],
                    showIds: [],
                  };
                }

                acc[st.theaterId].times.push(...st.times);
                acc[st.theaterId].showIds.push(st.id);

                return acc;
              }, {})
            ).map(([theaterId, data]) => (
              <div
                key={theaterId}
                className="p-5 rounded-xl bg-white/5 border border-white/10 shadow-sm"
              >
                <p className="text-white/80 text-sm font-semibold mb-4">
                  {getTheaterName(theaterId)}
                </p>

                <div className="flex flex-wrap gap-3">
                  {data.times.map((t, index) => (
                    <button
                      key={theaterId + t + index}
                      onClick={() => navigate(`/seat/${data.showIds[index]}`)}
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
