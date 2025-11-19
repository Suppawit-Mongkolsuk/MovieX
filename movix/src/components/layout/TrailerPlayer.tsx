interface TrailerPlayerProps {
  url: string;
  title?: string;
}
// เเปลงลิงก์วิดีโอเป็นรูปเเบบ embed
const TrailerPlayer: React.FC<TrailerPlayerProps> = ({ url, title }) => {
  const getEmbedUrl = (url: string) => {
    // รองรับทั้งลิงก์ youtu.be และ watch?v= แล้วแปลงเป็น embed URL
    if (!url) return '';
    if (url.includes('youtu.be')) {
      const videoId = url.split('youtu.be/')[1];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('watch?v=')) {
      const videoId = url.split('watch?v=')[1];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  const embedUrl = getEmbedUrl(url);
  return (
    // ครอบ iframe ด้วย aspect-video เพื่อให้ responsive
    <div className="w-full aspect-video rounded-xl overflow-hidden shadow-lg">
      <iframe
        src={embedUrl}
        title={title || 'Movie Trailer'}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      ></iframe>
    </div>
  );
};

export default TrailerPlayer;
