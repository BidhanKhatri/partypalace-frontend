import React, { useEffect, useState } from "react";
import VenueCard from "../components/VenueCard";
import api from "../utils/apiInstance";
import { useDispatch, useSelector } from "react-redux";
import { setPartyPalace } from "../redux/features/partypalaceSlice";
import SubHeading from "../components/SubHeading";
import { toast } from "react-toastify";
import { socket } from "../../socket";

const RecentPalace = () => {
  const dispatch = useDispatch();
  const { partypalace } = useSelector((state) => state?.partypalace);
  const { token, userId } = useSelector((state) => state?.user);

  const [isLiked, setIsLiked] = useState(false);

  const toggleLike = (partyPalaceId) => {
    setIsLiked(!isLiked);
    handleLike(partyPalaceId);
  };

  const handleLike = async (partyPalaceId) => {
    try {
      const payload = { partyPalaceId, incLikes: isLiked ? -1 : 1 };
      const res = await api.put("/api/partypalace/like", payload);
      if (res && res.data.success) {
        fetchAllPartyPalace();
        toast.success(res.data.msg);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllPartyPalace = async () => {
    if (!token) return;
    try {
      const res = await api.get("/api/partypalace/get-all");
      if (res && res.data.success) {
        dispatch(setPartyPalace(res.data.data));
        console.log(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleSocketEvent = (createdPP) => {
      const exists = partypalace.some((pp) => pp._id === createdPP._id);
      if (!exists) {
        dispatch(setPartyPalace([createdPP, ...partypalace]));
      }
    };

    const handleDeletePartyPalaceSocketEvent = (deletePartyPalace) => {
      const filterData = partypalace.filter(
        (pp) => pp._id !== deletePartyPalace._id
      );
      dispatch(setPartyPalace(filterData));
    };

    socket.on("createdPartyPalace", handleSocketEvent);
    socket.on("deletePartyPalace", handleDeletePartyPalaceSocketEvent);

    return () => {
      socket.off("createdPartyPalace", handleSocketEvent);
      socket.off("deletedPartyPalace", handleDeletePartyPalaceSocketEvent);
    };
  }, [dispatch, partypalace]);

  useEffect(() => {
    fetchAllPartyPalace();
  }, []);

  return (
    <section className="relative w-full py-16 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Orange gradient accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-600/20 via-orange-500/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute -top-32 left-1/3 w-80 h-80 bg-gradient-to-b from-orange-700/15 to-transparent rounded-full blur-3xl"></div>

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
          className="absolute top-1/3 right-0 w-96 h-96 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(249, 115, 22, 0.12) 0%, transparent 70%)",
          }}
        ></div>
        <div
          className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(71, 85, 105, 0.06) 0%, transparent 70%)",
          }}
        ></div>
      </div>

      {/* Content Container */}
      <div className="relative max-w-7xl mx-auto px-6 md:px-8 z-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-3 py-1.5 bg-slate-800/50 border border-slate-700 rounded-full">
            <p className="text-xs font-medium text-slate-300 tracking-wide uppercase">
              Recently Added
            </p>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight tracking-tight">
            Discover Event <span className="text-slate-400">Places</span>
          </h2>

          <p className="text-sm md:text-base text-slate-400 font-light">
            Browse from the finest party palaces and celebration spaces
          </p>
        </div>

        {/* Venue Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
          {partypalace.length > 8
            ? partypalace.slice(0, partypalace.length - 1).map((pp) => (
                <div key={pp._id}>
                  <VenueCard
                    partyPalaceId={pp._id}
                    name={pp.name}
                    description={pp.description}
                    location={pp.location}
                    capacity={pp.capacity}
                    pricePerHour={pp.pricePerHour}
                    unavailableDates={pp.unavailableDates}
                    images={pp.images}
                    toggleLike={toggleLike}
                    isLiked={isLiked}
                    userId={userId}
                    category={pp.category}
                    likedBy={pp.likedBy}
                  />
                </div>
              ))
            : partypalace.map((pp) => (
                <div key={pp._id}>
                  <VenueCard
                    partyPalaceId={pp._id}
                    name={pp.name}
                    description={pp.description}
                    location={pp.location}
                    capacity={pp.capacity}
                    pricePerHour={pp.pricePerHour}
                    unavailableDates={pp.unavailableDates}
                    images={pp.images}
                    toggleLike={toggleLike}
                    isLiked={isLiked}
                    userId={userId}
                    category={pp.category}
                    likedBy={pp.likedBy}
                  />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
};

export default RecentPalace;
