import Navbar from "../../components/base/Navbar";
import Banner from "../../components/layout/banner";
import Card from "../../components/base/Card";
import { movies } from "../../data/movies";

function Home() {
  return (
    <div className="pt-16"> 
      <Navbar />
      <Banner/>
      <h1 className="pt-8 ml-7 text-2xl font-semibold md:text-4xl">Now Showing</h1>
      <div className="pt-8 px-6 grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5  gap-4 max-w-7xl mx-auto">
        {movies.map((movie) => (
          <Card
            key={movie.id}
            title={movie.title}
            imageUrl={movie.poster}
            date={movie.date}
            time={movie.time}
          />
        ))}
      </div>
    </div>
  );
} 

export default Home;