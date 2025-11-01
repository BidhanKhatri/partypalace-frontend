import React, { useContext, useState } from "react";
import { FiSend } from "react-icons/fi";
import { MdAttachFile } from "react-icons/md";
import { useParams } from "react-router-dom";
import userContext from "../context/userContext";
import { useSelector } from "react-redux";

const AdminChatFooter = () => {
  const [text, setText] = useState("");

  const { selectedChatAtAdmin } = useSelector((state) => state?.user);
  const { sendMessage, loading } = useContext(userContext);
  //   console.log(selectedChatAtAdmin);

  const payload = {
    receiverId: selectedChatAtAdmin.senderId._id,
    text,
    partyPalaceId: selectedChatAtAdmin.partyPalaceId,
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
      className="bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-4 rounded-b-lg shadow-sm"
    >
      {/* Attach File Icon */}
      <button
        className="text-gray-500 hover:text-gray-700 transition"
        aria-label="Attach file"
      >
        <MdAttachFile size={24} />
      </button>

      {/* Input Field */}
      <input
        type="text"
        placeholder="Type your message..."
        onChange={(e) => setText(e.target.value)}
        value={text}
        className="flex-grow bg-gray-100 rounded-full px-4 py-2 text-sm outline-none border border-gray-300 focus:ring-2 focus:ring-sky-400 focus:border-transparent transition"
      />

      {/* Send Button */}
      <button
        disabled={loading}
        className={`${
          loading
            ? "bg-neutral-500 cursor-not-allowed"
            : "bg-sky-500 cursor-pointer"
        } text-white px-4 py-2 rounded-full flex items-center gap-2 shadow hover:bg-sky-600 transition`}
        aria-label="Send message"
      >
        <FiSend size={18} />
        <span className="text-sm font-medium hidden sm:block">Send</span>
      </button>
    </form>
  );
};

export default AdminChatFooter;
