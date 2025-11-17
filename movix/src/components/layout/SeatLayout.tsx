import { useEffect, useState } from 'react';
import axios from 'axios';
import SeatIcon from '../base/Icon';

interface Seat {
  seatRow: string;
  seatCol: number;
  seatNumber: string;
  seatType?: string;
  seatPrice?: number;
  selected?: boolean;
}

interface TheaterProps {
  theater: {
    id: string;
    name?: string;
    rows?: number;
    cols?: number;
    status?: string;
    locationId?: string;
    type?: string;
  };
  onSelectChange?: (selected: Seat[]) => void;
}

interface TheaterSeatItem {
  seat: Seat[];
}

export default function SeatLayout({ theater, onSelectChange }: TheaterProps) {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSeats = async () => {
      try {
        const res = await axios.get(
          `https://68f0fcef0b966ad50034f883.mockapi.io/theaterSeats?TheaterId=${theater.id}`
        );

        const allSeats = (res.data as TheaterSeatItem[]).flatMap(
          (item) => item.seat
        );

        setSeats(allSeats);
        setLoading(false);
      } catch (err) {
        console.error('LOAD SEATS ERROR', err);
        setLoading(false);
      }
    };

    loadSeats();
  }, [theater.id]);

  // Group rows
  const rows = seats.reduce<Record<string, Seat[]>>((acc, seat) => {
    if (!acc[seat.seatRow]) acc[seat.seatRow] = [];
    acc[seat.seatRow].push(seat);
    return acc;
  }, {});

  const sortedRows = Object.keys(rows).sort().reverse();

  if (loading) return <p className="text-white p-10">Loading...</p>;

  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-[1200px] flex flex-col items-center">
        {/* SCREEN */}
        <div className="w-full mb-8 px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white font-semibold text-lg text-center">
          จอภาพยนตร์
        </div>

        {/* SEAT GRID */}
        <div className="space-y-2">
          {sortedRows.map((rowLabel) => {
            const rowSeats = rows[rowLabel].sort(
              (a, b) => Number(a.seatCol) - Number(b.seatCol)
            );

            return (
              <div
                key={rowLabel}
                className="flex items-center justify-center gap-2 sm:gap-3 w-full"
              >
                <span className="text-white/70 font-bold w-8 sm:w-10 text-center">
                  {rowLabel}
                </span>

                <div className="flex gap-2 sm:gap-3 justify-center px-2">
                  {rowSeats.map((s) => (
                    <button
                      key={s.seatNumber}
                      onClick={() => {
                        const updated = seats.map((seat) =>
                          seat.seatNumber === s.seatNumber
                            ? { ...seat, selected: !seat.selected }
                            : seat
                        );

                        setSeats(updated);

                        if (onSelectChange) {
                          onSelectChange(updated.filter((x) => x.selected));
                        }
                      }}
                      className={`p-1 rounded-md ${
                        s.selected
                          ? 'bg-white/30'
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      {s.selected ? (
                        <span className="text-green-400  w-8 h-8 flex items-center justify-center text-2xl ">
                          ✓
                        </span>
                      ) : (
                        <SeatIcon
                          color={s.seatType === 'VIP' ? '#FFD700' : '#E50914'}
                          className="w-8 h-8 opacity-80"
                        />
                      )}
                    </button>
                  ))}
                </div>

                <span className="text-white/70 font-bold w-8 sm:w-10 text-center">
                  {rowLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
