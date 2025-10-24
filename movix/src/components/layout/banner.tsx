import postter from '../../assets/porter.png';
import postter2 from '../../assets/porter2.png';
import postter3 from '../../assets/porter3.png';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
const Banner = () => {
  return (
    <Carousel
      className="shadow-lg"
      autoPlay={true}
      infiniteLoop={true}
      interval={3000}
      stopOnHover={true}
      showStatus={false}
      showThumbs={false}
      showArrows={false}
    >
      <div>
        <img src={postter} alt="" />
      </div>
      <div>
        <img src={postter2} alt="" />
      </div>
      <div>
        <img src={postter3} alt="" />
      </div>
    </Carousel>
  );
};

export default Banner;
<div className="max-w-{1440px] max-h-[500px] mx-auto oject-cover flex justify-center">
  <img src={postter} alt=""></img>
</div>;
