import Lottie from "lottie-react";
import animationData from "../../assets/animation/AiBotLoader.json";
import React, { useContext } from "react";
import { LMGlobalClientProviderContext } from "../../main_index";

export const AIChatbotLoaderScreen: React.FC<LMAIChatbotLoaderScreenProps> = ({
  previewText,
  loadingScreenAnimatons,
}) => {
  const { customComponents } = useContext(LMGlobalClientProviderContext);
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
          {previewText || `Setting up AI chatbot`}
        </div>
      </div>
    </div>
  );
};
export interface LMAIChatbotLoaderScreenProps {
  loadingScreenAnimatons?: JSON;
  previewText?: string;
}
