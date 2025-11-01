import React, { useContext, useEffect, useRef } from "react";
import userContext from "../context/userContext";
import { useSelector } from "react-redux";

const AdminChatBody = () => {
  const { selectedChatAtAdmin } = useSelector((state) => state?.user);
  const { getMessage, message, loading } = useContext(userContext);
  const { userId } = useSelector((state) => state?.user);
  const scrollRef = useRef(null);
  //   console.log(receiverId);
  // console.log(message);
  console.log(userId);

  const receiverId = selectedChatAtAdmin?.senderId._id;

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
    <div className="flex flex-col bg-gray-50 h-[calc(84vh-64px)] w-full p-4 overflow-y-auto">
      {/* Example Messages */}
      <div className="flex flex-col gap-6">
        {message.map((msg, i) => (
          <>
            {" "}
            {/*  Message */}
            <div
              key={i}
              className={`${
                userId === msg.senderId._id
                  ? "self-end bg-sky-500 text-white rounded-br-none"
                  : "self-start bg-neutral-500 text-white rounded-bl-none"
              } max-w-xs p-3  rounded-lg  shadow-md relative`}
              ref={i === message.length - 1 ? scrollRef : null}
            >
              <span
                className={`absolute ${
                  userId === msg.senderId ? "-top-5 right-2" : "-top-5 left-2"
                }  text-xs text-neutral-500`}
              >
                {new Date(msg.createdAt).toLocaleString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
              </span>
              {msg.text}
            </div>
          </>
        ))}

        {/* More messages can go here */}
      </div>
    </div>
  );
};

export default AdminChatBody;
