import React from "react";

import LMMessageList from "../LMMessageList/LMMessageList";
import LMChatAiChatbotHeader from "./LMChatAiChatbotHeader";
import LMAiChatbotInput from "./LMAiChatbotInput";
import LMChatroom from "../LMChannel/LMChatChatroom";

const LMAiBotScreen: React.FC<LMAiBotScreenProps> = ({
  aiChatbotChatroomId,
}) => {
  return (
    <div className="lm-chat-ai-bot-container">
      <div className="lm-chat-ai-bot-channel">
        <LMChatroom currentChatroomId={aiChatbotChatroomId}>
          <LMChatAiChatbotHeader />
          <LMMessageList />
          <LMAiChatbotInput />
        </LMChatroom>
      </div>
    </div>
  );
};

export default LMAiBotScreen;

export interface LMAiBotScreenProps {
  aiChatbotChatroomId: number;
}
