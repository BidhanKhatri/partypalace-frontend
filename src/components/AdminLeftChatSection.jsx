import React, { useContext, useEffect } from "react";
import adminContext from "../context/adminContext";
import { useDispatch, useSelector } from "react-redux";
import { FaMessage } from "react-icons/fa6";
import { setSelectedChatAtAdmin } from "../redux/features/userSlice";
const AdminLeftChatSection = () => {
  const { getLeftSideChat, leftSideChatData } = useContext(adminContext);
  const { userId } = useSelector((state) => state?.user);
  const dispatch = useDispatch();

  useEffect(() => {
    getLeftSideChat();
  }, []);

  const filterAdminMessage = Object.values(
    // used chat gpt for this logic
    leftSideChatData
      .filter((item) => item.senderId._id !== userId) // Exclude messages sent by the current user
      .reduce((acc, item) => {
        // If senderId already exists in acc, replace it with the latest message
        if (
          !acc[item.senderId._id] ||
          new Date(item.createdAt) > new Date(acc[item.senderId._id].createdAt)
        ) {
          acc[item.senderId._id] = item;
        }
        return acc;
      }, {})
  ); // returns the array where senderId is not equal to userId i.e if I am the sender then I will not see my message at left side

  //   console.log("filterd leftside chat", filterAdminMessage);

  // console.log("left side chat", leftSideChatData); // return all the message also my message

  //function to dispatch the selectedUser state in admin side
 
  return (
    <aside className="h-screen bg-gray-100 w-64 2xl:w-80 p-4 border-r border-gray-200">
      <h2 className=" text-xl font-bold mb-4 flex items-center gap-2 text-neutral-500">
        <FaMessage /> Chats
      </h2>
      <div className="space-y-3">
        {filterAdminMessage.length > 0 ? (
          filterAdminMessage.map((chat, index) => (
            <div
              key={index}
              className="flex items-center bg-white p-2 rounded-xl shadow-sm hover:bg-white/80 transition duration-200 cursor-pointer"
              onClick={() => dispatch(setSelectedChatAtAdmin(chat))}
            >
              <div className="w-12 h-12 rounded-full bg-neutral-200 flex-shrink-0">
                <img
                  src={chat.userImage || "/default-avatar.png"}
                  alt={`${chat.userName || "User"}'s avatar`}
                  className="w-full h-full object-cover rounded-full text-xs"
                />
              </div>
              <div className="ml-3 text-neutral-500">
                <p className="font-medium">
                  {chat.senderId.username || "Unknown User"}
                </p>
                <p className="text-sm text-neutral-500 truncate max-w-32">
                  {chat.text || "No message"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No chats available</p>
        )}
      </div>
    </aside>
  );
};

export default AdminLeftChatSection;
