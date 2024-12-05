import React, { PropsWithChildren, useContext } from "react";
import { LMChatroomContext } from "../../context/LMChatChatroomContext";
import useChatroom from "../../hooks/useChatroom";
import noChatSelected from "../../assets/img/no-chat-selected.svg";
import LMGlobalClientProviderContext from "../../context/LMGlobalClientProviderContext";

const LMChatroom: React.FC<PropsWithChildren<LMChatroomProps>> = ({
  currentChatroomId,
  children,
}) => {
  const { customComponents = {} } = useContext(LMGlobalClientProviderContext);
  const { noChatroomSelected: NoChatroomSelected } = customComponents;
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
  } = useChatroom(currentChatroomId);

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
      {children}
    </LMChatroomContext.Provider>
  ) : NoChatroomSelected !== undefined ? (
    <NoChatroomSelected />
  ) : (
    <div className="noChatRoom">
      <img src={noChatSelected} alt="No chat selected" />
      <div>👈 Select a chat room to start messaging</div>
    </div>
  );
};

export default LMChatroom;

export interface LMChatroomProps {
  currentChatroomId?: number;
}
