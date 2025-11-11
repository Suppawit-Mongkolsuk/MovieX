import { useState, useEffect } from 'react';
import axios from 'axios';
import { NavbarAdmin } from '../../components/base/NavbarAdmin';
import AddMovieDialog from '../../components/layout/Addmoviex';
import { BaseTable } from '../../components/base/Table';
import toast from 'react-hot-toast';
import type { Movie } from '../../api/typeMovie';
import EditMovie from '../../components/layout/EditMovie';
import DeleteMovie from '../../components/layout/DeleteMovie';
import FilterStatus from '../../components/layout/FilterStatus';

const ManageMovie = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [allMovies, setAllMovies] = useState<Movie[]>([]); // เก็บข้อมูลไว้กรอง

  // โหลดข้อมูลจาก MockAPI
  const fetchMovies = async () => {
    try {
      const res = await axios.get(
        'https://68f0fcef0b966ad50034f883.mockapi.io/movies'
      );
      setMovies(res.data);
      setAllMovies(res.data);
    } catch (error) {
      console.error('โหลดข้อมูลไม่สำเร็จ:', error);
      toast.error('โหลดข้อมูลหนังไม่สำเร็จ');
    }
  };

  // เรียก fetchMovies ตอนเปิดหน้า
  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className="pt-16 px-6 pb-12">
      <NavbarAdmin />
      <div className="px-2 sm:px-4 md:px-12 mt-6 md:mt-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 md:mb-8">
          <h1 className="text-lg text-center sm:text-xl md:text-2xl font-bold ">
            📋 รายชื่อหนังทั้งหมด
          </h1>
          <div className="w-full md:w-auto flex flex-col md:flex-row items-center justify-center md:justify-end gap-3">
            {/* ตัวกรองสถานะ */}
            <FilterStatus
              onFilterChange={(status) => {
                if (status === 'All') {
                  setMovies(allMovies);
                } else {
                  const filtered = allMovies.filter((m) => m.status === status); //ใช้ข้อมูลต้นฉบับ
                  setMovies(filtered);
                }
              }}
            />

            {/* ปุ่มเพิ่มหนัง */}
            <AddMovieDialog onAdded={fetchMovies} />
          </div>
        </div>
        {/* ตาราง */}
        <div className="overflow-x-auto overflow-y-hidden rounded-lg shadow-md border border-white/10 backdrop-blur-sm">
          <div className="min-w-[700px] sm:min-w-full">
            <BaseTable
              columns={[
                'โปสเตอร์',
                'ชื่อเรื่อง',
                'วันที่ฉาย',
                'วันออกโรง',
                'สถานะ',
                'แก้ไข / ลบ',
              ]}
              data={movies}
              renderRow={(movie, index) => (
                <tr
                  key={index}
                  className="border-t border-gray-700 hover:bg-white/5 transition text-[11px] sm:text-sm md:text-base"
                >
                  {/* โปสเตอร์ */}
                  <td className="px-4 py-3 flex items-center justify-center">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-16 h-24 object-cover rounded-md border border-white/20"
                    />
                  </td>

                  <td className="px-4 py-3 text-center">{movie.title}</td>
                  <td className="px-4 py-3 text-center">{movie.date}</td>
                  <td className="px-4 py-3 text-center">{movie.endDate}</td>
                  <td className="px-4 py-3 text-center">{movie.status}</td>
                  <td className="px-4 py-3 text-center  ">
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-3">
                      <EditMovie movie={movie} onUpdated={fetchMovies} />
                      <DeleteMovie
                        movieId={movie.id}
                        title={movie.title}
                        onDeleted={fetchMovies}
                      />
                    </div>
                  </td>
                </tr>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageMovie;
