import React, {
  FC,
  PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from "react";
import chatBotIcon from "../../assets/img/ai-chatbot-icon.png";
import closeBotIcon from "../../assets/img/close-ai-bot.png";
import LMClientOverlayProvider from "../LMChatProvider/LMClientOverlayProvider";
import { LMChatProps } from "../../types/prop-types/LMChatProps";
import LMAIChatbot from "./LMAiChatbot";
import {
  AIChatbotLoaderScreen,
  LMAIChatbotLoaderScreenProps,
} from "./LMAiChatbotLoaderScreen";
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

  const openAIBot = () => {
    setIsAiBotOpen(true);
  };

  const closeAIBot = () => {
    setIsAiBotOpen(false);
  };

  // Button component for open state
  const openChatbotButton = (
    <button className="lm-chat-ai-bot-fab-button" onClick={openAIBot}>
      <img src={chatBotIcon} alt="AI Chatbot" />
      <span className="lm-chat-ai-bot-fab-title">
        {buttonText || `AI bot lite`}
      </span>
    </button>
  );

  // Button component for close state
  const closeChatbotButton = (
    <button className="lm-chat-ai-bot-fab-button" onClick={closeAIBot}>
      <img src={closeBotIcon} alt="AI Chatbot" />
      <span className="lm-chat-ai-bot-fab-title">Close Chat</span>
    </button>
  );

  // This returns a FC with default props loaded
  const returnWithDefaultProps = useCallback(
    (
      previewText: string | undefined,
      loadingScreenAnimations: JSON | undefined,
    ): FC<LMAIChatbotLoaderScreenProps> => {
      return () => (
        <AIChatbotLoaderScreen
          previewText={previewText}
          loadingScreenAnimatons={loadingScreenAnimations}
        />
      );
    },
    [],
  );

  // Creating the custom Components object
  const customComponentsProp: CustomComponents = useMemo(() => {
    return {
      ...customComponents,
      userNotLoadedLoaderScreen: customComponents?.aiChatbotLoaderScreen
        ? customComponents.aiChatbotLoaderScreen
        : returnWithDefaultProps(previewText, loadingScreenAnimatons),
      noChatroomSelected: customComponents?.noChatroomSelected
        ? customComponents?.noChatroomSelected
        : returnWithDefaultProps(previewText, loadingScreenAnimatons),
    };
  }, [
    customComponents,
    loadingScreenAnimatons,
    previewText,
    returnWithDefaultProps,
  ]);

  return (
    <div className="lm-chat-ai-bot-fab-container">
      {isAiBotOpen ? closeChatbotButton : openChatbotButton}
      {isAiBotOpen && (
        <LMClientOverlayProvider
          lmChatCoreCallbacks={lmChatCoreCallbacks}
          client={client}
          userDetails={userDetails}
          customComponents={customComponentsProp}
        >
          <LMAIChatbot
            previewText={previewText}
            loadingScreenAnimatons={loadingScreenAnimatons}
          />
        </LMClientOverlayProvider>
      )}
    </div>
  );
};

export default LMChatAIButton;
