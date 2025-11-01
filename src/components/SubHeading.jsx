import React from "react";

const SubHeading = ({ subheading = "subheading" }) => {
  return (
    <div className="flex items-center justify-start gap-4 ">
      <div className="w-24 h-0.5 bg-[#FBAD34] rounded-xl" />
      <p className="text-xs text-neutral-500">{subheading}</p>
      <div className="w-24 h-0.5 bg-[#FBAD34] rounded-xl" />
    </div>
  );
};

export default SubHeading;
