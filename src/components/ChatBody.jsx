import React, { useContext, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import userContext from "../context/userContext";
import { useSelector } from "react-redux";

const ChatBody = () => {
  const { receiverId } = useParams();
  const { getMessage, message, loading } = useContext(userContext);
  const { userId } = useSelector((state) => state?.user);
  const scrollRef = useRef(null);

  console.log(userId);

  //getting message
  useEffect(() => {
    getMessage(receiverId);
  }, [receiverId]);

  //scrolling to bottom logic
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message]);

  return (
    <div className="flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 h-[calc(84vh-64px)] w-full p-6 overflow-y-auto">
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-400 text-sm">Loading messages...</span>
          </div>
        </div>
      )}

      {/* Messages */}
      {!loading && message.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <p className="text-gray-400 text-lg font-medium">No messages yet</p>
            <p className="text-gray-600 text-sm mt-1">Start the conversation</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {message.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                userId === msg.senderId._id ? "justify-end" : "justify-start"
              }`}
              ref={i === message.length - 1 ? scrollRef : null}
            >
              <div className="flex flex-col gap-1 max-w-[70%] md:max-w-md">
                {/* Timestamp */}
                <span
                  className={`text-xs text-gray-500 px-1 ${
                    userId === msg.senderId._id ? "text-right" : "text-left"
                  }`}
                >
                  {new Date(msg.createdAt).toLocaleString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                </span>

                {/* Message Bubble */}
                <div
                  className={`
                    ${
                      userId === msg.senderId._id
                        ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-sm shadow-lg shadow-blue-900/50"
                        : "bg-gray-800 text-gray-100 rounded-tl-sm border border-gray-700"
                    }
                    px-4 py-3 rounded-2xl shadow-md
                    break-words
                    transition-all duration-200
                    hover:shadow-lg
                  `}
                >
                  <p className="text-[15px] leading-relaxed">{msg.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatBody;
