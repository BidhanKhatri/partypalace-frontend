import React, { useContext, useEffect, useState } from "react";
import userContext from "../context/userContext";
import VenueCard from "../components/VenueCard";
import { useSelector } from "react-redux";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import HomeSkeletonDiv from "../components/HomeSkeletonDiv";

const CategoryLayout = () => {
  const { userId } = useSelector((state) => state?.user);
  const {
    getPartyPalaceByCategory,
    categoryData,
    otherCategoryData,
    getAllCategory,
    allCategory,
  } = useContext(userContext);

  const [page, setPage] = useState({});

  useEffect(() => {
    getAllCategory();
  }, []);

  useEffect(() => {
    const fetchAllCategoryAndDisplay = async () => {
      if (allCategory.length > 0) {
        try {
          const promises = allCategory.map((cat) =>
            getPartyPalaceByCategory(cat.name, page[cat.name] || 1)
          );
          await Promise.all(promises);
        } catch (error) {
          console.error("Error fetching party palace data:", error);
        }
      }
    };

    fetchAllCategoryAndDisplay();
  }, [JSON.stringify(page), allCategory]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Orange gradient accents (consistent with HeroSection) */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-600/20 via-orange-500/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute -top-32 left-1/3 w-80 h-80 bg-gradient-to-b from-orange-700/15 to-transparent rounded-full blur-3xl"></div>

      {/* Subtle grid overlay */}
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

      {/* Radial gradient glow accents */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div
          className="absolute top-1/3 right-0 w-96 h-96 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)",
          }}
        ></div>
        <div
          className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(71,85,105,0.06) 0%, transparent 70%)",
          }}
        ></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          {/* Section Title */}
          <div className="text-center mb-16">
            <div className="inline-block mb-3 px-3 py-1.5 bg-slate-800/50 border border-slate-700 rounded-full">
              <p className="text-xs font-medium text-slate-300 tracking-wide uppercase">
                Explore Categories
              </p>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-3 leading-tight tracking-tight">
              Browse by <span className="text-slate-400">Category</span>
            </h2>
            <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto font-light">
              Discover stunning venues curated by event type and theme.
            </p>
          </div>

          {/* Category Sections */}
          {allCategory.map((c, i) => {
            const currentCategoryData = categoryData[c.name] || [];
            const currentPage = page[c.name] || 1;
            const totalPages = otherCategoryData[c.name]?.totalPage || 1;

            // Skip categories with no data
            if (currentCategoryData.length === 0) return null;

            return (
              <section
                key={i}
                className="mb-20 bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 md:p-8 shadow-2xl transition-all duration-500 hover:shadow-orange-500/10"
              >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
                  <div>
                    <div className="inline-block mb-3 px-3 py-1.5 bg-slate-800/50 border border-slate-700 rounded-full">
                      <p className="text-xs font-medium text-slate-300 tracking-wide uppercase">
                        Category
                      </p>
                    </div>
                    <h3 className="font-bold text-2xl md:text-3xl uppercase tracking-wider text-white">
                      Category <span className="text-slate-400">{c.name}</span>
                    </h3>
                  </div>
                  <p className="font-semibold text-sm select-none cursor-pointer text-slate-300 hover:text-orange-400 transition-colors">
                    View All ({totalPages * 4})
                  </p>
                </div>

                {/* Venue Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {currentCategoryData.map((pp) => (
                    <VenueCard
                      key={pp._id}
                      {...pp}
                      userId={userId}
                      partyPalaceId={pp._id}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center items-center pt-6 border-t border-slate-700/50">
                  <div className="flex gap-4 items-center mt-6">
                    <button
                      onClick={() =>
                        setPage((prev) => ({
                          ...prev,
                          [c.name]: Math.max(1, (prev[c.name] || 1) - 1),
                        }))
                      }
                      disabled={currentPage === 1}
                      className={`p-2.5 rounded-lg font-semibold shadow-lg transition-all duration-300 flex items-center justify-center border ${
                        currentPage === 1
                          ? "bg-slate-700/50 text-slate-500 cursor-not-allowed border-slate-700"
                          : "bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white border-slate-600 hover:border-slate-500"
                      }`}
                      aria-label="Previous page"
                    >
                      <FaArrowLeft size={16} />
                    </button>

                    <div className="rounded-lg px-6 py-2.5 bg-slate-800/60 border border-slate-700 inline-flex items-center">
                      <span className="text-base font-semibold text-slate-200">
                        Page {currentPage} of {totalPages}
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        setPage((prev) => ({
                          ...prev,
                          [c.name]: Math.min(
                            totalPages,
                            (prev[c.name] || 1) + 1
                          ),
                        }))
                      }
                      disabled={currentPage === totalPages}
                      className={`p-2.5 rounded-lg font-semibold shadow-lg transition-all duration-300 flex items-center justify-center border ${
                        currentPage === totalPages
                          ? "bg-slate-700/50 text-slate-500 cursor-not-allowed border-slate-700"
                          : "bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white border-slate-600 hover:border-slate-500"
                      }`}
                      aria-label="Next page"
                    >
                      <FaArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryLayout;
