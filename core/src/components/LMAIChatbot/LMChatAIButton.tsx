import React from "react";
import chatBotIcon from "../../assets/img/ai-chatbot-icon.png";
import closeBotIcon from "../../assets/img/close-ai-bot.png";
import { useAiChatbot } from "../../hooks/useAiChatbot";
import LMAiBotScreen from "./LMAiBotScreen";
import Lottie from "lottie-react";
import animationData from "../../assets/animation/AiBotLoader.json";
const LMChatAIButton = () => {
  const { isAiBotOpen, openAiBot, closeAiBot, showAnimation } = useAiChatbot();
  const openChatbotButton = (
    <button className="lm-chat-ai-bot-fab-button" onClick={openAiBot}>
      <img src={chatBotIcon} alt="AI Chatbot" />
      <span className="lm-chat-ai-bot-fab-title">AI bot lite</span>
    </button>
  );
  const closeChatbotButton = (
    <button className="lm-chat-ai-bot-fab-button" onClick={closeAiBot}>
      <img src={closeBotIcon} alt="AI Chatbot" />
      <span className="lm-chat-ai-bot-fab-title">Close Chat</span>
    </button>
  );
  const renderAiChatbot = () => {
    if (isAiBotOpen) {
      if (!showAnimation) {
        return loaderScreen();
      } else {
        return <LMAiBotScreen />;
      }
    }
  };
  const loaderScreen = () => {
    return (
      <div className="lm-chat-ai-bot-loader">
        <Lottie
          animationData={animationData}
          height={400}
          width={400}
          loop={true}
        />
      </div>
    );
  };
  return (
    <>
      <div className="lm-chat-ai-bot-fab-container">
        {isAiBotOpen ? closeChatbotButton : openChatbotButton}
        {isAiBotOpen && (
          <div className="lm-chat-ai-bot-container">{renderAiChatbot()}</div>
        )}
      </div>
    </>
  );
};

export default LMChatAIButton;
