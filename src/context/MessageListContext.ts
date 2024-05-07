import React from "react";
import Conversation from "../types/models/conversations";
import { UnknownGetConversationFunction } from "../hooks/useChannelProvider";

interface MessageListContextInterface {
  conversations: Conversation[] | null;
  setConversations: React.Dispatch<Conversation[]> | null;
  getChatroomConversationsOnTopScroll?: UnknownGetConversationFunction;
  getChatroomConversationsOnBottomScroll?: UnknownGetConversationFunction;
}

export default React.createContext<MessageListContextInterface>({
  conversations: null,
  setConversations: null,
});
