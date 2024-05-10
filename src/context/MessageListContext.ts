import React from "react";
import Conversation from "../types/models/conversations";
import { UnknownGetConversationFunction } from "../hooks/useChatroom";

interface MessageListContextInterface {
  conversations: Conversation[] | null;
  // setConversations: React.Dispatch<Conversation[]> | null;
  getChatroomConversationsOnTopScroll?: UnknownGetConversationFunction;
  getChatroomConversationsOnBottomScroll?: UnknownGetConversationFunction;
}

const MessageListContext = React.createContext<MessageListContextInterface>(
  {} as MessageListContextInterface,
);
export default MessageListContext;
