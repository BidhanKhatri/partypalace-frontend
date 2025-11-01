import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import HeroSlideCard from "./HeroSlideCard";
import { useSelector } from "react-redux";

const HeroSlider = () => {
  const { partypalace } = useSelector((state) => state?.partypalace);

  return (
    <div className="bg-black py-8">
      <Swiper
        spaceBetween={16}
        slidesPerView={1} // default for mobile
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 16 }, // small tablets
          768: { slidesPerView: 3, spaceBetween: 20 }, // larger tablets
          1024: { slidesPerView: 4, spaceBetween: 24 }, // desktops
          1600: { slidesPerView: 5, spaceBetween: 32 }, // large screens
        }}
        modules={[Navigation, Autoplay, A11y]}
        navigation
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        loop={true}
        className="max-w-6xl mx-auto rounded-md relative"
      >
        {partypalace.length > 0 &&
          partypalace.map((pp, i) => (
            <SwiperSlide key={i} className="px-2 py-4 flex justify-center">
              <HeroSlideCard data={pp} />
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
};

export default HeroSlider;
