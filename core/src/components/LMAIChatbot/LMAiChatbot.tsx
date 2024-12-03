import React, { FC } from "react";
import { useAIChatbot } from "../../hooks/useAiChatbot";
import LMAiBotScreen from "./LMAiBotScreen";
import { LMChatAIButtonProps } from "./LMChatAIButton";
import { AIChatbotLoaderScreen } from "./LMAiChatbotLoaderScreen";
const LMAiChatbot: FC<LMChatAIButtonProps> = ({
  previewText,
  loadingScreenAnimatons,
}) => {
  const { showAnimation, aiChatbotChatroomId } = useAIChatbot();

  const renderAIChatbot = () => {
    if (showAnimation) {
      return (
        <AIChatbotLoaderScreen
          previewText={previewText}
          loadingScreenAnimatons={loadingScreenAnimatons}
        />
      );
    } else {
      return <LMAiBotScreen aiChatbotChatroomId={aiChatbotChatroomId} />;
    }
  };

  return renderAIChatbot();
};

export default LMAiChatbot;
