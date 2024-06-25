import React, { MutableRefObject } from "react";
import Conversation from "../types/models/conversations";
import { UnknownGetConversationFunction } from "../hooks/useChatroom";

interface MessageListContextInterface {
  conversations: Conversation[] | null;
  // setConversations: React.Dispatch<Conversation[]> | null;
  getChatroomConversationsOnTopScroll?: UnknownGetConversationFunction;
  getChatroomConversationsOnBottomScroll?: UnknownGetConversationFunction;
  bottomReferenceDiv: MutableRefObject<HTMLDivElement | null>;
}

const MessageListContext = React.createContext<MessageListContextInterface>(
  {} as MessageListContextInterface,
);
export default MessageListContext;
