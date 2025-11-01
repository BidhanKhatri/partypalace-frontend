import React, { useContext, useEffect, useState } from "react";
import userContext from "../context/userContext";
import { Search } from "lucide-react";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const { getSearchData } = useContext(userContext);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      getSearchData(search);
    }, 500);
    return () => clearTimeout(delaySearch);
  }, [search]);

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
      <input
        type="text"
        className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#FBAD34] focus:border-[#FBAD34] transition-all"
        autoFocus
        placeholder="Search palaces..."
        name="search"
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
