import { useEffect, useState } from 'react';
import axios from 'axios';
import * as Dialog from '@radix-ui/react-dialog';
import SeatIcon from '../base/Icon';
import Button from '../base/Button';
interface Seat {
  seatRow: string;
  seatCol: string;
  seatNumber: string;
  seatType?: string;
  seatPrice?: string;
}

interface theater {
  theater: {
    id: string;
    name?: string;
    rows?: number;
    cols?: number;
    status?: string;
    locationId?: string;
    type?: string;
  };
}
interface TheaterSeatItem {
  seat: Seat[];
}

export default function TheaterDetail({ theater }: theater) {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);

  // โหลดผังที่นั่งจาก MockAPI

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

  // Group by row
  const rows: Record<string, Seat[]> = seats.reduce(
    (acc: Record<string, Seat[]>, seat: Seat) => {
      const row: string = seat.seatRow;

      if (!acc[row]) {
        acc[row] = [];
      }

      acc[row].push(seat);

      return acc;
    },
    {} as Record<string, Seat[]>
  );

  if (loading) return <p className="text-white p-10">Loading...</p>;

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant="primary" size="md">
          ดูผังที่นั่ง
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

        <Dialog.Content
          className="
            fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            w-[95%] sm:w-auto sm:max-w-4xl
            max-h-[85vh]
            overflow-y-auto overflow-x-auto
            bg-white/10 border border-white/20
            rounded-xl p-4 sm:p-6 text-white shadow-xl
          "
        >
          <Dialog.Title className="text-2xl font-bold text-movix-gold mb-4">
            ผังที่นั่งโรง {theater.name}
          </Dialog.Title>
          <div className="bg-white/5 p-5 rounded-lg border border-white/10 w-full  overflow-x-auto">
            <div
              className="
                w-[600px] sm:w-full mx-auto
                mb-8 px-4 py-3
                bg-white/10 backdrop-blur-md
                border border-white/20
                rounded-lg
                text-center text-white font-semibold text-lg
                
              "
            >
              จอภาพยนตร์
            </div>

            {Object.keys(rows).length === 0 ? (
              <p className="text-center text-white/60 py-10">
                ยังไม่มีผังที่นั่งสำหรับโรงนี้
              </p>
            ) : (
              <>
                {(() => {
                  const maxCols = Math.max(
                    ...Object.values(rows).map((seats: Seat[]) => seats.length)
                  );

                  return Object.entries(rows)
                    .sort((a, b) => b[0].localeCompare(a[0])) // แสดง A อยู่ล่าง, Z อยู่บน
                    .map(([row, seats]: [string, Seat[]]) => (
                      <div key={row} className="flex items-center gap-4 mb-3">
                        {/* ชื่อแถวด้านซ้าย */}
                        <div className="w-6 text-right text-white/70 font-semibold">
                          {row}
                        </div>

                        {/* ที่นั่ง */}
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(${maxCols}, minmax(32px, 1fr))`,
                          }}
                          className="flex gap-2 place-items-center"
                        >
                          {seats
                            .sort(
                              (a: Seat, b: Seat) =>
                                Number(a.seatCol) - Number(b.seatCol)
                            )
                            .map((s: Seat) => {
                              const seatColor =
                                s.seatType === 'VIP' ? '#FFD700' : '#E50914';
                              return (
                                <div
                                  key={s.seatNumber}
                                  className="
                                    flex  items-center justify-center
                                    w-6 h-6 sm:w-10 sm:h-10
                                    rounded-md
                                    bg-white/10 backdrop-blur-md
                                    border border-white/30
                                    shadow-[0_0_4px_rgba(255,255,255,0.25)]
                                  "
                                >
                                  <SeatIcon
                                    color={seatColor}
                                    className="w-3 h-3 sm:w-6 sm:h-6"
                                  />
                                </div>
                              );
                            })}
                        </div>

                        {/* ชื่อแถวด้านขวา */}
                        <div className="w-6 text-left text-white/70 font-semibold">
                          {row}
                        </div>
                      </div>
                    ));
                })()}
              </>
            )}
          </div>

          <div className="flex justify-end mt-6">
            <Dialog.Close asChild>
              <Button variant="danger" size="md">
                ปิด
              </Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
