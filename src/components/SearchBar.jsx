import React, { useContext, useEffect, useState } from "react";
import userContext from "../context/userContext";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const { getSearchData } = useContext(userContext);
  // console.log(search);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      getSearchData(search);
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [search]);

  return (
    <input
      type="text"
      className="border group-focus-within:border-[#FBAD34] rounded-md px-2 py-1 w-72 outline-none border-neutral-600 foucs:border-[#FBAD34]"
      autoFocus
      placeholder="search.."
      name="search"
      onChange={(e) => setSearch(e.target.value)}
    />
  );
};

export default SearchBar;
