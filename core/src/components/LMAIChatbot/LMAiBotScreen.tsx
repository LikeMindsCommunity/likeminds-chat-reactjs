import React from "react";

import LMMessageList from "../LMMessageList/LMMessageList";

import LMChatAiChatbotHeader from "./LMChatAiChatbotHeader";
import LMAiChatbotInput from "./LMAiChatbotInput";

const LMAiBotScreen = () => {
  return (
    <div className="lm-chat-ai-bot-channel">
      <LMChatAiChatbotHeader />
      <LMMessageList />
      <LMAiChatbotInput />
    </div>
    // <LMChatAIButton />
  );
};

export default LMAiBotScreen;
