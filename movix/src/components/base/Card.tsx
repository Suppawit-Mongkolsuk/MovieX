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
        <h3 className="text-movix-gold text-sm font-semibold mb-1">{date}</h3>
        <h3 className="text-white text-lg font-semibold leading-tight">{title}</h3>
        <p className="text-gray-300 text-sm font-medium mt-1">{time}</p>
      </div>
    </div>
  );

}
export default Card;