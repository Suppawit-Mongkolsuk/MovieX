import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import QRCodePopup from '../../components/layout/QRCodePopup';
import type { Seat } from '../../api/typeseat';
import type { User } from '../../api/typeuser';

interface Showtime {
  id: string;
  movieID: string;
  locationId: string;
  theaterId: string;
  date: string;
  times: string[];
}

interface Movie {
  id: string;
  movieID: string;
  title: string;
  poster: string;
  time: number;
}

interface Location {
  id: string;
  name: string;
}

interface Theater {
  id: string;
  name: string;
  type: string;
}

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state as
    | {
        selectedSeats: Seat[];
        showtime: Showtime;
        movie: Movie;
        location: Location;
        theater: Theater;
        totalPrice: number;
      }
    | undefined;

  const [showQR, setShowQR] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          'https://68f0fcef0b966ad50034f883.mockapi.io/Login'
        );
        const loggedInUser = (res.data as User[]).find(
          (u: User) => u.isLogin === true
        );
        setUser(loggedInUser || null);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  //  ตรวจสอบข้อมูลหลังจาก Hooks ถูกเรียกแล้ว
  if (!data) return <div>ไม่มีข้อมูลการจอง</div>;
  if (!user) {
    navigate('/login');
    return null;
  }

  const {
    selectedSeats,
    showtime,
    movie,
    location: loc,
    theater,
    totalPrice,
  } = data;

  const handleConfirmPayment = async (paymentMethod: string) => {
    try {
      // ส่งไป booking
      await axios.post('https://68f0fcef0b966ad50034f883.mockapi.io/booking', {
        userId: user.id,
        showtimeId: showtime.id,
        seats: selectedSeats.map((s: Seat) => s.seatNumber),
        totalPrice,
        movieTitle: movie.title,
        moviePoster: movie.poster,
        theaterName: theater.name,
        locationName: loc.name,
        date: showtime.date,
        time: showtime.times.join(', '),
        paymentMethod,
        createdAt: new Date().toISOString(),
      });

      // ✅ Update seats by showtime — correct implementation
      await Promise.all(
        selectedSeats.map((seat: Seat) =>
          axios.post(`https://68f0fcef0b966ad50034f883.mockapi.io/seats`, {
            showtimeId: showtime.id,
            seatNumber: seat.seatNumber,
            seatPrice: seat.seatPrice,
            theaterSeatsId: theater.id,
            status: 'booked',
          })
        )
      );

      toast.success('การชำระเงินสำเร็จ!');
      navigate('/history');
    } catch (err) {
      console.error(err);
      toast.error('เกิดข้อผิดพลาดในการชำระเงิน');
    }
  };

  if (!selectedSeats || !showtime || !movie || !loc || !theater)
    return <div>ข้อมูลไม่ครบ</div>;

  return (
    <div className="text-white px-4 sm:px-6 pt-12 pb-12 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Payment</h1>

      {/* แสดงข้อมูลการจอง */}
      <div className="bg-white/10 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">รายการจอง</h2>
        <p>หนัง: {movie.title}</p>
        <p>สาขา: {loc.name}</p>
        <p>โรง: {theater.name}</p>
        <p>วันที่: {showtime.date}</p>
        <p>เวลา: {showtime.times.join(', ')}</p>
        <p>
          ที่นั่ง: {selectedSeats.map((s: Seat) => s.seatNumber).join(', ')}
        </p>
        <p>ราคารวม: {totalPrice} THB</p>
      </div>

      {/* ตัวเลือกการชำระ */}
      <div className="flex gap-4">
        <button
          onClick={() => handleConfirmPayment('card')}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          จ่ายด้วยบัตร
        </button>
        <button
          onClick={() => setShowQR(true)}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          จ่ายด้วย QR Code
        </button>
      </div>

      {showQR && (
        <QRCodePopup
          amount={totalPrice}
          onConfirm={() => {
            setShowQR(false);
            handleConfirmPayment('qr');
          }}
        />
      )}
    </div>
  );
};

export default Payment;
