import React, { FC } from "react";
import { useAIChatbot } from "../../hooks/useAiChatbot";
import LMAIBotScreen from "./LMAiBotScreen";
import { LMChatAIButtonProps } from "./LMChatAIButton";
import { AIChatbotLoaderScreen } from "./LMAiChatbotLoaderScreen";

const LMAIChatbot: FC<LMChatAIButtonProps> = ({
  previewText,
  loadingScreenAnimatons,
  closeAIChatbot,
  showSettingUpChatbotText = false,
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
          showSettingUpChatbotText={showSettingUpChatbotText}
        />
      );
    } else {
      if (aiChatbotChatroomId) {
        return (
          <LMAIBotScreen
            closeAIChatbot={closeAIChatbot}
            aiChatbotChatroomId={aiChatbotChatroomId}
          />
        );
      }
    }
  };

  return renderAIChatbot();
};

export default LMAIChatbot;
