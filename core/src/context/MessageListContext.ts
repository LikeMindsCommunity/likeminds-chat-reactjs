import React, { MutableRefObject } from "react";
import Conversation from "../types/models/conversations";
import { UnknownGetConversationFunction } from "../hooks/useChatroom";
import { ZeroArgVoidReturns } from "../hooks/useInput";

interface MessageListContextInterface {
  conversations: Conversation[] | null;
  // setConversations: React.Dispatch<Conversation[]> | null;
  getChatroomConversationsOnTopScroll?: UnknownGetConversationFunction;
  getChatroomConversationsOnBottomScroll?: UnknownGetConversationFunction;
  bottomReferenceDiv: MutableRefObject<HTMLDivElement | null>;
  messageListContainerRef: MutableRefObject<HTMLDivElement | null>;
  unBlockUserInDM: ZeroArgVoidReturns;
}

const MessageListContext = React.createContext<MessageListContextInterface>(
  {} as MessageListContextInterface,
);
export default MessageListContext;
