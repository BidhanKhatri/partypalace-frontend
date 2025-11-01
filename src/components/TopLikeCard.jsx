import React from "react";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";

const TopLikeCard = ({
  partyPalaceId,
  name,
  location,
  images,
  totalLikes,
  category,
}) => {
  return (
    <div className="flex flex-col">
      <Link
        to={`/booking/${partyPalaceId}`}
        key={partyPalaceId}
        className="bg-neutral-200  rounded-lg h-[250px] w-full  flex flex-col items-center justify-center gap-2 group "
      >
        <div className="bg-neutral-100 w-full h-full rounded-md overflow-hidden">
          <img
            src={images[0] || "https://via.placeholder.com/400"}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300 ease-in-out"
          />
        </div>
      </Link>
      <div className="flex justify-between items-center">
        <div className=" w-1/2 h-4 rounded-md mt-2 font-semibold text-white">{name} </div>
        <div className=" w-1/3 h-4 rounded-md mt-2 flex items-center justify-end gap-2">
          {" "}
          <FaHeart className="text-red-500" /> <span className="text-white"> {totalLikes}</span>
        </div>
      </div>
      <div className=" w-full h-4 rounded-md mt-2 flex items-center justify-between text-white">
        <span>{location}</span>{" "}
        <span className=" flex items-center gap-2 text-xs  ">
          {category.map((cat, i) => (
            <span
              key={i}
              className="rounded-md bg-neutral-200 px-2 py-0.5 text-neutral-700 text-center"
            >
              {cat}{" "}
            </span>
          ))}
        </span>{" "}
      </div>
    </div>
  );
};

export default TopLikeCard;
