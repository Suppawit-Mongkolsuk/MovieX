import { useEffect, useState } from 'react';
import { NavbarAdmin } from '../../components/base/NavbarAdmin';
import AddTheater from '../../components/layout/AddTheater';
import TheaterDetail from '../../components/layout/TheaterDetail';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Theater {
  id: string;
  name: string;
  locationId: string;
  type: string;
  rows: number;
  cols: number;
  status: string;
}

interface Location {
  id: string;
  name: string;
}

const ManageTheaters = () => {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  // โหลดข้อมูลโรงทั้งหมด
  const loadTheaters = async () => {
    try {
      const res = await axios.get(
        'https://68f0fcef0b966ad50034f883.mockapi.io/Theater'
      );
      setTheaters(res.data);
    } catch {
      toast.error('โหลดรายชื่อโรงไม่สำเร็จ');
    }
  };

  // 📌 โหลดสาขา
  const loadLocations = async () => {
    try {
      const res = await axios.get(
        'https://68f0fcef0b966ad50034f883.mockapi.io/locations'
      );
      setLocations(res.data);
    } catch {
      toast.error('โหลดสาขาไม่สำเร็จ');
    }
  };

  useEffect(() => {
    loadTheaters();
    loadLocations();
  }, []);

  const getLocationName = (id: string) =>
    locations.find((l) => l.id === id)?.name || '-';

  return (
    <div className="pt-16 px-6 pb-12">
      <NavbarAdmin />

      <div className="flex items-center justify-between mb-8 mt-8">
        <h1 className="text-2xl font-bold text-white">🎬 Manage Theaters</h1>

        <AddTheater onSuccess={loadTheaters} />
      </div>

      {/* Table Layout */}
      <div className="space-y-4">
        {theaters.map((th) => (
          <div
            key={th.id}
            className="bg-white/5 border border-white/10 p-4 rounded-lg backdrop-blur-sm shadow"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xl font-bold text-movix-gold">{th.name}</p>
                <p className="text-white/70 text-sm">
                  📍 {getLocationName(th.locationId)}
                </p>
                <p className="text-white/70 text-sm">🎥 {th.type}</p>
                <p className="text-white/70 text-sm">
                  {th.rows} แถว × {th.cols} ที่นั่ง
                </p>
              </div>

              <div className="flex gap-2 mt-4 sm:mt-0">
                <TheaterDetail theater={th} />
                <button className="px-4 py-2 bg-yellow-500 text-black rounded-md">
                  แก้ไข
                </button>
                <button className="px-4 py-2 bg-red-500 text-white rounded-md">
                  ลบ
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageTheaters;
