import React from "react";

interface InputContextInterface {
  replyConversation: unknown;
}

export default React.createContext<InputContextInterface>({
  replyConversation: null,
});
