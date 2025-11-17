interface SeatIconProps {
  color?: string; // ใช้สี custom
  type?: 'standard' | 'vip'; // ใช้ประเภทเก้าอี้
  className?: string;
}

export default function SeatIcon({
  color,
  type = 'standard',
  className = '',
}: SeatIconProps) {
  // 🎨 กำหนดสีอัตโนมัติตาม type
  const finalColor =
    color ||
    (type === 'vip'
      ? 'movix-gold' // VIP = ม่วง
      : 'movix-red'); // Standard = แดง (ค่าเดิม)

  return (
    <svg
      viewBox="0 0 24 24"
      className={`w-6 h-6 fill-${finalColor} ${className}`}
    >
      <path d="M7 10H17V3H7V10Z" />
      <path d="M5 21H7V10H5V21Z" />
      <path d="M17 21H19V10H17V21Z" />
      <path d="M7 21H17V12H7V21Z" />
    </svg>
  );
}
