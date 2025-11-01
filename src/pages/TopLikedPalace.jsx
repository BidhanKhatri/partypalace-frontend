import React, { useContext, useEffect } from "react";
import SubHeading from "../components/SubHeading";
import { useSelector } from "react-redux";
import VenueCard from "../components/VenueCard";
import userContext from "../context/userContext";
import TopLikeCard from "../components/TopLikeCard";
import { TfiControlBackward, TfiControlForward } from "react-icons/tfi";
import HomeSkeletonDiv from "../components/HomeSkeletonDiv";
import { FaExclamationTriangle } from "react-icons/fa";

const TopLikedPalace = () => {
  const { getTopLikedPartyPalace, topLiked } = useContext(userContext);
  const { userId } = useSelector((state) => state?.user);

  useEffect(() => {
    getTopLikedPartyPalace();
  }, []);

  // Filtered liked venues
  const likedVenues = topLiked.filter((pp) => pp.likes >= 5);

  // Calculate empty slots
  const emptySlots =
    likedVenues.length > 0 ? (4 - (likedVenues.length % 4)) % 4 : 0;

  return (
    <section className="relative w-full py-4 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Orange gradient accent */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-600/20 via-orange-500/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-gradient-to-b from-orange-700/15 to-transparent rounded-full blur-3xl"></div>

      {/* Grid Background - Enhanced */}
      <div className="absolute inset-0 opacity-40">
        <svg
          className="w-full h-full"
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="smallGrid"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="rgba(251, 146, 60, 0.3)"
                strokeWidth="0.7"
              />
            </pattern>
            <pattern
              id="grid"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <rect width="100" height="100" fill="url(#smallGrid)" />
              <path
                d="M 100 0 L 0 0 0 100"
                fill="none"
                stroke="rgba(249, 115, 22, 0.4)"
                strokeWidth="1.2"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Radial Gradient Accents */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(249, 115, 22, 0.12) 0%, transparent 70%)",
          }}
        ></div>
        <div
          className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(71, 85, 105, 0.06) 0%, transparent 70%)",
          }}
        ></div>
      </div>

      {/* Content Container */}
      <div className="relative max-w-7xl mx-auto px-6 md:px-8 z-10">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-block mb-3 px-3 py-1.5 bg-slate-800/50 border border-slate-700 rounded-full">
                <p className="text-xs font-medium text-slate-300 tracking-wide uppercase">
                  Most Loved
                </p>
              </div>
              <p className="font-bold text-3xl md:text-4xl uppercase tracking-wider text-white">
                Top Liked <span className="text-slate-400">Venues</span>
              </p>
              <p className="text-slate-400 text-sm mt-2 font-light">
                Explore the most popular party palaces loved by our community
              </p>
            </div>
            <p className="font-semibold text-sm select-none cursor-pointer text-slate-300 hover:text-orange-400 transition-colors">
              View All ({likedVenues.length})
            </p>
          </div>
        </div>

        {/* Grid Container */}
        <div className="space-y-6">
          {/* Venue Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {likedVenues &&
              likedVenues.map((pp) => (
                <TopLikeCard
                  key={pp._id}
                  partyPalaceId={pp._id}
                  name={pp.name}
                  description={pp.description}
                  location={pp.location}
                  capacity={pp.capacity}
                  pricePerHour={pp.pricePerHour}
                  unavailableDates={pp.unavailableDates}
                  images={pp.images}
                  totalLikes={pp.likes}
                  category={pp.category}
                  userId={userId}
                />
              ))}

            {likedVenues.length === 0 && (
              <div className="col-span-4 flex flex-col items-center justify-center gap-4 py-10">
                <FaExclamationTriangle
                  size={40}
                  className="animate-bounce text-neutral-500"
                />
                <p className="text-slate-300 text-lg font-semibold">
                  No Top Liked Venues Found
                </p>
              </div>
            )}

            {/* Render empty skeleton divs */}
            {Array.from({ length: emptySlots }).map((_, index) => (
              <HomeSkeletonDiv key={index} />
            ))}
          </div>

          {/* Pagination Controls */}
          {likedVenues.length > 0 && (
            <div className="flex items-center justify-center gap-4 pt-8">
              <button
                className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-orange-400 transition-all duration-300 hover:border-orange-400/50"
                aria-label="Previous page"
              >
                <TfiControlBackward size={18} />
              </button>

              <span className="bg-slate-800/60 rounded-lg text-slate-200 cursor-pointer px-4 py-2 border border-slate-700 hover:border-orange-400/50 transition-colors font-medium">
                1
              </span>

              <button
                className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-orange-400 transition-all duration-300 hover:border-orange-400/50"
                aria-label="Next page"
              >
                <TfiControlForward size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TopLikedPalace;
