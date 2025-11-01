import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedChatAtAdmin } from "../redux/features/userSlice";

const AdminChatHeader = () => {
  const { selectedChatAtAdmin } = useSelector((state) => state?.user);
  const dispath = useDispatch();
  console.log("admin chat header", selectedChatAtAdmin);
  return (
    <nav className="bg-sky-500 w-full px-4 py-2 flex items-center justify-between text-white shadow-md ">
      {/* Left Section - Chat Name or Title */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-white text-blue-500 rounded-full flex items-center justify-center font-bold">
          {selectedChatAtAdmin.senderId.username.charAt(0).toUpperCase()}
        </div>
        <h1 className="text-lg font-semibold">
          {selectedChatAtAdmin.senderId.username.charAt(0).toUpperCase() +
            selectedChatAtAdmin.senderId.username.slice(1)}
        </h1>
      </div>

      {/* Right Section - Options */}
      <div className="flex items-center gap-4">
        <button
          className="text-white hover:text-blue-200 transition font-medium text-2xl cursor-pointer"
          aria-label="close"
          onClick={()=> dispath(setSelectedChatAtAdmin(null))}
        >
          &times;
        </button>
      </div>
    </nav>
  );
};

export default AdminChatHeader;
