import React, { useContext, useState, useMemo } from "react";
import userContext from "../context/userContext";
import VenueCard from "../components/VenueCard";
import { useSelector } from "react-redux";
import { FaExclamationTriangle, FaFilter } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import BeatLoader from "react-spinners/BeatLoader";
import FilterSearch from "../components/FilterSearch";
import SearchBar from "../components/SearchBar";

const SearchPage = () => {
  const { searchData, loading } = useContext(userContext);
  const { userId } = useSelector((state) => state?.user);
  const [color] = useState("#FBAD34");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showSearchMobile, setShowSearchMobile] = useState(false);

  const searchComponent = useMemo(() => <SearchBar />, []);

  return (
    <section className="relative w-full mt-14 min-h-[calc(100vh-64px)] bg-black overflow-x-hidden">
      {/* Background glows */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-600/20 via-orange-500/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="fixed -bottom-32 left-1/3 w-80 h-80 bg-gradient-to-b from-orange-700/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* Main Container */}
      <div className="flex flex-col lg:flex-row h-full relative z-10">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block lg:w-72 2xl:w-96 flex-shrink-0 h-[calc(100vh-64px)] overflow-hidden">
          <FilterSearch isOpen={true} onClose={() => {}} />
        </div>

        {/* Mobile Filter Button */}
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="fixed bottom-6 right-6 lg:hidden z-20 w-14 h-14 rounded-full bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
          title="Toggle Filters"
        >
          {isFilterOpen ? (
            <FaX className="text-lg" />
          ) : (
            <FaFilter className="text-lg" />
          )}
        </button>

        {/* Mobile Sidebar */}
        <div className="lg:hidden">
          <FilterSearch
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
          />
        </div>

        {/* Results Section */}
        <div className="w-full flex-1 flex flex-col overflow-hidden">
          {/* Header - Mobile */}
          <div className="lg:hidden px-4 py-3 border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
         
            {searchComponent}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full min-h-96 lg:min-h-full">
                <div className="flex flex-col items-center gap-4">
                  <BeatLoader color={color} size={16} />
                  <p className="text-slate-400 text-sm">
                    Finding amazing venues...
                  </p>
                </div>
              </div>
            ) : searchData.length === 0 ? (
              <div className="flex items-center justify-center h-full min-h-96 lg:min-h-full px-4">
                <div className="bg-slate-800/60 text-orange-400 px-6 py-4 rounded-lg font-semibold flex items-center gap-2 border border-orange-500/50 backdrop-blur-md shadow-lg text-center">
                  <FaExclamationTriangle className="flex-shrink-0" />
                  <span>
                    No venues match your filters. Try adjusting your search.
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-3 sm:p-4 md:p-6 lg:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-6">
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
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchPage;
