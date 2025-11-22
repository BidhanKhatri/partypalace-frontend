import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ChatHeader = () => {
  const { selectedChat } = useSelector((state) => state?.user);
  const [persistedChat, setPersistedChat] = useState(selectedChat);
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedChat) {
      const storedChat = localStorage.getItem("selectedChat");
      if (storedChat) {
        setPersistedChat(JSON.parse(storedChat));
      } else {
        setPersistedChat(selectedChat);
      }
    }
  }, [selectedChat]);

  if (!persistedChat) {
    return null;
  }

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 w-full px-6 py-4 flex items-center justify-between text-white shadow-xl border-b border-gray-700/50 backdrop-blur-sm">
      {/* Left Section - Chat Name or Title */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-900/50 ring-2 ring-gray-700">
            {persistedChat.userName.charAt(0).toUpperCase()}
          </div>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold text-gray-100 tracking-wide">
            {persistedChat.userName.charAt(0).toUpperCase() +
              persistedChat.userName.slice(1)}
          </h1>
          <span className="text-xs text-gray-400 font-medium">
            {persistedChat.partyPalaceName}
          </span>
        </div>
      </div>

      {/* Right Section - Options */}
      <div className="flex items-center gap-3">
        <button
          className="group relative w-9 h-9 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-all duration-200 border border-gray-700 hover:border-gray-600 shadow-md"
          aria-label="close"
          onClick={() => navigate(-1)}
        >
          <svg
            className="w-5 h-5 text-gray-400 group-hover:text-gray-200 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default ChatHeader;
