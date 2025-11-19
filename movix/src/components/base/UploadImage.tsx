import { useState } from 'react';
import type { ReactNode } from 'react';
import Button from '../base/Button';
import * as Dialog from '@radix-ui/react-dialog';
import { toast } from 'react-toastify';

type UploadImageProps = {
  onUpload: (url: string) => void; // ส่ง URL กลับไปให้ parent
  uploadPreset?: string; // ชื่อ preset ของ Cloudinary
  label?: string; // ข้อความ label
  auto?: boolean; // เลือกแล้วอัปโหลดเองเลย? (default: true)
  showActions?: boolean; // แสดงปุ่มในตัวคอมโพเนนต์ไหม? (default: false)
  onCancel?: () => void; // callback ตอนกดยกเลิก (ถ้าใช้ปุ่มในตัว)
  /** ให้ parent สร้างปุ่มเอง โดยเราจะส่ง api (upload/clear/uploading/hasFile/preview) ให้ */
  renderActions?: (api: {
    upload: () => void;
    clear: () => void;
    uploading: boolean;
    hasFile: boolean;
    preview: string | null;
  }) => ReactNode;
};

export default function UploadImage({
  onUpload,
  uploadPreset = 'movix_upload',
  label = 'เลือกรูปภาพ',
  auto = true,
  showActions = false,
  renderActions,
}: UploadImageProps) {
  // เก็บไฟล์ที่เลือกไว้ใน state พร้อมสถานะอัปโหลดและรูป preview
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  // อัปโหลดขึ้น Cloudinary
  const upload = async (targetFile?: File) => {
    const fileToUpload = targetFile || file;
    if (!fileToUpload) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', fileToUpload);
      formData.append('upload_preset', uploadPreset);

      // ยิงตรงไปที่ Cloudinary REST API
      const res = await fetch(
        'https://api.cloudinary.com/v1_1/da1kj73c0/image/upload',
        { method: 'POST', body: formData }
      );
      const data = await res.json();
      console.log('Cloudinary response:', data);
      const url: string | undefined = data.secure_url;
      if (url) {
        // ส่ง url กลับให้ parent
        onUpload(url);
        toast.success('อัปโหลสำเร็จ');
      } else {
        toast.error('ไม่พบ URL รูปภาพจาก Cloudinary');
      }
    } catch (err) {
      console.error('อัปโหลดไม่สำเร็จ:', err);
      toast.error('อัปโหลดไม่สำเร็จ');
    } finally {
      setUploading(false);
    }
  };

  // ล้างไฟล์
  const clear = () => {
    setFile(null);
    setPreview(null);
  };

  // เมื่อเลือกไฟล์
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);

    if (auto && f) {
      // ถ้าตั้ง auto = true ก็อัปโหลดทันทีหลังเลือก
      await upload(f); // ส่งไฟล์เข้า upload โดยตรง
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 text-white">
      <p className="text-sm opacity-70">{label}</p>

      {preview ? (
        <img
          src={preview}
          alt="preview"
          className="w-40 h-60 object-cover rounded-md border border-gray-600"
        />
      ) : (
        <p className="text-gray-400 italic text-sm">กรุณาเลือกรูปภาพ</p>
      )}

      {/* ปุ่มเลือกไฟล์ */}
      <label
        htmlFor="file-upload"
        className="cursor-pointer bg-movix-gold text-black font-semibold px-6 py-2 rounded-lg hover:bg-yellow-400 transition-all "
      >
        เลือกไฟล์
      </label>
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* ทางเลือกสำหรับปุ่ม */}
      {renderActions
        ? // ถ้า parent ส่ง renderActions มา จะยก control ให้ภายนอกสร้างปุ่มเอง
          renderActions({ upload, clear, uploading, hasFile: !!file, preview })
        : showActions &&
          !auto && (
            // โหมด fallback: แสดงปุ่มอัปโหลด/ล้าง/ยกเลิกในคอมโพเนนต์
            <div className="flex gap-3 mt-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => upload()}
                disabled={!file || uploading}
              >
                {uploading ? 'กำลังอัปโหลด...' : 'อัปโหลด'}
              </Button>
              <Button variant="secondary" size="md" onClick={clear}>
                ล้างไฟล์
              </Button>
              <Dialog.Close asChild>
                <Button variant="danger" size="md">
                  ยกเลิก
                </Button>
              </Dialog.Close>
            </div>
          )}
    </div>
  );
}
