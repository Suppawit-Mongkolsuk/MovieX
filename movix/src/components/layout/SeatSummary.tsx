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
  );

  const handleButtonClick = () => {
    if (onProceedToPayment) {
      onProceedToPayment();
    }
  };

  return (
    <>
      <div className="mt-6 p-4 bg-white/10 rounded-lg text-white flex justify-between">
        <div>
          <p className="font-bold text-lg">SEATS:</p>
          <p>
            {selectedSeats.length > 0
              ? selectedSeats.map((s) => s.seatNumber).join(', ')
              : '-'}
          </p>
        </div>

        <div className="text-right">
          <p className="font-bold text-lg">Total Price:</p>
          <p>{totalPrice} THB</p>
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
          className={`mt-4 px-4 py-2 rounded-lg w-full transition ${
            isLoggedIn
              ? 'bg-yellow-500 text-white hover:bg-amber-600 cursor-pointer'
              : 'bg-gray-500 text-gray-300 opacity-50'
          }`}
        >
          จ่ายตัง
        </button>
      )}
    </>
  );
}
