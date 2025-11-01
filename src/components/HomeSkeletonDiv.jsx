import React from "react";

const HomeSkeletonDiv = () => {
  return (
    <div className="flex flex-col animate-pulse">
      <div className="bg-gray-700  rounded-lg h-[250px] w-full p-4 flex flex-col items-center justify-center">
        <div className="bg-neutral-800 w-full h-full rounded-md flex items-center justify-center text-neutral-400">
          {" "}
          Coming Soon{" "}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="bg-neutral-700 w-1/2 h-4 rounded-md mt-2" />
        <div className="bg-neutral-700 w-1/3 h-4 rounded-md mt-2" />
      </div>
      <div className="bg-neutral-700 w-full h-4 rounded-md mt-2" />
    </div>
  );
};

export default HomeSkeletonDiv;
