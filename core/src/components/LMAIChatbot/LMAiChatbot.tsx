import React, { FC } from "react";
import { useAIChatbot } from "../../hooks/useAiChatbot";
import LMAIBotScreen from "./LMAiBotScreen";
import { LMChatAIButtonProps } from "./LMChatAIButton";
import { AIChatbotLoaderScreen } from "./LMAiChatbotLoaderScreen";

const LMAiChatbot: FC<LMChatAIButtonProps> = ({
  previewText,
  loadingScreenAnimatons,
}) => {
  // Variables destructured form Hook
  const { showAnimation, aiChatbotChatroomId } = useAIChatbot();

  // Function for rendering the loading screen and chatroom screen
  const renderAIChatbot = () => {
    if (showAnimation) {
      return (
        <AIChatbotLoaderScreen
          previewText={previewText}
          loadingScreenAnimatons={loadingScreenAnimatons}
        />
      );
    } else {
      if (aiChatbotChatroomId) {
        return <LMAIBotScreen aiChatbotChatroomId={aiChatbotChatroomId} />;
      }
    }
  };

  return renderAIChatbot();
};

export default LMAiChatbot;
