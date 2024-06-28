import React from "react";
import { Outlet } from "react-router-dom";
import { LMChatChatroomContext } from "../../context/LMChatChatroomContext";
import useChatroom from "../../hooks/useChatroom";

const LMChatChatroom = () => {
  const {
    chatroom,
    conversationToReply,
    conversationToedit,
    setConversationToEdit,
    setConversationToReply,
    setChatroom,
  } = useChatroom();
  return (
    <LMChatChatroomContext.Provider
      value={{
        conversationToedit,
        conversationToReply,
        setConversationToEdit,
        setConversationToReply,
        chatroom,
        setNewChatroom: setChatroom,
      }}
    >
      <Outlet />
    </LMChatChatroomContext.Provider>
  );
};

export default LMChatChatroom;
