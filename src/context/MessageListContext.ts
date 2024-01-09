import React from "react";
import Conversation from "../types/models/conversations";

interface MessageListContextInterface {
  conversations: Conversation[] | null;
  setConversations: React.Dispatch<Conversation[]> | null;
}

export default React.createContext<MessageListContextInterface>({
  conversations: null,
  setConversations: null,
});
