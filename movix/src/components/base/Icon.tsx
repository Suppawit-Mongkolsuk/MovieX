interface SeatIconProps {
  color?: string;
  type?: 'standard' | 'vip';
  className?: string;
}

export default function SeatIcon({
  color,
  type = 'standard',
  className = '',
}: SeatIconProps) {
  // ใช้ hex จริง ไม่ใช่ tailwind class
  const finalColor = color || (type === 'vip' ? '#FFD700' : '#E50914'); // gold/red

  return (
    <svg
      viewBox="0 0 24 24"
      className={`w-6 h-6 ${className}`}
      fill={finalColor}
    >
      <path d="M7 10H17V3H7V10Z" />
      <path d="M5 21H7V10H5V21Z" />
      <path d="M17 21H19V10H17V21Z" />
      <path d="M7 21H17V12H7V21Z" />
    </svg>
  );
}
