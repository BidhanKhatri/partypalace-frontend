import React, { useContext, useEffect, useState } from "react";
import userContext from "../context/userContext";
import { FaChevronDown, FaX } from "react-icons/fa6";

const FilterSearch = ({ isOpen, onClose }) => {
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [category, setCategory] = useState([]);
  const [capacity, setCapacity] = useState(1);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    capacity: true,
  });

  const {
    getPartyPalaceByCategory,
    getPartyPalaceByFilter,
    getAllCategory,
    allCategory,
  } = useContext(userContext);

  // Submit filtered data
  const handleSubmitFind = (e) => {
    e.preventDefault();
    let payload = {};
    if (min && max) payload.min = min;
    if (category.length > 0) payload.category = category;
    if (capacity) payload.capacity = capacity;
    getPartyPalaceByFilter(payload);
    onClose?.();
  };

  const handleCategoryChange = (e) => {
    const categoryValue = e.target.value;
    setCategory((prevCategory) =>
      prevCategory.includes(categoryValue)
        ? prevCategory.filter((c) => c !== categoryValue)
        : [...prevCategory, categoryValue]
    );
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  const handleReset = () => {
    setMin("");
    setMax("");
    setCategory([]);
    setCapacity(1);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-12 left-0 h-[calc(100vh-64px)] bg-gradient-to-b from-slate-900/95 to-slate-950/95 backdrop-blur-md border-r border-slate-700 shadow-2xl w-80 lg:w-72 2xl:w-96 transform transition-transform duration-300 ease-out z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-full flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700 lg:hidden">
            <h2 className="text-lg font-bold text-white">Filters</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <FaX className="text-white text-sm" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 lg:p-6 space-y-4 lg:space-y-6 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
            {/* Category */}
            <div>
              <button
                onClick={() => toggleSection("category")}
                className="w-full flex items-center justify-between group"
              >
                <p className="font-semibold text-base lg:text-lg text-white group-hover:text-orange-400 transition-colors">
                  Category
                </p>
                <FaChevronDown
                  className={`text-slate-400 transition-transform duration-300 ${
                    expandedSections.category ? "rotate-180" : ""
                  }`}
                />
              </button>
              {expandedSections.category && (
                <div className="mt-3 space-y-2.5">
                  {allCategory &&
                    allCategory.length > 0 &&
                    allCategory.map((el, i) => (
                      <div className="flex items-center gap-3" key={i}>
                        <input
                          value={el.name}
                          type="checkbox"
                          className="w-4 h-4 accent-orange-500 cursor-pointer rounded transition-all"
                          onChange={handleCategoryChange}
                          id={el.name}
                        />
                        <label
                          htmlFor={el.name}
                          className="text-slate-300 text-sm select-none cursor-pointer hover:text-white transition-colors"
                        >
                          {el.name}
                        </label>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-700"></div>

            {/* Price Range */}
            <div>
              <button
                onClick={() => toggleSection("price")}
                className="w-full flex items-center justify-between group"
              >
                <p className="font-semibold text-base lg:text-lg text-white group-hover:text-orange-400 transition-colors">
                  Price Range
                </p>
                <FaChevronDown
                  className={`text-slate-400 transition-transform duration-300 ${
                    expandedSections.price ? "rotate-180" : ""
                  }`}
                />
              </button>
              {expandedSections.price && (
                <div className="mt-3 flex gap-2">
                  <input
                    type="number"
                    name="min"
                    placeholder="Min"
                    value={min}
                    onChange={(e) => setMin(e.target.value)}
                    className="w-full px-3 py-2 text-sm lg:text-base rounded-lg bg-slate-800/70 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                  <input
                    type="number"
                    name="max"
                    placeholder="Max"
                    value={max}
                    onChange={(e) => setMax(e.target.value)}
                    className="w-full px-3 py-2 text-sm lg:text-base rounded-lg bg-slate-800/70 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-700"></div>

            {/* Capacity */}
            <div>
              <button
                onClick={() => toggleSection("capacity")}
                className="w-full flex items-center justify-between group"
              >
                <p className="font-semibold text-base lg:text-lg text-white group-hover:text-orange-400 transition-colors">
                  Capacity
                </p>
                <FaChevronDown
                  className={`text-slate-400 transition-transform duration-300 ${
                    expandedSections.capacity ? "rotate-180" : ""
                  }`}
                />
              </button>
              {expandedSections.capacity && (
                <div className="mt-3">
                  <input
                    type="number"
                    placeholder="Enter capacity"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="w-full px-3 py-2 text-sm lg:text-base rounded-lg bg-slate-800/70 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t border-slate-700 p-4 lg:p-6 space-y-3 flex-shrink-0">
            <button
              onClick={handleSubmitFind}
              className="w-full py-2.5 lg:py-3 rounded-lg bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-semibold text-sm lg:text-base tracking-wide shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
            >
              Apply Filters
            </button>
            <button
              onClick={handleReset}
              className="w-full py-2 lg:py-2.5 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-sm lg:text-base border border-slate-700 transition-all duration-300"
            >
              Reset
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default FilterSearch;
