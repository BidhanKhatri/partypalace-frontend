import React, { useContext, useState } from "react";
import { FiSend } from "react-icons/fi";
import { MdAttachFile } from "react-icons/md";
import { useParams } from "react-router-dom";
import userContext from "../context/userContext";

const ChatFooter = () => {
  const [text, setText] = useState("");
  const { receiverId, partyPalaceId } = useParams();
  const { sendMessage, loading } = useContext(userContext);

  const payload = {
    receiverId,
    text,
    partyPalaceId,
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (text.trim()) {
      setTimeout(() => {
        sendMessage(payload);
        setText("");
      }, 100);
    }
  };

  return (
    <form
      onSubmit={handleSendMessage}
      className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-t border-gray-700/50 px-6 py-4 flex items-center gap-4 rounded-b-lg shadow-2xl backdrop-blur-sm"
    >
      {/* Attach File Icon */}
      <button
        type="button"
        className="group relative w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-all duration-200 border border-gray-700 hover:border-gray-600 shadow-md"
        aria-label="Attach file"
      >
        <MdAttachFile
          className="text-gray-400 group-hover:text-gray-200 transition-colors"
          size={20}
        />
      </button>

      {/* Input Field */}
      <div className="flex-grow relative">
        <input
          type="text"
          placeholder="Type your message..."
          onChange={(e) => setText(e.target.value)}
          value={text}
          className="w-full bg-gray-800 text-gray-100 placeholder-gray-500 rounded-xl px-5 py-3 text-sm outline-none border border-gray-700 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200 shadow-inner"
        />
      </div>

      {/* Send Button */}
      <button
        type="submit"
        disabled={loading || !text.trim()}
        className={`
          ${
            loading || !text.trim()
              ? "bg-gray-700 cursor-not-allowed opacity-50"
              : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 cursor-pointer shadow-lg shadow-blue-900/50"
          }
          text-white px-5 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 font-medium
        `}
        aria-label="Send message"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm hidden sm:block">Sending...</span>
          </>
        ) : (
          <>
            <FiSend size={18} />
            <span className="text-sm hidden sm:block">Send</span>
          </>
        )}
      </button>
    </form>
  );
};

export default ChatFooter;
