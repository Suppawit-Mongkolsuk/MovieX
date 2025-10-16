// 📦 นำเข้า axios library สำหรับเรียก API (GET, POST, DELETE ฯลฯ)
import axios from "axios"

// 🏗️ สร้าง instance ของ axios พร้อมตั้ง baseURL ไว้
// เพื่อไม่ต้องพิมพ์ URL เต็ม ๆ ทุกครั้งที่เรียก API
export const api = axios.create({
  baseURL: 'https://68f0fcef0b966ad50034f883.mockapi.io', // 🔗 Base URL จาก MockAPI.io ห้ามเเก้ไข*******
})

// 🎬 ฟังก์ชันดึงข้อมูลหนังทั้งหมดจาก endpoint /movies
export const getMovies = async () => {
  // 📥 เรียก API แบบ GET ไปที่ https://.../movies
  const res = await api.get('/movies')

  // ✅ คืนค่าข้อมูลที่อยู่ใน res.data (เฉพาะ array ของหนัง)
  return res.data
}



