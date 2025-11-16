import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../../components/base/Button';
import * as Dialog from '@radix-ui/react-dialog';
import { toast } from 'react-toastify';

interface Movie {
  id: string;
  movieID: string; // id ที่ใช้เชื่อมกับ Showtime
  title: string;
}

interface Location {
  id: string;
  name: string;
}

interface Theater {
  id: string;
  name: string;
  type: string;
  locationId: string;
  status?: string;
}

interface ShowtimeRecord {
  id: string;
  movieID: string;
  locationId: string;
  theaterId: string;
  date: string;
  enddate: string;
  times: string[];
}

type DayTimeMap = {
  // key = วันที่เช่น "2025-11-14"
  [date: string]: {
    // key = theaterId, value = array เวลา เช่น ["13:00","15:00"]
    [theaterId: string]: string[];
  };
};

type TimeInputMap = {
  // key = `${date}__${theaterId}`
  [key: string]: {
    manual: string; // ช่องพิมพ์เอง
    picker: string; // ช่อง time picker
  };
};

export default function AddShowtime({ onSuccess }: { onSuccess: () => void }) {
  // ---------------------------------------------------------
  // state หลัก
  // ---------------------------------------------------------
  const [open, setOpen] = useState(false);

  // master data จาก MockAPI
  const [movies, setMovies] = useState<Movie[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [showtimes, setShowtimes] = useState<ShowtimeRecord[]>([]); // เอาไว้เช็คว่าโรงไหนถูกใช้แล้ว

  // selection จากฟอร์ม
  const [movieId, setMovieId] = useState(''); // movieID (string) ที่ใช้ join
  const [selectedLocationIds, setSelectedLocationIds] = useState<string[]>([]);
  const [selectedTheaterIds, setSelectedTheaterIds] = useState<string[]>([]);

  // วันที่เริ่ม – วันที่จบ (ใช้ generate วัน)
  const [date, setDate] = useState('');
  const [enddate, setEnddate] = useState('');

  // 🧠 Map เก็บเวลาแบบ "รายวัน × รายโรง"
  // เช่น {
  //   "2025-11-14": { "1": ["13:00","15:00"], "3": ["17:00"] },
  //   "2025-11-15": { "1": ["16:00"] }
  // }
  const [dayTimeMap, setDayTimeMap] = useState<DayTimeMap>({});

  // Map สำหรับเก็บค่า input ของแต่ละวัน×โรง (พิมพ์เอง + time picker)
  const [timeInputs, setTimeInputs] = useState<TimeInputMap>({});

  // ---------------------------------------------------------
  // โหลดข้อมูลจาก MockAPI
  // ---------------------------------------------------------
  useEffect(() => {
    const load = async () => {
      try {
        const m = await axios.get<Movie[]>(
          'https://68f0fcef0b966ad50034f883.mockapi.io/movies'
        );
        const l = await axios.get<Location[]>(
          'https://68f0fcef0b966ad50034f883.mockapi.io/locations'
        );
        const t = await axios.get<Theater[]>(
          'https://68f0fcef0b966ad50034f883.mockapi.io/Theater'
        );
        const s = await axios.get<ShowtimeRecord[]>(
          'https://68f0fcef0b966ad50034f883.mockapi.io/Showtime'
        );

        setMovies(m.data);
        setLocations(l.data);
        setTheaters(t.data);
        setShowtimes(s.data);
      } catch (err) {
        console.error('โหลดข้อมูลล้มเหลว:', err);
        toast.error('โหลดข้อมูลไม่สำเร็จ');
      }
    };

    load();
  }, []);

  // ---------------------------------------------------------
  // Helper: generate ช่วงวันที่ เช่น 1–3 => ["2025-11-01","2025-11-02","2025-11-03"]
  // ---------------------------------------------------------
  const generateRange = (start: string, end: string) => {
    const result: string[] = [];
    if (!start || !end) return result;

    const c = new Date(start);
    const last = new Date(end);

    // กัน invalid
    if (isNaN(c.getTime()) || isNaN(last.getTime())) return result;

    while (c <= last) {
      result.push(c.toISOString().slice(0, 10));
      c.setDate(c.getDate() + 1);
    }
    return result;
  };

  // ---------------------------------------------------------
  // toggle เลือกสาขา (checkbox)
  // ---------------------------------------------------------
  const toggleLocation = (id: string) => {
    setSelectedLocationIds((prev) => {
      if (prev.includes(id)) {
        const next = prev.filter((x) => x !== id);

        // เอาโรงที่อยู่ในสาขานั้นออกจาก selectedTheaterIds ด้วย
        setSelectedTheaterIds((prevTheaters) =>
          prevTheaters.filter((tid) => {
            const theater = theaters.find((t) => t.id === tid);
            return theater?.locationId !== id;
          })
        );

        return next;
      } else {
        return [...prev, id];
      }
    });
  };

  // ---------------------------------------------------------
  // toggle เลือกโรง (checkbox)
  // ---------------------------------------------------------
  const toggleTheater = (id: string) => {
    setSelectedTheaterIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // ---------------------------------------------------------
  // คำนวณว่าโรงไหนถูกใช้แล้วในช่วงวันที่เลือก (กันการชน)
  // ---------------------------------------------------------
  let takenTheaters: string[] = [];
  if (date && enddate) {
    const days = generateRange(date, enddate);
    const overlap = showtimes.filter((st) => days.includes(st.date));
    takenTheaters = overlap.map((st) => st.theaterId);
  }

  // filter โรงที่ status = active และไม่อยู่ใน takenTheaters
  const availableTheaters = theaters.filter(
    (t) => t.status === 'active' && !takenTheaters.includes(t.id)
  );

  // ---------------------------------------------------------
  // 🎯 เมื่อ date / enddate / selectedTheaterIds เปลี่ยน
  // ให้เตรียม dayTimeMap ให้มี key ครบ (แต่ไม่ลบเวลาที่มีอยู่แล้ว)
  // ---------------------------------------------------------
  useEffect(() => {
    if (!date || !enddate || selectedTheaterIds.length === 0) {
      // ถ้ายังไม่ได้เลือกครบ เคลียร์ map ไปก่อน
      setDayTimeMap({});
      setTimeInputs({});
      return;
    }

    const days = generateRange(date, enddate);

    setDayTimeMap((prev) => {
      const next: DayTimeMap = { ...prev };

      // เพิ่ม day / theater ที่ขาด
      days.forEach((d) => {
        if (!next[d]) next[d] = {};
        selectedTheaterIds.forEach((tid) => {
          if (!next[d][tid]) next[d][tid] = [];
        });
      });

      // ลบ day ที่อยู่นอกช่วงใหม่
      Object.keys(next).forEach((d) => {
        if (!days.includes(d)) {
          delete next[d];
          return;
        }

        // ลบ theater ที่ถูก unselect
        Object.keys(next[d]).forEach((tid) => {
          if (!selectedTheaterIds.includes(tid)) {
            delete next[d][tid];
          }
        });

        if (Object.keys(next[d]).length === 0) {
          delete next[d];
        }
      });

      return next;
    });
  }, [date, enddate, selectedTheaterIds]);

  // ---------------------------------------------------------
  // วันที่แบบไทย
  // ---------------------------------------------------------
  const formatDateTH = (d: string) => {
    if (!d) return d;
    try {
      return new Date(d).toLocaleDateString('th-TH', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return d;
    }
  };

  // ---------------------------------------------------------
  //  timeInputs
  // ---------------------------------------------------------
  const makeInputKey = (dateStr: string, theaterId: string) =>
    `${dateStr}__${theaterId}`;

  // ---------------------------------------------------------
  // เพิ่มเวลาให้ dayTimeMap จาก input (manual / picker)
  // ---------------------------------------------------------
  const addTimeToDayTheater = (dateStr: string, theaterId: string) => {
    const key = makeInputKey(dateStr, theaterId);
    const input = timeInputs[key] || { manual: '', picker: '' };

    // เอาค่าจาก manual ก่อน ถ้าไม่มีใช้จาก picker
    const rawValue = (input.manual || input.picker || '').trim();
    if (!rawValue) return;

    // เพิ่ม : ให้เวลา
    let value = rawValue.replace('.', ':');
    if (!value.includes(':') && value.length === 4) {
      value = `${value.slice(0, 2)}:${value.slice(2)}`;
    }

    setDayTimeMap((prev) => {
      const prevDay = prev[dateStr] || {};
      const prevTimes = prevDay[theaterId] || [];

      // กัน duplicate
      if (prevTimes.includes(value)) return prev;

      return {
        ...prev,
        [dateStr]: {
          ...prevDay,
          [theaterId]: [...prevTimes, value].sort(), // sort เวลาเล็กน้อย
        },
      };
    });

    // เคลียร์ input ทั้งสองช่อง
    setTimeInputs((prev) => ({
      ...prev,
      [key]: { manual: '', picker: '' },
    }));
  };

  // ---------------------------------------------------------
  // ลบเวลา 1 ช่องออกจาก dayTimeMap
  // ---------------------------------------------------------
  const removeTimeFromDayTheater = (
    dateStr: string,
    theaterId: string,
    time: string
  ) => {
    setDayTimeMap((prev) => {
      const prevDay = prev[dateStr];
      if (!prevDay) return prev;

      const prevTimes = prevDay[theaterId] || [];
      const nextTimes = prevTimes.filter((t) => t !== time);

      const nextDay = { ...prevDay, [theaterId]: nextTimes };
      if (nextTimes.length === 0) {
        delete nextDay[theaterId];
      }

      const nextAll = { ...prev, [dateStr]: nextDay };
      if (Object.keys(nextDay).length === 0) {
        delete nextAll[dateStr];
      }

      return nextAll;
    });
  };

  // ---------------------------------------------------------
  // helper: reset form
  // ---------------------------------------------------------
  const resetForm = () => {
    setMovieId('');
    setSelectedLocationIds([]);
    setSelectedTheaterIds([]);
    setDate('');
    setEnddate('');
    setDayTimeMap({});
    setTimeInputs({});
  };

  // ---------------------------------------------------------
  // 🟡 กดสร้างรอบหนัง (แบบใหม่: loop จาก dayTimeMap)
  // ---------------------------------------------------------
  const handleCreate = async () => {
    if (!movieId) {
      toast.error('กรุณาเลือกหนัง');
      return;
    }
    if (selectedLocationIds.length === 0) {
      toast.error('กรุณาเลือกสาขาอย่างน้อย 1 สาขา');
      return;
    }
    if (selectedTheaterIds.length === 0) {
      toast.error('กรุณาเลือกโรงอย่างน้อย 1 โรง');
      return;
    }
    if (!date || !enddate) {
      toast.error('กรุณาเลือกวันที่เริ่มและวันที่จบ');
      return;
    }

    // ต้องมีเวลาอย่างน้อย 1 ช่อง
    const hasAnyTime = Object.values(dayTimeMap).some((day) =>
      Object.values(day).some((times) => times.length > 0)
    );
    if (!hasAnyTime) {
      toast.error('กรุณาเพิ่มเวลาอย่างน้อย 1 รอบ');
      return;
    }

    // 🔍 เช็คว่าทุกวันต้องมีเวลาอย่างน้อย 1 รอบ
    for (const [dateStr, theatersOfDay] of Object.entries(dayTimeMap)) {
      let totalTimesInDay = 0;

      for (const times of Object.values(theatersOfDay)) {
        totalTimesInDay += times.length;
      }

      if (totalTimesInDay === 0) {
        toast.error(`วันที่ ${formatDateTH(dateStr)} ยังไม่ได้เพิ่มเวลาเลย`);
        return;
      }
    }

    toast.loading('กำลังสร้างรอบหนัง...');

    try {
      // loop วัน
      for (const [dateStr, theatersOfDay] of Object.entries(dayTimeMap)) {
        // loop โรงในวันนั้น ๆ
        for (const [theaterId, times] of Object.entries(theatersOfDay)) {
          if (!times || times.length === 0) continue;

          const theater = theaters.find((t) => t.id === theaterId);
          const locationId = theater?.locationId || '';

          await axios.post(
            'https://68f0fcef0b966ad50034f883.mockapi.io/Showtime',
            {
              movieID: movieId,
              locationId,
              theaterId,
              date: dateStr,
              enddate, // เก็บช่วงรวมไว้เหมือนเดิม ถ้าอยากให้เท่ากับ dateStr ก็เปลี่ยนได้
              times,
            }
          );
        }
      }

      // อัปเดตสถานะโรงทั้งหมดที่ถูกใช้ให้เป็น not_available
      const uniqueTheaterIds = Array.from(
        new Set(
          Object.values(dayTimeMap)
            .flatMap((day) => Object.keys(day))
            .filter(Boolean)
        )
      );

      for (const tid of uniqueTheaterIds) {
        await axios.put(
          `https://68f0fcef0b966ad50034f883.mockapi.io/Theater/${tid}`,
          { status: 'not_available' }
        );
      }

      toast.dismiss();
      toast.success('สร้างรอบหนังสำเร็จ!');

      resetForm();
      setOpen(false);
      onSuccess();
    } catch (err) {
      console.error('สร้างไม่สำเร็จ:', err);
      toast.error('สร้างรอบหนังไม่สำเร็จ');
    }
  };

  // ---------------------------------------------------------
  //  UI ส่วน Dialog
  // ---------------------------------------------------------
  const sortedDates = Object.keys(dayTimeMap).sort();

  return (
    <>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        {/* ปุ่มเปิดฟอร์ม */}
        <Dialog.Trigger asChild>
          <Button onClick={() => setOpen(true)} variant="secondary" size="lg">
            + Add Showtime
          </Button>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

          <Dialog.Content
            className="
              fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
              bg-white/10 border border-white/20 backdrop-blur-xl 
              rounded-xl p-6 w-full max-w-2xl text-white space-y-5
              max-h-[85vh] overflow-y-auto
            "
          >
            <h2 className="text-xl font-bold text-movix-gold">
              เพิ่มรอบหนัง (รายวัน × รายโรง)
            </h2>

            {/* เลือกหนัง */}
            <div>
              <label className="block mb-1">เลือกหนัง</label>
              <select
                className="w-full p-2 rounded bg-white/10 mt-1"
                value={movieId}
                onChange={(e) => setMovieId(e.target.value)}
              >
                <option value="">-- เลือกหนัง --</option>
                {movies.map((m) => (
                  <option key={m.id} value={m.movieID}>
                    {m.title}
                  </option>
                ))}
              </select>
            </div>

            {/* เลือกสาขา */}
            <div>
              <label className="block mb-1">เลือกสาขา</label>
              <div className="space-y-2 max-h-40 overflow-y-auto rounded border border-white/10 p-3 bg-white/5">
                {locations.map((l) => {
                  const checked = selectedLocationIds.includes(l.id);
                  return (
                    <label
                      key={l.id}
                      className="flex items-center gap-2 text-sm cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="accent-movix-gold"
                        checked={checked}
                        onChange={() => toggleLocation(l.id)}
                      />
                      <span>{l.name}</span>
                    </label>
                  );
                })}
                {locations.length === 0 && (
                  <p className="text-xs text-white/60">ยังไม่มีข้อมูลสาขา</p>
                )}
              </div>
            </div>

            {/* เลือกโรง */}
            <div>
              <label className="block mb-1">เลือกโรง</label>
              {selectedLocationIds.length === 0 ? (
                <p className="text-xs text-white/60">
                  กรุณาเลือกสาขาก่อน เพื่อเลือกโรง
                </p>
              ) : (
                <div className="space-y-4 max-h-56 overflow-y-auto rounded border border-white/10 p-3 bg-white/5">
                  {selectedLocationIds.map((locId) => {
                    const loc = locations.find((l) => l.id === locId);
                    const locTheaters = availableTheaters.filter(
                      (t) => t.locationId === locId
                    );

                    return (
                      <div key={locId}>
                        <p className="text-sm font-semibold text-movix-gold mb-1">
                          {loc?.name ?? `สาขา ${locId}`}
                        </p>
                        {locTheaters.length === 0 ? (
                          <p className="text-xs text-white/50">
                            ไม่มีโรงว่างในช่วงวันที่เลือกสำหรับสาขานี้
                          </p>
                        ) : (
                          <div className="space-y-1">
                            {locTheaters.map((t) => {
                              const checked = selectedTheaterIds.includes(t.id);
                              return (
                                <label
                                  key={t.id}
                                  className="flex items-center gap-2 text-xs cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    className="accent-movix-gold"
                                    checked={checked}
                                    onChange={() => toggleTheater(t.id)}
                                  />
                                  <span>
                                    {t.name} ({t.type})
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* วันที่เริ่ม / วันที่จบ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label>วันที่เริ่ม</label>
                <input
                  type="date"
                  className="w-full p-2 bg-white/10 rounded mt-1"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div>
                <label>วันที่จบ</label>
                <input
                  type="date"
                  className="w-full p-2 bg-white/10 rounded mt-1"
                  value={enddate}
                  onChange={(e) => setEnddate(e.target.value)}
                />
              </div>
            </div>

            {/* กำหนดเวลาแบบ รายวัน × รายโรง */}
            <div>
              <label className="block mb-1">กำหนดเวลา (รายวัน × รายโรง)</label>

              {!date || !enddate || selectedTheaterIds.length === 0 ? (
                <p className="text-xs text-white/60">
                  กรุณาเลือกวันที่เริ่ม / วันที่จบ + เลือกโรงก่อน
                </p>
              ) : sortedDates.length === 0 ? (
                <p className="text-xs text-white/60">
                  ยังไม่มีข้อมูลวันในช่วงนี้
                </p>
              ) : (
                <div className="space-y-4 max-h-80 overflow-y-auto rounded border border-white/10 p-3 bg-white/5">
                  {sortedDates.map((d) => {
                    const theatersOfDay = dayTimeMap[d] || {};
                    const theaterIds = Object.keys(theatersOfDay);

                    if (theaterIds.length === 0) return null;

                    return (
                      <div key={d} className="space-y-3">
                        {/* หัววัน */}
                        <p className="text-sm font-semibold text-movix-gold border-b border-white/10 pb-1">
                          {formatDateTH(d)}
                        </p>

                        {/* loop โรงในวันนั้น */}
                        {theaterIds.map((tid) => {
                          const theater = theaters.find((t) => t.id === tid);
                          if (!theater) return null;

                          const key = makeInputKey(d, tid);
                          const input = timeInputs[key] || {
                            manual: '',
                            picker: '',
                          };
                          const times = theatersOfDay[tid] || [];

                          return (
                            <div
                              key={tid}
                              className="rounded-lg bg-black/10 border border-white/10 p-3 space-y-2"
                            >
                              <p className="text-xs font-semibold">
                                {theater.name} ({theater.type})
                              </p>

                              {/* แสดงเวลาที่มีแล้ว */}
                              <div className="flex flex-wrap gap-2">
                                {times.length === 0 ? (
                                  <span className="text-[11px] text-white/50">
                                    ยังไม่มีเวลาสำหรับโรงนี้ในวันนี้
                                  </span>
                                ) : (
                                  times.map((t) => (
                                    <button
                                      key={t}
                                      type="button"
                                      onClick={() =>
                                        removeTimeFromDayTheater(d, tid, t)
                                      }
                                      className="px-3 py-1 rounded-full text-xs bg-white/20 hover:bg-red-500/80 hover:text-black transition flex items-center gap-1"
                                    >
                                      <span>{t}</span>
                                      <span className="text-[10px]">✕</span>
                                    </button>
                                  ))
                                )}
                              </div>

                              {/* ช่องใส่เวลา */}
                              <div className="flex flex-col md:flex-row gap-2 items-start md:items-end">
                                <div className="flex-1">
                                  <label className="block text-[11px] mb-1">
                                    พิมพ์เวลาเอง (เช่น 13.00 หรือ 13:00)
                                  </label>
                                  <input
                                    type="text"
                                    value={input.manual}
                                    onChange={(e) =>
                                      setTimeInputs((prev) => ({
                                        ...prev,
                                        [key]: {
                                          ...prev[key],
                                          manual: e.target.value,
                                        },
                                      }))
                                    }
                                    className="w-full p-2 rounded bg-white/10 text-sm"
                                    placeholder="เช่น 13.00"
                                  />
                                </div>

                                <div className="flex-1">
                                  <label className="block text-[11px] mb-1">
                                    หรือเลือกจาก Time Picker
                                  </label>
                                  <input
                                    type="time"
                                    value={input.picker}
                                    onChange={(e) =>
                                      setTimeInputs((prev) => ({
                                        ...prev,
                                        [key]: {
                                          ...prev[key],
                                          picker: e.target.value,
                                        },
                                      }))
                                    }
                                    className="w-full p-2 rounded bg-white/10 text-sm"
                                  />
                                </div>

                                <Button
                                  type="button"
                                  onClick={() => addTimeToDayTheater(d, tid)}
                                  className="bg-movix-gold text-black px-4 mt-2 md:mt-0"
                                >
                                  เพิ่ม
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ปุ่ม action */}
            <div className="flex justify-end gap-3 pt-3">
              <Dialog.Close asChild>
                <Button variant="danger" size="md" onClick={resetForm}>
                  ยกเลิก
                </Button>
              </Dialog.Close>
              <Button onClick={handleCreate} variant="primary" size="md">
                สร้างรอบหนัง
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
