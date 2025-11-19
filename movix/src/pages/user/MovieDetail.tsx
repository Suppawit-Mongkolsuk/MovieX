import { useParams } from 'react-router-dom';
import { getMovies } from '../../api/movies';
import type { Movie } from '../../api/typeMovie';
import { useState, useEffect } from 'react';
import Navbar from '../../components/base/Navbar';
import TrailerPlayer from '../../components/layout/TrailerPlayer';
import ShowtimeSection from '../../components/layout/showtime';

export default function MovieDetail() {
  // เก็บข้อมูลหนังทั้งหมดเพื่อนำมาเลือกเฉพาะเรื่องที่ตรงกับพารามิเตอร์
  const [movies, setGetMovies] = useState<Movie[]>([]);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    // โหลดข้อมูลหนังจาก MockAPI เมื่อหน้าเพิ่งเปิด
    const loadMovies = async () => {
      const data = await getMovies();
      setGetMovies(data);
    };
    loadMovies();
  }, []);

  // หาหนังที่ movieID ตรงกับ params จาก URL
  const movie = movies.find((m) => m.movieID.toString() === id);

  if (!movie) {
    return (
      <div className="text-center text-white py-10">
        กำลังโหลดข้อมูล หรือไม่พบหนังที่ต้องการ 🎬
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen text-white">
      <Navbar />

      {/* 🔹 Container หลักแบบ responsive */}
      <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-10 px-6 md:px-12 py-10">
        {/* โปสเตอร์ */}
        <div className="w-full md:w-1/3 flex justify-center md:justify-start">
          <div className="w-full max-w-[200px] sm:max-w-[250px] md:max-w-[280px] lg:max-w-[400px]">
            <img
              src={movie.poster}
              alt={movie.title}
              className="rounded-2xl shadow-xl shadow-black/40 w-full h-auto transition-all duration-500 ease-in-out object-cover"
            />
            <p className="text-white/80 font-semibold mt-4 text-center text-xl lg:text-2xl">
              {movie.title}
            </p>
          </div>
        </div>

        {/* วิดีโอ Trailer */}
        <div className="w-full md:w-3/3 shadow-xl shadow-black/40">
          {/* TrailerPlayer จะจัดการแปลง URL เป็น iframe เอง */}
          <TrailerPlayer url={movie.trailer} title={movie.title} />
        </div>
      </div>
      <div className="w-full mt-12 px-6 md:px-12">
        {/* แสดงตารางรอบฉายของหนังเรื่องนี้ */}
        <ShowtimeSection movieId={movie.movieID} />
      </div>
    </div>
  );
}
