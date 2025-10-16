import { useEffect,useState } from "react";
import Navbar from "../../components/base/Navbar";
import Banner from "../../components/layout/banner";
import Card from "../../components/base/Card";
import { getMovies } from "../../api/movies";
import type { Movie } from "../../api/typeMovie";

function Home() {
  const [movies, setGetMovies] = useState<Movie[]>([]); // ✅ สร้าง state เก็บ array หนัง

  useEffect(() => {
    const loadMovies= async () => {
      const data = await getMovies(); // ✅ เรียก API จาก MockAPI
      setGetMovies(data); // ✅ เก็บข้อมูลใน state
    }
    loadMovies();// ✅ เรียกฟังก์ชันตอนหน้าโหลด
  }, []);
  return (  
    <div className="pt-16"> 
      <Navbar />
      <Banner/>
      <h1 className="pt-8 ml-7 text-2xl font-semibold md:text-4xl">🎬 Now Showing</h1>
      <div className="pt-8 px-6 grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5  gap-4 max-w-7xl mx-auto">
        {movies.map((movie) => (
          <Card
            key={movie.id}
            title={movie.title}
            imageUrl={movie.poster}
            date={movie.date}
            time={movie.time}
            genre={movie.genre}
          />
        ))}
      </div>
    </div>
  );
} 

export default Home;