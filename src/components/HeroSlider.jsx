import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import HeroSlideCard from "./HeroSlideCard";
import { useSelector } from "react-redux";

const HeroSlider = () => {
  const { partypalace } = useSelector((state) => state?.partypalace);
  return (
    <Swiper
      spaceBetween={0}
      slidesPerView={5}
      modules={[Navigation, Autoplay]}
      navigation
      autoplay={{ delay: 1000, disableOnInteraction: false }}
      className="bg-black max-w-6xl mx-auto rounded-md "
    >
      {partypalace.length > 0 &&
        partypalace?.map((pp, i) => (
          <SwiperSlide key={i} className="px-2 py-4 ">
            <HeroSlideCard data={pp} />
          </SwiperSlide>
        ))}
    </Swiper>
  );
};

export default HeroSlider;
