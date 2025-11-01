import React from "react";
import ChatHeader from "../components/ChatHeader";
import ChatBody from "../components/ChatBody";
import ChatFooter from "../components/ChatFooter";

const ChatPage = () => {
  return (
    <section className="h-[calc(100vh-64px)] mt-14 flex flex-col  ">
      <div>
        <ChatHeader />
      </div>
      <div className="grow">
        <ChatBody />
      </div>
      <div>
        <ChatFooter />
      </div>
    </section>
  );
};

export default ChatPage;
