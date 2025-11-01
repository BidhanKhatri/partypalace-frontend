import React from "react";
import { FaSearch } from "react-icons/fa";

const LoadingState = () => {
  return (
    <div className="flex items-center justify-center min-h-[calc(90vh-64px)] bg-white">
      {/* Square “track” – size controls radius of the path  */}
      <div className="relative w-32 h-32">
        {/* Moving / spinning magnifying glass */}
        <div className="absolute inset-0 animate-search-path flex items-center justify-center">
          <FaSearch size={40} className="text-blue-600 animate-spin-slow" />
        </div>
      </div>

      {/* Status text */}
      <p className="ml-0 text-gray-700 text-lg font-semibold whitespace-nowrap ">
        Finding cameramen&nbsp;nearby…
      </p>
    </div>
  );
};

export default LoadingState;
