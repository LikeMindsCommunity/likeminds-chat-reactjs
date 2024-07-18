import React, { useContext } from "react";
import { LMChatChatroomContext } from "../../context/LMChatChatroomContext";

const LMChatChatroomTopic = () => {
  const { chatroom } = useContext(LMChatChatroomContext);

  if (!chatroom) {
    return null;
  }
  return <div></div>;
};

export default LMChatChatroomTopic;
