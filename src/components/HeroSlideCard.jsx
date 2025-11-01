import React from "react";
import Banner2 from "../assets/images/banner2.jpg";

const HeroSlideCard = ({data}) => {
  return (
    <div className="bg-white/60 backdrop-blur-2xl h-44 rounded-md overflow-hidden shadow-md relative">
      <img
        src={data.images[0]}
        alt={data.name}
        className="w-full h-full object-cover"
        style={{ filter: "brightness(60%)" }}
      />
      <p className="font-bold text-xl absolute top-2 left-2 text-neutral-100">
        {data.name}
      </p>
      <p className="font-semibold text-sm absolute top-10 left-2 text-neutral-100 truncate max-w-32">
       {data.description}
      </p>
    </div>
  );
};

export default HeroSlideCard;
