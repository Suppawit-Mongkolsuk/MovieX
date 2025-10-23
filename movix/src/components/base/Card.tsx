import Button from './Button';
export interface CardProps {
  id?: string | number;
  title?: string;
  imageUrl?: string;
  date?: string;
  time?: number | string;
  genre?: string;
  onClick?: () => void;
}
const Card: React.FC<CardProps> = ({
  title,
  imageUrl,
  date,
  time,
  genre,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className=" 
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
      <div className="w-full h-max-[300px] overflow-hidden rounded-2xl shadow-lg shadow-black/40">
        <img src={imageUrl} alt={title} className="object-cover" />
      </div>

      {/* Movie Info */}
      <div className="p-0 text-left">
        <div className="text-movix-gold mt-2 mb-1 font-semibold text-xs md:text-lg ">
          {date}
        </div>
        <div className="text-white font-semibold text-xs md:text-lg ">
          {title}
        </div>
        <div className="flex flex-wrap gap-2 mt-1 mb-4 ">
          <Button variant="underfined" size="xs" disabled>
            {time}mins
          </Button>
          <Button variant="underfined" size="xs" disabled>
            {genre}
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Card;
