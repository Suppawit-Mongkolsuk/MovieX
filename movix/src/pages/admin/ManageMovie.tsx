import { useState, useEffect } from 'react';
import axios from 'axios';
import { NavbarAdmin } from '../../components/base/NavbarAdmin';
import AddMovieDialog from '../../components/layout/Addmoviex';
import { Table } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Movie } from '../../api/typeMovie';

const ManageMovie = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  // 📦 โหลดข้อมูลจาก MockAPI
  const fetchMovies = async () => {
    try {
      const res = await axios.get(
        'https://68f0fcef0b966ad50034f883.mockapi.io/movies'
      );
      setMovies(res.data);
    } catch (error) {
      console.error('โหลดข้อมูลไม่สำเร็จ:', error);
      toast.error('โหลดข้อมูลหนังไม่สำเร็จ');
    }
  };

  // 🚀 เรียก fetchMovies ตอนเปิดหน้า
  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className="pt-16 px-6">
      <NavbarAdmin />

      {/* ปุ่ม Add Movie (ส่ง onAdded เพื่อ refresh หลังเพิ่มเสร็จ) */}
      <AddMovieDialog onAdded={fetchMovies} />

      {/* ตารางหนัง (แค่ตัวอย่าง) */}
      <Table>
        {movies.map((movie) => (
          <tr key={movie.id}>
            <td>{movie.title}</td>
            <td>{movie.genre}</td>
            <td>{movie.status}</td>
          </tr>
        ))}
      </Table>
    </div>
  );
};

export default ManageMovie;
