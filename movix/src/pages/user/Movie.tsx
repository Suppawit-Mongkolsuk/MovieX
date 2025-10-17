import { useState,useEffect} from "react";
import { getMovies } from "../../api/movies";
import type { Movie } from "../../api/typeMovie";
import Navbar from "../../components/base/Navbar";
import Card from "../../components/base/Card";



function Movies() {
    const [movies, setmovies] = useState<Movie[]>([]);
    
    useEffect(() => {
        const loadMovies = async () => {
            const data = await getMovies();
            setmovies(data);
        }
        loadMovies();
    },[]);
    return(
        <div className="pt-16">
        <Navbar/>
        <h1 className="pt-8 mb-3 text-2xl font-semibold flex justify-center md:text-4xl">🎬 Now Showing</h1>
        <div className="pt-8 px-6 mb-5 grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4  gap-4 max-w-7xl mx-auto">
            {movies.filter(m => m.status === "Now Showing").map((movie) => (
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
    )
}

export default Movies;
