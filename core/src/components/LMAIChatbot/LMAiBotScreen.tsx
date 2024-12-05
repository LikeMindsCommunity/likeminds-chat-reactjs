import React from "react";

import LMMessageList from "../LMMessageList/LMMessageList";
import LMChatAIChatbotHeader from "./LMChatAiChatbotHeader";
import LMAIChatbotInput from "./LMAiChatbotInput";
import LMChatroom from "../LMChannel/LMChatChatroom";

const LMAIBotScreen: React.FC<LMAiBotScreenProps> = ({
  aiChatbotChatroomId,
}) => {
  return (
    <LMChatroom currentChatroomId={aiChatbotChatroomId}>
      <div className="lm-chat-ai-bot-container">
        <div className="lm-chat-ai-bot-channel">
          <LMChatAIChatbotHeader />
          <LMMessageList />
          <LMAIChatbotInput />
        </div>
      </div>
    </LMChatroom>
  );
};

export default LMAIBotScreen;

export interface LMAiBotScreenProps {
  aiChatbotChatroomId: number;
}
