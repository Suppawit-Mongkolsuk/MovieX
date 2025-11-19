import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as Dialog from '@radix-ui/react-dialog';

interface Booking {
  id: string;
  movieTitle: string;
  date: string;
  time: string;
  seats: string[];
  amount: number;
}

const History: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          'https://68f0fcef0b966ad50034f883.mockapi.io/booking'
        );
        setBookings(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">ประวัติการจอง</h1>
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="bg-white/10 rounded-lg p-6 mb-6 flex flex-col sm:flex-row gap-6 shadow-lg w-full"
        >
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{booking.movieTitle}</h2>
            <p>วันที่: {booking.date}</p>
            <p>เวลา: {booking.time}</p>
            <p>ที่นั่ง: {booking.seats.join(', ')}</p>
            <p>ยอดชำระ: {booking.amount} บาท</p>
          </div>

          <button
            onClick={async () => {
              try {
                await axios.delete(
                  `https://68f0fcef0b966ad50034f883.mockapi.io/booking/${booking.id}`
                );
                setBookings((prev) => prev.filter((b) => b.id !== booking.id));
              } catch (err) {
                console.error(err);
              }
            }}
            className="mt-4 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition shadow-md w-fit"
          >
            ลบประวัติการจอง
          </button>

          <Dialog.Root
            open={open && selectedBooking?.id === booking.id}
            onOpenChange={setOpen}
          >
            {/* Dialog content here */}
          </Dialog.Root>
        </div>
      ))}
    </div>
  );
};

export default History;
