import Card from "../../components/base/Card"
import { movies } from "../../data/movies"

const Home = () => {

return (
    <div className="min-h-screen lex justify-center items-center p-10">
        <h2 className="text-white text-3xl font-bold mb-8 flex items-center gap-2">
        🎬 Now Showing
        </h2>
        <div className="flex flex-wrap justify-center gap-8">
            {movies.map((movie) => (
                <Card 
                    key={movie.id}
                    title={movie.title}
                    imageUrl={movie.poster}
                    date={movie.date}
                    time={`${movie.time} mins`}
                    onClick={() => alert(`You clicked on ${movie.title}`)}
                />
            ))}
        </div>
    </div>
  )
}

export default Home
