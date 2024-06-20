import React from "react";
import { LMChatChatroomContext } from "../../context/LMChatChatroomContext";
// import Conversation from "../../types/models/conversations";
import Header from "../Header/Header";
import MessageList from "../LMMessageList/MessageList";
import Input from "../LMInput/Input";
import useChatroom from "../../hooks/useChatroom";

const LMChatChatroom = () => {
  const {
    chatroom,
    conversationToReply,
    conversationToedit,
    setConversationToEdit,
    setConversationToReply,
  } = useChatroom();
  return (
    <LMChatChatroomContext.Provider
      value={{
        conversationToedit,
        conversationToReply,
        setConversationToEdit,
        setConversationToReply,
        chatroom,
      }}
    >
      <Header />
      <MessageList />
      <Input />
    </LMChatChatroomContext.Provider>
  );
};

export default LMChatChatroom;
