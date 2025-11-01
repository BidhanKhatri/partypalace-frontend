import React, { useContext, useEffect, useState } from "react";
import userContext from "../context/userContext";

const FilterSearch = () => {
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [category, setCategory] = useState([]);
  const [capacity, setCapacity] = useState(1);

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
  };

  const handleCategoryChange = (e) => {
    const categoryValue = e.target.value;
    setCategory((prevCategory) =>
      prevCategory.includes(categoryValue)
        ? prevCategory.filter((c) => c !== categoryValue)
        : [...prevCategory, categoryValue]
    );
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  return (
    <aside className="w-76 h-[calc(100vh-64px)] bg-slate-900/70 backdrop-blur-md border-r border-slate-700 shadow-lg 2xl:w-96">
      <div className="h-full overflow-x-hidden overflow-y-auto p-6 space-y-6">
        {/* Category */}
        <div>
          <p className="font-semibold text-lg text-white mb-2">Category</p>
          {allCategory &&
            allCategory.length > 0 &&
            allCategory.map((el, i) => (
              <div className="flex items-center gap-3 mt-2" key={i}>
                <input
                  value={el.name}
                  type="checkbox"
                  className="w-4 h-4 accent-orange-500"
                  onChange={handleCategoryChange}
                  id={el.name}
                />
                <label
                  htmlFor={el.name}
                  className="text-slate-300 text-sm select-none"
                >
                  {el.name}
                </label>
              </div>
            ))}
        </div>

        {/* Price Range */}
        <div>
          <p className="font-semibold text-lg text-white mb-2">Price Range</p>
          <div className="flex gap-2">
            <input
              type="number"
              name="min"
              placeholder="Min"
              value={min}
              onChange={(e) => setMin(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-800/70 border border-slate-700 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
            />
            <input
              type="number"
              name="max"
              placeholder="Max"
              value={max}
              onChange={(e) => setMax(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-800/70 border border-slate-700 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
            />
          </div>
        </div>

        {/* Capacity */}
        <div>
          <p className="font-semibold text-lg text-white mb-2">Capacity</p>
          <input
            type="number"
            placeholder="Enter capacity"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-800/70 border border-slate-700 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
          />
        </div>

        {/* Find Button */}
        <button
          onClick={handleSubmitFind}
          className="w-full py-2 mt-4 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-semibold tracking-wider shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Find
        </button>
      </div>
    </aside>
  );
};

export default FilterSearch;
