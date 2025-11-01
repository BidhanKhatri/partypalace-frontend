import React, { useContext, useEffect } from "react";
import AdminChatHeader from "../components/AdminChatHeader";
import AdminLeftChatSection from "../components/AdminLeftChatSection";
import AdminChatBody from "../components/AdminChatBody";
import AdminChatFooter from "../components/AdminChatFooter";
import { useSelector } from "react-redux";
import { FaMessage } from "react-icons/fa6";

const AdminChatPage = () => {
  const { selectedChatAtAdmin } = useSelector((state) => state?.user);

  return (
    <section className=" h-screen w-full flex bg-neutral-100">
      <div>
        <AdminLeftChatSection />
      </div>

      {!selectedChatAtAdmin ? (
        <div className=" w-full h-full flex flex-col items-center justify-center gap-8">
          <p className="text-xl font-semibold text-neutral-500">Select a chat to start conversation</p>
          <FaMessage size={56} className="animate-bounce text-neutral-500"/>
        </div>
      ) : (
        <div className="grow flex flex-col ">
          <AdminChatHeader />``
          <div className="grow ">
            <AdminChatBody />
          </div>
          <AdminChatFooter />
        </div>
      )}
    </section>
  );
};

export default AdminChatPage;
