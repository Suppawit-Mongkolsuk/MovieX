import { useEffect, useState } from 'react';
import axios from 'axios';
import AddShowtime from '../../components/layout/AddShowtime';
import { NavbarAdmin } from '../../components/base/NavbarAdmin';
import type { Movie } from '../../api/typeMovie';
import DeleteShowtimeButton from '../../components/layout/DeleteShowtime';

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

interface Location {
  id: string;
  name: string;
}

export default function ManageShowtime() {
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [moviesData, setMoviesData] = useState<Movie[]>([]);
  const [locationsData, setLocationsData] = useState<Location[]>([]);
  const [theatersData, setTheatersData] = useState<Theater[]>([]);

  const loadMasterData = async () => {
    const [m, l, t, s] = await Promise.all([
      axios.get('https://68f0fcef0b966ad50034f883.mockapi.io/movies'),
      axios.get('https://68f0fcef0b966ad50034f883.mockapi.io/locations'),
      axios.get('https://68f0fcef0b966ad50034f883.mockapi.io/Theater'),
      axios.get('https://68f0fcef0b966ad50034f883.mockapi.io/Showtime'),
    ]);

    setMoviesData(m.data);
    setLocationsData(l.data);
    setTheatersData(t.data);
    setShowtimes(s.data);
  };

  useEffect(() => {
    loadMasterData();

    const resetTheaterStatus = async () => {
      try {
        const [showRes, thRes] = await Promise.all([
          axios.get('https://68f0fcef0b966ad50034f883.mockapi.io/Showtime'),
          axios.get('https://68f0fcef0b966ad50034f883.mockapi.io/Theater'),
        ]);

        const showtimes = showRes.data;
        const theaters = thRes.data;

        const today = new Date().toISOString().slice(0, 10);

        // เช็ครีเซ็ทค่า stutas
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
    <div className="pt-16 px-6 pb-12">
      <NavbarAdmin />
      <div className="px-2 sm:px-4 md:px-12 mt-6 md:mt-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 md:mb-8">
          <h1 className="text-lg text-center sm:text-xl md:text-2xl font-bold ">
            📋 รอบหนังทั้งหมด
          </h1>
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-end gap-3">
            {/* ปุ่ม Add Showtime*/}
            <AddShowtime onSuccess={loadMasterData} />
          </div>
        </div>
        {/* แสดงแบบจัดกลุ่ม */}
        <div className="space-y-8 mt-6 w-full">
          {moviesData.map((movie) => {
            const movieShowtimes = showtimes.filter(
              (st) => st.movieID === movie.movieID
            );
            if (movieShowtimes.length === 0) return null;

            return (
              <div
                key={movie.movieID}
                className="bg-white/5 p-5 rounded-lg border border-white/10 w-full overflow-hidden"
              >
                <div className="flex flex-row justify-between items-center mb-3 sm:flex-row sm:justify-between sm:items-center">
                  <h2 className="md:text-xl text-lg font-bold text-movix-gold p-2">
                    🎬 {movie.title}
                  </h2>

                  <DeleteShowtimeButton
                    movieID={movie.movieID}
                    locationId=""
                    theaterId=""
                    onSuccess={loadMasterData}
                  />
                </div>

                {locationsData.map((loc) => {
                  const locST = movieShowtimes.filter(
                    (st) => st.locationId === loc.id
                  );
                  if (locST.length === 0) return null;

                  return (
                    <div key={loc.id} className="mb-5 sm:ml-4 ml-1">
                      <h3 className="text-lg font-semibold mb-2">
                        📍 {loc.name}
                      </h3>

                      {theatersData.map((th) => {
                        const thST = locST.filter(
                          (st) => st.theaterId === th.id
                        );
                        if (thST.length === 0) return null;

                        return (
                          <div
                            key={th.id}
                            className="bg-black/20 p-4 rounded-md mb-4 sm:ml-6 ml-2 border border-white/5"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium">🎦 {th.name}</h4>
                              <DeleteShowtimeButton
                                movieID={movie.movieID}
                                locationId={loc.id}
                                theaterId={th.id}
                                onSuccess={loadMasterData}
                              />
                            </div>

                            <div className="space-y-2">
                              {thST.map((st) => (
                                <div
                                  key={st.id}
                                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white/5 p-3 rounded-md gap-3"
                                >
                                  <div className="text-sm whitespace-nowrap">
                                    <span className="font-semibold text-movix-gold">
                                      {st.date}
                                    </span>
                                  </div>

                                  <div className="flex gap-2 flex-wrap justify-center sm:justify-start flex-1">
                                    {st.times.map((t) => (
                                      <span
                                        key={t}
                                        className="px-3 py-1 bg-movix-gold/20 border border-movix-gold rounded-full text-xs text-movix-gold"
                                      >
                                        {t}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
