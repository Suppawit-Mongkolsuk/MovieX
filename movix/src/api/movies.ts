import type { Movie } from './typeMovie'

// 🔹 URL ของ MockAPI
const API_URL = 'https://68f0fcef0b966ad50034f883.mockapi.io/movies'

// 🔹 ฟังก์ชันหลัก: ดึงหนังทั้งหมด + อัปเดตสถานะอัตโนมัติ
export async function getMovies(): Promise<Movie[]> {
  try {
    const res = await fetch(API_URL)
    console.log('📡 Fetching from:', API_URL)
    const movies: Movie[] = await res.json()

    // ✅ แปลง id ให้เป็น string เพื่อกันปัญหา PUT 404
    const normalMovies = movies.map((m) => ({
      ...m,
      id: String(m.id),
    }))

    // 🔹 วันที่ปัจจุบัน 
    const today = new Date()

    // 🔹 วนลูปหนังทั้งหมดเพื่อเช็กสถานะ
    for (const m of normalMovies) {
      const start = new Date(m.date)
      const end = new Date(m.endDate)

      let newStatus = m.status

      // 🔹 เช็กสถานะตามวัน
      if (today < start) newStatus = 'Coming Soon'
      else if (today >= start && today <= end) newStatus = 'Now Showing'
      else newStatus = 'Ended'

      // 🔹 ถ้าสถานะเปลี่ยน → PUT กลับไปอัปเดตใน MockAPI
      if (newStatus !== m.status) {
        await fetch(`${API_URL}/${m.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...m, status: newStatus }),
        })
        console.log(`✅ Updated ${m.title} → ${newStatus}`)
      }
    }

    // 🔹 ส่งข้อมูลกลับไปให้หน้า Home ใช้ต่อ
    return normalMovies
  } catch (error) {
    console.error('❌ Error fetching movies:', error)
    return []
  }
}
