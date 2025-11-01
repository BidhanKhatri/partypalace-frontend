import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ChatHeader = () => {
  const { selectedChat } = useSelector((state) => state?.user);
  const [persistedChat, setPersistedChat] = useState(selectedChat);
  const navigate = useNavigate();

  //   console.log(selectedChat);

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
    <nav className="bg-blue-500 w-full px-4 py-2 flex items-center justify-between text-white shadow-md ">
      {/* Left Section - Chat Name or Title */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-white text-blue-500 rounded-full flex items-center justify-center font-bold">
          {persistedChat.userName.charAt(0).toUpperCase()}
        </div>
        <h1 className="text-lg font-semibold">
          {persistedChat.userName.charAt(0).toUpperCase() +
            persistedChat.userName.slice(1)}
          <span className="text-xs"> ({persistedChat.partyPalaceName})</span>
        </h1>
      </div>

      {/* Right Section - Options */}
      <div className="flex items-center gap-4">
        <button
          className="text-white hover:text-blue-200 transition font-medium text-2xl cursor-pointer"
          aria-label="close"
          onClick={() => navigate(-1)}
        >
          &times;
        </button>
      </div>
    </nav>
  );
};

export default ChatHeader;
