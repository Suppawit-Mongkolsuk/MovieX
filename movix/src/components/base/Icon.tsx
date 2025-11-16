interface SeatIconProps {
  color?: string; // เช่น movix-red, white, gold
  className?: string;
}

export default function SeatIcon({
  color = 'movix-red',
  className = '',
}: SeatIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`w-6 h-6 fill-${color} ${className}`}>
      <path d="M7 10H17V3H7V10Z" />
      <path d="M5 21H7V10H5V21Z" />
      <path d="M17 21H19V10H17V21Z" />
      <path d="M7 21H17V12H7V21Z" />
    </svg>
  );
}
