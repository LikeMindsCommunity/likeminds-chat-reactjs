import Lottie from "lottie-react";
import animationData from "../../assets/animation/AiBotLoader.json";
import React, { useContext } from "react";
import LMGlobalClientProviderContext from "../../context/LMGlobalClientProviderContext";

// Loader component for AI Chatbot
export const AIChatbotLoaderScreen: React.FC<LMAIChatbotLoaderScreenProps> = ({
  previewText,
  loadingScreenAnimatons,
  showSettingUpChatbotText = true,
}) => {
  const { customComponents } = useContext(LMGlobalClientProviderContext);

  // String to show if loading take more than 3 seconds
  const SETTING_UP_CHATBOT_TEXT = "setting up the chatbot";

  if (customComponents?.aiChatbotLoaderScreen) {
    return <customComponents.aiChatbotLoaderScreen />;
  }

  return (
    <div className="lm-chat-ai-bot-container">
      <div className="lm-chat-ai-bot-loader">
        <Lottie
          animationData={loadingScreenAnimatons || animationData}
          height={400}
          width={400}
          loop={true}
        />
        <div className="lm-chai-ai-bot-label">
          {previewText ||
            `${showSettingUpChatbotText ? SETTING_UP_CHATBOT_TEXT : ""}`}
        </div>
      </div>
    </div>
  );
};
export interface LMAIChatbotLoaderScreenProps {
  loadingScreenAnimatons?: JSON;
  previewText?: string;
  showSettingUpChatbotText?: boolean;
}
