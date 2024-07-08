import React from "react";
import { Outlet } from "react-router-dom";
import { LMChatChatroomContext } from "../../context/LMChatChatroomContext";
import useChatroom from "../../hooks/useChatroom";
import noChatSelected from "../../assets/img/no-chat-selected.svg";

const LMChatChatroom: React.FC = () => {
  const {
    chatroom,
    conversationToReply,
    conversationToedit,
    setConversationToEdit,
    setConversationToReply,
    setChatroom,
  } = useChatroom();
  console.log(chatroom);

  return chatroom ? (
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
  ) : (
    <div className="noChatRoom">
      <img src={noChatSelected} alt="No chat selected" />
      <div>👈 Select a chat room to start messaging</div>
    </div>
  );
};

export default LMChatChatroom;
