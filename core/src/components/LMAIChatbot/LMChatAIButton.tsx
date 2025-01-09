import React, {
  FC,
  PropsWithChildren,
  useCallback,
  useMemo,
  useState,
  useEffect,
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
import LMAIChatbotErrorScreen, {
  LMAIChatbotErrorScreenProps,
} from "./LMAIChatbotErrorScreen";
import { LMChatTheme } from "../../enums/lm-chat-theme";

export interface LMChatAIButtonProps {
  buttonText?: string;
  loadingScreenAnimatons?: JSON;
  previewText?: string;
  closeAIChatbot?: () => void;
  showSettingUpChatbotText?: boolean;
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
  const [isAIBotOpen, setIsAIBotOpen] = useState<boolean>(false);
  const [showSettingUpChatbotText, setShowSettingUpChatbotText] =
    useState<boolean>(false);

  // Effect to show  Setting up chatbot text, if loader screen is on for more than 3 seconds
  useEffect(() => {
    if (isAIBotOpen) {
      const timeoutId = setTimeout(() => {
        setShowSettingUpChatbotText(true);
      }, 3000);
      return () => {
        clearTimeout(timeoutId);
        setShowSettingUpChatbotText(false);
      };
    }
  }, [isAIBotOpen]);
  const openAIBot = () => {
    setIsAIBotOpen(true);
  };

  const closeAIBot = () => {
    setIsAIBotOpen(false);
  };

  // Button component for open state
  const openChatbotButton = (
    <button className="lm-chat-ai-bot-fab-button close" onClick={openAIBot}>
      <img src={chatBotIcon} alt="AI Chatbot" />
      <span className="lm-chat-ai-bot-fab-title">{buttonText || `AI Bot`}</span>
    </button>
  );

  // Button component for close state
  const closeChatbotButton = (
    <button className="lm-chat-ai-bot-fab-button open" onClick={closeAIBot}>
      <img src={closeBotIcon} alt="AI Chatbot" />
      <span className="lm-chat-ai-bot-fab-title">Close chat</span>
    </button>
  );

  // This returns a FC with default props loaded
  const returnWithDefaultProps = useCallback(
    (
      previewText: string | undefined,
      loadingScreenAnimations: JSON | undefined,
      showSettingUpChatbotText?: boolean,
    ): FC<LMAIChatbotLoaderScreenProps> => {
      return () => (
        <AIChatbotLoaderScreen
          previewText={previewText}
          loadingScreenAnimatons={loadingScreenAnimations}
          showSettingUpChatbotText={showSettingUpChatbotText}
        />
      );
    },
    [],
  );

  const renderErrorScreenWithDefaultProps = useCallback(
    (errorMessage?: string): FC<LMAIChatbotErrorScreenProps> => {
      return () => <LMAIChatbotErrorScreen errorMessage={errorMessage} />;
    },
    [],
  );

  // Creating the custom Components object
  const customComponentsProp: CustomComponents = useMemo(() => {
    return {
      ...customComponents,
      userNotLoadedLoaderScreen: customComponents?.aiChatbotLoaderScreen
        ? customComponents.aiChatbotLoaderScreen
        : returnWithDefaultProps(
            previewText,
            loadingScreenAnimatons,
            showSettingUpChatbotText,
          ),
      noChatroomSelected: customComponents?.noChatroomSelected
        ? customComponents?.noChatroomSelected
        : returnWithDefaultProps(
            previewText,
            loadingScreenAnimatons,
            showSettingUpChatbotText,
          ),
      userNotLoadedErrorScreen: customComponents?.userNotLoadedErrorScreen
        ? customComponents.userNotLoadedErrorScreen
        : renderErrorScreenWithDefaultProps(),
    };
  }, [
    customComponents,
    loadingScreenAnimatons,
    previewText,
    renderErrorScreenWithDefaultProps,
    returnWithDefaultProps,
    showSettingUpChatbotText,
  ]);

  return (
    <div
      className={`lm-chat-ai-bot-button ${isAIBotOpen ? "open-state" : "close-state"}`}
    >
      <div className="lm-chat-ai-bot-fab-container">
        {isAIBotOpen ? closeChatbotButton : openChatbotButton}
        {isAIBotOpen && (
          <LMClientOverlayProvider
            lmChatCoreCallbacks={lmChatCoreCallbacks}
            client={client}
            userDetails={userDetails}
            customComponents={customComponentsProp}
            lmChatTheme={LMChatTheme.NETWORK_THEME}
          >
            <LMAIChatbot
              previewText={previewText}
              loadingScreenAnimatons={loadingScreenAnimatons}
              closeAIChatbot={closeAIBot}
              showSettingUpChatbotText={showSettingUpChatbotText}
            />
          </LMClientOverlayProvider>
        )}
      </div>
    </div>
  );
};

export default LMChatAIButton;
