import React from "react";
import { useSelector } from "react-redux";
import { useState } from "react";
import api from "../utils/apiInstance";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { TypeAnimation } from "react-type-animation";

const HeroSection = () => {
  const [category, setCategory] = useState([]);
  const [searchData, setSearchData] = useState({});
  const [responseData, setResponseData] = useState([]);
  const { token } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    getCategory();
  }, []);

  const getCategory = async () => {
    try {
      const res = await api.get("/api/global/category/get");
      if (res.data.success) {
        setCategory(res.data.data);
      }
    } catch (error) {
      console.log(error?.response?.data?.msg || error?.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!searchData.category) {
      return toast.error("Please select a category");
    }
    if (!searchData.targetedDate) {
      return toast.error("Please select a date");
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        contentType: "application/json",
      },
    };

    try {
      const res = await api.post(
        "/api/partypalace/get-by-category-date",
        searchData,
        config
      );
      console.log("res data", res.data);

      if (res.data.success) {
        setResponseData(res.data.data);
        navigate("/quick-search", {
          state: {
            data: res.data.data,
            totalCount: res.data.totalCount,
            totalPage: res.data.totalPage,
            searchData,
          },
        });
      }
    } catch (error) {
      console.log(error?.response?.data?.msg || error?.message);
    }
  };

  return (
    <div className="relative h-[82vh] overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pt-2 ">
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

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 md:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-8 max-w-2xl">
          <div className="inline-block mb-3 px-3 py-1.5 bg-slate-800/50 border border-slate-700 rounded-full">
            <p className="text-xs font-medium text-slate-300 tracking-wide uppercase">
              Premium Event Solutions
            </p>
          </div>

          <div className="flex items-center gap-2">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-1 leading-tight tracking-tight whitespace-nowrap">
              Discover Your Perfect
            </h1>
            <span className="text-slate-400 font-bold min-w-[11rem]">
              <TypeAnimation
                sequence={[
                  "Venues",
                  1000,
                  "Palaces",
                  1000,
                  "Resorts",
                  1000,
                  "Halls",
                  1000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
                className="text-slate-400 inline-block"
                style={{ fontSize: "2.7rem" }}
              />
            </span>
          </div>
          <p className="text-sm md:text-base text-slate-400 font-light leading-relaxed">
            Browse and book from the finest party palaces and celebration
            spaces.
          </p>
        </div>

        {/* Search Form Card */}
        <div className="w-full max-w-4xl mx-auto mb-8">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 md:p-8 shadow-2xl">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                {/* Category */}
                <div className="md:col-span-4">
                  <label className="block text-xs md:text-sm font-semibold text-slate-200 mb-3 uppercase tracking-wide">
                    Event Category
                  </label>
                  <select
                    className="w-full bg-slate-800/80 border border-slate-600 text-white text-sm md:text-base px-4 py-3.5 rounded-lg focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 transition-all"
                    name="category"
                    id="category"
                    onChange={handleChange}
                  >
                    <option value="">Select Category</option>
                    {category.map((el) => (
                      <option key={el._id} value={el.name}>
                        {el.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div className="md:col-span-4">
                  <label className="block text-xs md:text-sm font-semibold text-slate-200 mb-3 uppercase tracking-wide">
                    Event Date
                  </label>
                  <input
                    type="date"
                    name="targetedDate"
                    id="checkin"
                    className="w-full bg-slate-800/80 border border-slate-600 text-white text-sm md:text-base px-4 py-3.5 rounded-lg focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 transition-all"
                    onChange={handleChange}
                  />
                </div>

                {/* Button */}
                <div className="md:col-span-4">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white font-semibold text-sm md:text-base px-6 py-3.5 rounded-lg transition-all duration-300 border border-slate-600 hover:border-slate-500 shadow-lg hover:shadow-xl active:scale-95"
                  >
                    Search Venues
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Help Text */}
          <p className="text-center text-slate-500 text-xs mt-4">
            Select a category and date to explore available venues for your
            event
          </p>
        </div>
      </div>
    </div>
  );
};
<hero>
  this is the hero section that is uaw^shaksham karkui can shsajshamn ehwhy the
  sane kiernfnm
</hero>;

export default HeroSection;
