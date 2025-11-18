import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import QRCodePopup from '../../components/layout/QRCodePopup';
import CardPaymentDialog from '../../components/layout/CardPaymentDialog';
import Button from '../../components/base/Button';
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
  const [showCardDialog, setShowCardDialog] = useState(false);
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

  const seatNames = selectedSeats.map((s: Seat) => s.seatNumber).join(', ');

  const handleConfirmPayment = async (paymentMethod: string) => {
    try {
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

      await Promise.all(
        selectedSeats.map((seat: Seat) =>
          axios.post('https://68f0fcef0b966ad50034f883.mockapi.io/seats', {
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
    <div className="text-white px-4 sm:px-6 pt-12 pb-16 max-w-5xl mx-auto space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-white/60">
          ชำระเงิน
        </p>
        <h1 className="text-3xl font-bold mt-1">Payment</h1>
      </div>

      <section className="bg-white/10 border border-white/15 rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row gap-6 shadow-[0_20px_45px_rgba(0,0,0,0.35)]">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full max-w-[220px] h-auto rounded-2xl border border-white/15 object-cover mx-auto"
        />

        <div className="flex-1 space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">
              Movie
            </p>
            <h2 className="text-2xl font-semibold text-movix-gold">
              {movie.title}
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 text-sm text-white/80">
            <div>
              <p className="text-white/60">สาขา</p>
              <p className="text-white font-medium">{loc.name}</p>
            </div>
            <div>
              <p className="text-white/60">โรง</p>
              <p className="text-white font-medium">
                {theater.name} ({theater.type})
              </p>
            </div>
            <div>
              <p className="text-white/60">วันที่</p>
              <p className="text-white font-medium">{showtime.date}</p>
            </div>
            <div>
              <p className="text-white/60">เวลา</p>
              <p className="text-white font-medium">
                {showtime.times.join(', ')}
              </p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-white/60 text-sm">ที่นั่งที่เลือก</p>
              <p className="text-white font-semibold mt-1">
                {seatNames || 'ยังไม่ได้เลือก'}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-white/60 text-sm">ราคารวม</p>
              <p className="text-2xl font-bold text-movix-gold">
                {totalPrice.toLocaleString()} THB
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">เลือกวิธีการชำระเงิน</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Button
              onClick={() => setShowCardDialog(true)}
              className="flex flex-col items-start gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400 transition text-left"
            >
              <span className="text-base font-semibold">
                บัตรเครดิต / เดบิต
              </span>
              <span className="text-sm text-white/70">
                รองรับ Visa, MasterCard และบัตรชั้นนำ
              </span>
            </Button>
            <Button
              onClick={() => setShowQR(true)}
              className="flex flex-col items-start gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400 transition text-left"
            >
              <span className="text-base font-semibold">QR PromptPay</span>
              <span className="text-sm text-white/70">
                สแกนจ่ายผ่านแอปธนาคารที่รองรับ
              </span>
            </Button>
          </div>
        </div>
      </section>

      {showQR && (
        <QRCodePopup
          amount={totalPrice}
          onConfirm={() => {
            setShowQR(false);
            handleConfirmPayment('qr');
          }}
        />
      )}

      <CardPaymentDialog
        open={showCardDialog}
        onOpenChange={setShowCardDialog}
        amount={totalPrice}
        onConfirm={() => {
          setShowCardDialog(false);
          handleConfirmPayment('card');
        }}
      />
    </div>
  );
};

export default Payment;
