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
    <div className="text-white px-4 sm:px-6 pt-16 pb-20 max-w-6xl mx-auto space-y-8">
      <div className="space-y-2 text-center sm:text-left">
        <p className="text-xs sm:text-sm uppercase tracking-[0.35em] text-white/50">
          ชำระเงิน
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="text-3xl sm:text-4xl font-bold">Payment</h1>
        </div>
      </div>

      <section className="bg-white/10 border border-white/15 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 lg:flex-row lg:items-center shadow-[0_20px_45px_rgba(0,0,0,0.35)]">
        <div className="flex justify-center">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-48 xs:w-56 sm:w-64 lg:w-56 rounded-2xl border border-white/15 object-cover shadow-[0_15px_40px_rgba(0,0,0,0.35)]"
          />
        </div>

        <div className="flex-1 space-y-5">
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

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] items-start">
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-xl font-semibold">เลือกวิธีการชำระเงิน</h3>
            <p className="text-sm text-white/60">
              รองรับทุกอุปกรณ์ เลือกวิธีที่คุณสะดวกที่สุด
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Button
              onClick={() => setShowCardDialog(true)}
              className="flex h-full w-full flex-col items-start gap-2 rounded-2xl border border-white/10 bg-white/5 p-4 text-left hover:border-amber-400"
            >
              <span className="text-base font-semibold">
                บัตรเครดิต / เดบิต
              </span>
              <span className="text-sm text-white/70">
                รองรับ Visa, MasterCard และอื่น ๆ
              </span>
            </Button>
            <Button
              onClick={() => setShowQR(true)}
              className="flex h-full w-full flex-col items-start gap-2 rounded-2xl border border-white/10 bg-white/5 p-4 text-left hover:border-amber-400"
            >
              <span className="text-base font-semibold">QR PromptPay</span>
              <span className="text-sm text-white/70">
                สแกนจ่ายผ่านแอปธนาคารได้ทันที
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
          onCancel={() => setShowQR(false)}
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
