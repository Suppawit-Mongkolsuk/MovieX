import { useMemo, useState } from 'react';
import Navbar from '../../components/base/Navbar';

interface Suggestion {
  name: string;
  email: string;
  category: string;
  message: string;
  urgency: number;
}

const suggestionCategories = [
  'ฟีเจอร์ที่อยากได้',
  'ปัญหาที่เจอ',
  'ประสบการณ์ในโรงหนัง',
  'ข้อเสนอทั่วไป',
];

const About = () => {
  const [form, setForm] = useState<Suggestion>({
    name: '',
    email: '',
    category: suggestionCategories[0],
    message: '',
    urgency: 2,
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle');

  const canSubmit = useMemo(
    () => form.name.trim() && form.email.trim() && form.message.trim(),
    [form]
  );

  const handleChange = (key: keyof Suggestion, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || status === 'sending') return;
    setStatus('sending');

    setTimeout(() => {
      setStatus('done');
      setTimeout(() => setStatus('idle'), 2500);
      setForm({
        name: '',
        email: '',
        category: suggestionCategories[0],
        message: '',
        urgency: 2,
      });
    }, 1200);
  };

  return (
    <div className="pt-16">
      <Navbar />
      <div className="min-h-screen  text-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-20 sm:px-6">
          <header className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur">
            <p className="text-sm uppercase tracking-[0.4em] text-white/60">
              MOVIX FEEDBACK LAB
            </p>
            <h1 className="mt-4 text-3xl font-bold sm:text-4xl">
              ช่องทางเสนอไอเดียถึงทีม MOVIX
            </h1>
            <p className="mt-3 text-white/70">
              เขียนข้อความถึงผู้ดูแลระบบได้อย่างอิสระ
              ทีมงานจะใช้กล่องนี้รวบรวมสิ่งที่ผู้ใช้เห็นและอยากให้ปรับปรุง
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-white/70">
              <span className="rounded-full border border-white/20 px-4 py-1">
                🧠 แชร์ไอเดีย
              </span>
              <span className="rounded-full border border-white/20 px-4 py-1">
                🔧 แจ้งปัญหา
              </span>
              <span className="rounded-full border border-white/20 px-4 py-1">
                🤝 ติดต่อแอดมิน
              </span>
            </div>
          </header>

          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_25px_80px_rgba(0,0,0,0.45)] backdrop-blur"
            >
              <div className="flex flex-col gap-5">
                <div>
                  <label className="text-sm text-white/70">
                    ชื่อที่ใช้ติดต่อ
                  </label>
                  <input
                    className="mt-1 w-full rounded-2xl border border-white/20 bg-black/30 px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-300"
                    placeholder="เช่น เติ้ล ผู้ทดสอบระบบ"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm text-white/70">
                    อีเมลสำหรับให้ทีมตอบกลับ
                  </label>
                  <input
                    className="mt-1 w-full rounded-2xl border border-white/20 bg-black/30 px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-300"
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm text-white/70">
                      หัวข้อที่อยากฝากไว้
                    </label>
                    <select
                      className="mt-1 w-full rounded-2xl border border-white/20 bg-black/30 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-300"
                      value={form.category}
                      onChange={(e) => handleChange('category', e.target.value)}
                    >
                      {suggestionCategories.map((item) => (
                        <option
                          key={item}
                          value={item}
                          className="bg-black text-white"
                        >
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-white/70">
                    ข้อความถึงแอดมิน
                  </label>
                  <textarea
                    className="mt-1 h-36 w-full rounded-2xl border border-white/20 bg-black/30 px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-300"
                    placeholder="เล่าให้เต็มที่ เช่น ฟีเจอร์ที่อยากเพิ่ม ปัญหาที่อยากให้ตาม หรือบรรยากาศในโรงหนัง"
                    value={form.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={!canSubmit || status === 'sending'}
                  className="rounded-2xl bg-gradient-to-r from-amber-400 to-red-500 px-4 py-3 text-center text-base font-semibold text-black shadow-[0_15px_40px_rgba(251,191,36,0.3)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {status === 'sending'
                    ? 'กำลังส่งให้แอดมิน...'
                    : status === 'done'
                    ? 'ส่งแล้ว ขอบคุณมาก!'
                    : 'ส่งข้อความถึงแอดมิน'}
                </button>
              </div>
            </form>

            <aside className="rounded-3xl border border-white/10 p-6 shadow-[0_25px_60px_rgba(0,0,0,0.4)] backdrop-blur-lg">
              <p className="text-sm uppercase tracking-[0.3em] text-white/50">
                แอดมินจะเห็นอะไร
              </p>
              <h2 className="mt-2 text-2xl font-semibold">
                ตัวอย่างการ์ดที่ทีม MOVIX รับเรื่อง
              </h2>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
                  <p className="text-white/60">ผู้ส่งล่าสุดจากแบบฟอร์มนี้</p>
                  <p className="mt-2 text-base font-semibold text-white">
                    {canSubmit
                      ? form.name || 'ผู้ใช้งาน MOVIX'
                      : 'ผู้ใช้งาน MOVIX'}
                  </p>
                  <p className="text-white/60">หัวข้อ: {form.category}</p>
                  <p className="mt-3 text-white/80 line-clamp-3">
                    {form.message || 'รอข้อความจากผู้ใช้งาน...'}
                  </p>
                  <div className="mt-3 flex justify-between text-xs text-white/60">
                    <span>ระดับความเร่งด่วน {form.urgency}/5</span>
                    <span>สถานะ: กำลังรอแอดมินอ่าน</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
