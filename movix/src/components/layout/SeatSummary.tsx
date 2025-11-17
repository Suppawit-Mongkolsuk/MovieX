interface Seat {
  seatNumber: string;
  seatPrice?: number;
}

interface SeatSummaryProps {
  selectedSeats: Seat[];
}

export default function SeatSummary({ selectedSeats }: SeatSummaryProps) {
  const totalPrice = selectedSeats.reduce(
    (sum, s) => sum + Number(s.seatPrice || 0),
    0
  );

  return (
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
  );
}
