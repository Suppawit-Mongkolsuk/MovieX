import { useParams } from 'react-router-dom';

export default function Seat() {
  const { showtimeId } = useParams();

  return (
    <div className="text-white">
      <h1>กำลังจองรอบ: {showtimeId}</h1>
    </div>
  );
}
