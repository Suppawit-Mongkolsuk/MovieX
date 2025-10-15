
interface CardProps {
  title : string;
  imageUrl : string;
  date : string;
  time: number | string;
  onClick?: () => void;
};
const Card: React.FC<CardProps> = ({ title, imageUrl, date, time , onClick }) => {
  return (
    <div
      onClick={onClick}
      className=" 
        max-w-[180px] sm:max-w-[200px] md:max-w-[220px] lg:max-w-[240px]
        rounded-2xl 
        overflow-hidden 
        hover:scale-105 
        transition-transform 
        duration-300 
        ease-out 
        cursor-pointer
      "
    >
      {/* Movie Poster */}
      <div className="w-full aspect-[2/3] overflow-hidden rounded-2xl shadow-lg shadow-black/40">
        <img
          src={imageUrl}
          alt={title}
          className="object-cover"
        />
      </div>

      {/* Movie Info */}
      <div className="p-3 text-left">
        <div className="text-movix-gold mb-1 font-semibold text-xs md:text-lg ">{date}</div>
        <div className="text-white font-semibold text-xs md:text-lg ">{title}</div>
        <div className="text-gray-400 text-xs md:text-sm">Duration: {time} mins</div>
      </div>
    </div>
  );

}
export default Card;