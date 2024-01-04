import React from "react";

interface MessageListContextInterface {
  conversations: string[] | null;
  setConversations: React.Dispatch<string[]> | null;
}

export default React.createContext<MessageListContextInterface>({
  conversations: null,
  setConversations: null,
});
