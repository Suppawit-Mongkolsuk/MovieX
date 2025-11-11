import { useState } from 'react';
import Button from '../base/Button';
import * as Dialog from '@radix-ui/react-dialog';

interface UploadImageProps {
  onUpload: (url: string) => void; // callback ฟังก์ชัน: ส่ง URL ของรูปกลับไปให้ component แม่ (เช่น AddMovieDialog หรือ Profile)
  uploadPreset?: string; //  ใช้สำหรับตั้งค่า upload preset ของ Cloudinary (สามารถเปลี่ยนได้ในอนาคต)
  label?: string; // ข้อความ label แสดงด้านบน เช่น "อัปโหลดโปสเตอร์หนัง" หรือ "เลือกรูปโปรไฟล์"
}

export default function UploadImage({
  onUpload,
  uploadPreset = 'movix_upload',
  label = 'เลือกรูปภาพ',
}: UploadImageProps) {
  //  เก็บไฟล์ที่ผู้ใช้เลือก
  const [file, setFile] = useState<File | null>(null);
  // ใช้สำหรับโชว์สถานะระหว่างอัปโหลด
  const [uploading, setUploading] = useState(false);
  // ใช้สำหรับแสดง preview ของรูปก่อนอัปโหลด
  const [preview, setPreview] = useState<string | null>(null);

  // เมื่อผู้ใช้เลือกไฟล์จากเครื่อง (input type="file")
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]; // ดึงไฟล์แรกที่เลือกมา
    if (selectedFile) {
      setFile(selectedFile); // เก็บไฟล์ไว้ใน state
      setPreview(URL.createObjectURL(selectedFile)); // สร้าง preview URL ชั่วคราวไว้โชว์
    }
  };

  // ☁️ ฟังก์ชันอัปโหลดรูปขึ้น Cloudinary
  const handleUpload = async () => {
    if (!file) return; // ถ้ายังไม่มีไฟล์ให้ return ออก
    setUploading(true); // เริ่มอัปโหลด → เปลี่ยน state เป็น true เพื่อแสดงสถานะ loading

    try {
      // 🧾 เตรียมข้อมูลสำหรับส่งไป Cloudinary
      const formData = new FormData();
      formData.append('file', file); // แนบไฟล์จริง
      formData.append('upload_preset', uploadPreset); // ใส่ preset ที่ตั้งไว้ใน Cloudinary Dashboard

      // 🚀 ส่งคำขอ POST ไปยัง Cloudinary API
      const res = await fetch(
        'https://api.cloudinary.com/v1_1/da1kj73c0/image/upload',
        {
          method: 'POST',
          body: formData,
        }
      );

      // 📬 รับข้อมูลที่ตอบกลับมาเป็น JSON
      const data = await res.json();
      const imageUrl = data.secure_url; // URL จริงของรูปภาพหลังอัปโหลดเสร็จ

      // 🔁 ส่ง URL กลับไปยัง component แม่ (เช่นให้ฟอร์ม AddMovie เอาไปใช้ใน movie.poster)
      onUpload(imageUrl);

      // 🧹 เคลียร์ค่าต่าง ๆ หลังอัปโหลดเสร็จ
      setFile(null);
      setPreview(null);
    } catch (error) {
      // ⚠️ ถ้ามีปัญหาให้โชว์ใน console + แจ้งเตือนผู้ใช้
      console.error('อัปโหลดไม่สำเร็จ:', error);
      alert('อัปโหลดรูปไม่สำเร็จ โปรดลองอีกครั้ง');
    } finally {
      // ✅ เปลี่ยนสถานะกลับเป็นปกติ
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 text-white">
      {/* 🏷️ แสดง label ของฟอร์ม (ถ้าไม่ได้ส่งมาก็จะใช้ค่าเริ่มต้น) */}
      <p className="text-sm opacity-70">{label}</p>

      {/* 🖼️ ถ้ามี preview ให้โชว์ภาพที่ผู้ใช้เลือกไว้ */}
      {preview && (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-40 h-60 object-cover rounded-md border border-gray-600"
          />
          {/*  ปุ่มเล็ก ๆ สำหรับลบรูปออกก่อนอัปโหลด */}
          <button
            onClick={() => {
              setFile(null);
              setPreview(null);
            }}
            className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
          >
            ✕
          </button>
        </div>
      )}

      {/* 📁 ช่องเลือกไฟล์จากเครื่อง */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-300
        file:mr-4 file:py-2 file:px-4
        file:rounded-md file:border-0
        file:text-sm file:font-semibold
        file:bg-movix-gold file:text-black
        hover:file:bg-yellow-400"
      />

      {/* ☁️ ปุ่มกดอัปโหลด */}
      <div className="flex gap-3 mt-5">
        <Button
          variant="primary"
          size="md"
          onClick={handleUpload}
          disabled={!file || uploading} // ถ้าไม่มีไฟล์หรือกำลังอัปโหลดอยู่ → ปุ่มจะกดไม่ได้
          className=" hover:bg-green-800 disabled:opacity-50"
        >
          {/* 🔄 เปลี่ยนข้อความบนปุ่มระหว่างอัปโหลด */}
          {uploading ? 'กำลังอัปโหลด...' : 'อัปโหลด'}
        </Button>
        <Dialog.Close asChild>
          <Button variant="danger" size="md">
            ยกเลิก
          </Button>
        </Dialog.Close>
      </div>
    </div>
  );
}
