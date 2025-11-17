import { useEffect, useState } from 'react';
import { NavbarAdmin } from '../../components/base/NavbarAdmin';
import AddTheater from '../../components/layout/AddTheater';
import TheaterDetail from '../../components/layout/TheaterDetail';
import EditTheaterButton from '../../components/layout/EditTheaterButton';
import DeleteTheaterButton from '../../components/layout/DeleteTheaterButton';
import axios from 'axios';
import toast from 'react-hot-toast';
import FilterDropdown from '../../components/layout/FilterDropdown';

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
  const [filterLocation, setFilterLocation] = useState('all');

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

  //  โหลดสาขา
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

  const filteredTheaters =
    filterLocation === 'all'
      ? theaters
      : theaters.filter((t) => t.locationId === filterLocation);

  return (
    <div className="pt-16 px-6 pb-12">
      <NavbarAdmin />

      <div className="px-2 sm:px-4 md:px-12 mt-6 md:mt-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 md:mb-8">
          <h1 className="text-lg text-center sm:text-xl md:text-2xl font-bold  ">
            📋 รายชื่อหนังทั้งหมด
          </h1>
          <div className="w-full md:w-auto flex flex-col md:flex-row items-center justify-center md:justify-end gap-3">
            <FilterDropdown
              value={
                filterLocation === 'all'
                  ? 'ทั้งหมด'
                  : locations.find((l) => l.id === filterLocation)?.name || ''
              }
              items={[
                { label: 'ทั้งหมด', value: 'all' },
                ...locations.map((l) => ({
                  label: l.name,
                  value: l.id,
                })),
              ]}
              onChange={(value) => setFilterLocation(value)}
            />

            <AddTheater onSuccess={loadTheaters} />
          </div>
        </div>
      </div>

      {/* Table Layout */}
      <div className="space-y-4">
        {filteredTheaters.map((th) => (
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
                <EditTheaterButton theater={th} onSuccess={loadTheaters} />
                <DeleteTheaterButton
                  theaterId={th.id}
                  locationId={th.locationId}
                  onSuccess={loadTheaters}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageTheaters;
