import React, { PropsWithChildren, useContext, useEffect } from "react";
import { LMChatroomContext } from "../../context/LMChatChatroomContext";
import useChatroom from "../../hooks/useChatroom";
import noChatSelected from "../../assets/img/no-chat-selected.svg";
import { LMGlobalClientProviderContext } from "../../main_index";

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
  } = useChatroom(currentChatroomId || "");
  useEffect(() => {
    if (chatroomDetails) {
      console.timeEnd("ai-chatbot-open");
    }
  }, [chatroomDetails]);
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
  currentChatroomId?: string;
}
