import { movies } from "../../data/movies";
import { Link } from "react-router-dom";

/*หน้าหลักของ user_v1 ทดลองmap Data ไม่ใช่ codeตัวเต็มเเก้ไขได้*/
const Home = () => {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-movie mb-6 text-movie-gold">🎬 Now Showing</h1>
            <div>
                <div className="grid grid-cols-1 justify-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 ">
                    {movies.map((movie) => (
                        <div key={movie.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 ">
                            <img src={movie.poster} alt={movie.title} className="w-full h-72 object-cover" />
                            <div className="p-4">
                                <h2 className="text-xl font-movie mb-2 text-movie-gold">{movie.title}</h2>
                                <p className="text-gray-600 text-sm mb-2">Genre: {movie.genre}</p>
                                <Link to={`/movies/${movie.id}`} className="inline-block mt-2 px-4 py-2 bg-movie-gold text-white rounded hover:bg-yellow-600 transition-colors duration-300">View Details</Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;


