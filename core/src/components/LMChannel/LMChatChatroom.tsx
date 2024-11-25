import React, { PropsWithChildren } from "react";
import { LMChatroomContext } from "../../context/LMChatChatroomContext";
import useChatroom from "../../hooks/useChatroom";
import noChatSelected from "../../assets/img/no-chat-selected.svg";

const LMChatroom: React.FC<PropsWithChildren<LMChatroomProps>> = ({
  currentChatroomId,
  children,
}) => {
  const {
    chatroomDetails,
    conversationToReply,
    conversationToedit,
    setConversationToEdit,
    setConversationToReply,
    setChatroom,
    canUserReplyPrivately,
    searchedConversationId,
    setSearchedConversationId,
  } = useChatroom(currentChatroomId || "");
  return chatroomDetails ? (
    <LMChatroomContext.Provider
      value={{
        conversationToedit,
        conversationToReply,
        setConversationToEdit,
        setConversationToReply,
        chatroomDetails,
        setNewChatroom: setChatroom,
        canUserReplyPrivately,
        searchedConversationId,
        setSearchedConversationId,
      }}
    >
      {/* <Outlet /> */}
      {/* <LMHeader />
      <LMMessageList />
      <LMInput /> */}
      {children}
    </LMChatroomContext.Provider>
  ) : (
    <div className="noChatRoom">
      <img src={noChatSelected} alt="No chat selected" />
      <div>👈 Select a chat room to start messaging</div>
    </div>
  );
};

export default LMChatroom;

export interface LMChatroomProps {
  currentChatroomId?: string;
}
