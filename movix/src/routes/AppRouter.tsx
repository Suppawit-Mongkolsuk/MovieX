import {BrowserRouter,Routes,Route} from "react-router-dom";

/*สร้าง link เชื่อมกันในเเต่ละหน้าของ project */
/*CODE ตัวเต็มห้ามเเก้ไข*/

/*USER PAGES*/
import Home from "../pages/user/Home";
import MovieDetail from "../pages/user/MovieDetail";
import History from "../pages/user/History";
import Movie from "../pages/user/Movie";
import Payment from "../pages/user/Payment";
import Seat from "../pages/user/Seat";
import Ticket from "../pages/user/Ticket";

/*ADMIN PAGES*/                                                                                    
import ManageMovies from "../pages/admin/ManageMovie";
import ManageShowtime from "../pages/admin/ManageShowtime";
import ManageTheaters from "../pages/admin/ManageTheaters";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* User Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/movies" element={<Movie />} />
                <Route path="/moviedetail/:id" element={<MovieDetail />} />
                <Route path="/seat" element={<Seat />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/ticket" element={<Ticket />} />
                <Route path="/history" element={<History />} />

                {/* Admin Routes */}
                <Route path="/admin/movies" element={<ManageMovies />} />
                <Route path="/admin/showtimes" element={<ManageShowtime />} />
                <Route path="/admin/theaters" element={<ManageTheaters />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter;