import React, { useContext, useState } from "react";
import userContext from "../context/userContext";
import VenueCard from "../components/VenueCard";
import { useSelector } from "react-redux";
import { FaExclamationTriangle } from "react-icons/fa";
import BeatLoader from "react-spinners/BeatLoader";
import FilterSearch from "../components/FilterSearch";

const SearchPage = () => {
  const { searchData, loading } = useContext(userContext);
  const { userId } = useSelector((state) => state?.user);
  const [color] = useState("#FBAD34");

  return (
    <section className="relative max-w-7xl mx-auto mt-14 flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden ">
      {/* Background glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-600/20 via-orange-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 left-1/3 w-80 h-80 bg-gradient-to-b from-orange-700/15 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      {/* Sidebar */}
      <div className="w-full md:w-1/4 h-full flex-shrink-0 overflow-y-auto relative z-10">
        <FilterSearch />
      </div>

      {/* Results */}
      <div className="w-full md:w-3/4 h-full flex-shrink-0 overflow-y-auto relative z-10">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <BeatLoader color="#FBAD34" size={24} />
          </div>
        ) : searchData.length === 0 ? (
          <div className="flex items-center justify-center h-full px-4">
            <span className="bg-slate-800/60 text-orange-400 px-8 py-3 rounded-lg font-semibold flex items-center gap-2 border border-orange-500/50 backdrop-blur-md shadow-lg">
              <FaExclamationTriangle />
              No results found
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
            {searchData.map((sd) => (
              <VenueCard
                key={sd._id}
                name={sd.name}
                description={sd.description}
                location={sd.location}
                capacity={sd.capacity}
                pricePerHour={sd.pricePerHour}
                images={sd.images}
                partyPalaceId={sd._id}
                likedBy={sd.likedBy}
                category={sd.category}
                userId={userId}
               
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchPage;
