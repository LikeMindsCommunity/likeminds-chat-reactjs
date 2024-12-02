import React, { PropsWithChildren, useEffect, useState } from "react";
import chatBotIcon from "../../assets/img/ai-chatbot-icon.png";
import closeBotIcon from "../../assets/img/close-ai-bot.png";
import LMClientOverlayProvider from "../LMChatProvider/LMClientOverlayProvider";
import { LMChatProps } from "../../types/prop-types/LMChatProps";
import LMAiChatbot from "./LMAiChatbot";
import { AIChatbotLoaderScreen } from "./LMAiChatbotLoaderScreen";
import { CustomComponents } from "../../types/prop-types/CustomComponents";

export interface LMChatAIButtonProps {
  buttonText?: string;
  loadingScreenAnimatons?: JSON;
  previewText?: string;
}

const LMChatAIButton: React.FC<
  PropsWithChildren<LMChatAIButtonProps & LMChatProps>
> = ({
  client,
  userDetails,
  lmChatCoreCallbacks,
  customComponents,
  buttonText,
  previewText,
  loadingScreenAnimatons,
}) => {
  const [isAiBotOpen, setIsAiBotOpen] = useState<boolean>(false);
  const openAiBot = () => {
    setIsAiBotOpen(true);
  };

  const closeAiBot = () => {
    setIsAiBotOpen(false);
  };

  const openChatbotButton = (
    <button className="lm-chat-ai-bot-fab-button" onClick={openAiBot}>
      <img src={chatBotIcon} alt="AI Chatbot" />
      <span className="lm-chat-ai-bot-fab-title">
        {buttonText || `AI bot lite`}
      </span>
    </button>
  );

  const closeChatbotButton = (
    <button className="lm-chat-ai-bot-fab-button" onClick={closeAiBot}>
      <img src={closeBotIcon} alt="AI Chatbot" />
      <span className="lm-chat-ai-bot-fab-title">Close Chat</span>
    </button>
  );

  const customComponentsProp: CustomComponents = {
    ...customComponents,
    userNotLoadedLoaderScreen: customComponents?.aiChatbotLoaderScreen
      ? customComponents.aiChatbotLoaderScreen
      : AIChatbotLoaderScreen,
  };

  useEffect(() => {
    if (isAiBotOpen) {
      console.time("ai-chatbot-open");
    }
  }, [isAiBotOpen]);

  return (
    <>
      <div className="lm-chat-ai-bot-fab-container">
        {isAiBotOpen ? closeChatbotButton : openChatbotButton}
        {isAiBotOpen && (
          <LMClientOverlayProvider
            lmChatCoreCallbacks={lmChatCoreCallbacks}
            client={client}
            userDetails={userDetails}
            customComponents={customComponentsProp}
          >
            <LMAiChatbot
              previewText={previewText}
              loadingScreenAnimatons={loadingScreenAnimatons}
            />
          </LMClientOverlayProvider>
        )}
      </div>
    </>
  );
};

export default LMChatAIButton;
