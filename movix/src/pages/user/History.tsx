import { useEffect, useState } from 'react';
import axios from 'axios';
import type { User } from '../../api/typeuser';
import Navbar from '../../components/base/Navbar';
import * as Dialog from '@radix-ui/react-dialog';

interface Booking {
  id: string;
  userId: string;
  showtimeId: string;
  seats: string[];
  totalPrice: number;
  movieTitle: string;
  moviePoster: string;
  theaterName: string;
  locationName: string;
  date: string;
  time: string;
  paymentMethod: string;
  createdAt: string;
}

const History = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
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

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const res = await axios.get(
          `https://68f0fcef0b966ad50034f883.mockapi.io/booking?userId=${user.id}`
        );
        setBookings(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [user]);

  if (!user) {
    return (
      <div className="text-white text-center mt-12">กรุณาเข้าสู่ระบบก่อน</div>
    );
  }

  return (
    <div className="pt-16">
      <Navbar />
      <div className="text-white px-4 sm:px-6 pt-12 pb-12 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">ประวัติการจอง</h1>
        {bookings.length === 0 ? (
          <p>ไม่มีประวัติการจอง</p>
        ) : (
          [...bookings].reverse().map((booking) => (
            <div
              key={booking.id}
              className="bg-white/10 rounded-lg p-6 mb-6 flex flex-col md:flex-row gap-6 shadow-lg"
            >
              {/* Poster */}
              <div className="flex-shrink-0">
                {booking.moviePoster && (
                  <img
                    src={booking.moviePoster}
                    alt={booking.movieTitle}
                    className="w-40 h-60 object-cover rounded-lg shadow-md"
                  />
                )}
              </div>

              {/* Details */}
              <div className="flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-2 text-yellow-400">
                    {booking.movieTitle}
                  </h2>

                  <p className="text-gray-200 mb-1">
                    โรง:{' '}
                    <span className="text-white">{booking.theaterName}</span>
                    <span className="text-gray-300">
                      {' '}
                      ({booking.locationName})
                    </span>
                  </p>

                  <p className="text-gray-200 mb-1">
                    วันที่: <span className="text-white">{booking.date}</span>
                    เวลา: <span className="text-white">{booking.time}</span>
                  </p>

                  <p className="text-gray-200 mb-1">
                    ที่นั่ง:{' '}
                    <span className="text-white">
                      {booking.seats.join(', ')}
                    </span>
                  </p>

                  <p className="text-gray-200 mb-1">
                    ราคา:{' '}
                    <span className="text-green-400 font-semibold">
                      {booking.totalPrice} THB
                    </span>
                  </p>

                  <p className="text-gray-200">
                    วิธีชำระ:{' '}
                    <span className="text-white">{booking.paymentMethod}</span>
                  </p>
                  <Dialog.Root>
                    <Dialog.Trigger asChild>
                      <button className="mt-4 bg-yellow-500 text-black px-3 py-2 rounded-lg hover:bg-yellow-400 transition shadow-md w-fit">
                        แสดง QR Code
                      </button>
                    </Dialog.Trigger>
                    <Dialog.Portal>
                      <Dialog.Overlay className="fixed inset-0 bg-black/60" />
                      <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 w-80 text-center shadow-2xl">
                        <Dialog.Close className="absolute top-2 right-2 text-black text-lg">
                          ✕
                        </Dialog.Close>
                        <h2 className="text-lg font-semibold mb-4 text-black">
                          ตั๋วภาพยนตร์
                        </h2>
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
                            JSON.stringify({
                              movie: booking.movieTitle,
                              theater: booking.theaterName,
                              location: booking.locationName,
                              date: booking.date,
                              time: booking.time,
                              seats: booking.seats.join(', '),
                              price: booking.totalPrice,
                            })
                          )}`}
                          alt="QR Code"
                          className="w-64 h-64 mx-auto bg-white p-2 rounded-lg"
                        />
                        <p className="text-black mt-4 text-sm">
                          โปรดแสดง QR นี้เพื่อเช็คอินที่หน้าโรงภาพยนตร์
                        </p>
                      </Dialog.Content>
                    </Dialog.Portal>
                  </Dialog.Root>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;
