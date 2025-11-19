import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Seat {
  seatNumber: string;
  seatPrice?: number;
}

interface SeatSummaryProps {
  selectedSeats: Seat[];
  onProceedToPayment?: () => void;
  isLoggedIn: boolean; // Add a prop to check login status
}

export default function SeatSummary({
  selectedSeats,
  onProceedToPayment,
  isLoggedIn,
}: SeatSummaryProps) {
  const totalPrice = selectedSeats.reduce(
    (sum, s) => sum + Number(s.seatPrice || 0),
    0
  ); // คำนวณราคารวมจากที่นั่งที่เลือกไว้

  const handleButtonClick = () => {
    if (onProceedToPayment) {
      onProceedToPayment();
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-white/15 bg-white/5 p-5 backdrop-blur-lg text-white/90 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="font-semibold text-sm text-white/70">SEATS</p>
          <p className="text-base sm:text-lg text-white">
            {selectedSeats.length > 0
              ? selectedSeats.map((s) => s.seatNumber).join(', ')
              : 'ยังไม่ได้เลือกที่นั่ง'}
          </p>
        </div>

        <div className="text-left sm:text-right">
          <p className="font-semibold text-sm text-white/70">TOTAL</p>
          <p className="text-xl font-bold text-movix-gold">
            {totalPrice.toLocaleString()} THB
          </p>
        </div>
      </div>

      {selectedSeats.length > 0 && (
        <button
          onClick={() => {
            if (!isLoggedIn) {
              toast.error('กรุณาเข้าสู่ระบบ');
              return;
            }
            handleButtonClick();
          }}
          className={`w-full rounded-3xl px-4 py-3 font-semibold transition shadow-[0_10px_30px_rgba(0,0,0,0.35)] ${
            isLoggedIn
              ? 'bg-gradient-to-r from-amber-400 to-amber-300 text-black hover:brightness-110'
              : 'bg-gray-500 text-gray-300 opacity-60'
          }`}
        >
          จ่ายตัง
        </button>
      )}
    </div>
  );
}
