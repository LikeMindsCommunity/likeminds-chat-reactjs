import React from "react";
import ErrorScreen from "../../assets/img/error-5XX.png";

const LMAIChatbotErrorScreen: React.FC<LMAIChatbotErrorScreenProps> = ({
  errorMessage,
}) => {
  return (
    <div className="lm-chat-ai-bot-container lm-ai-chatbot-error-state">
      <img src={ErrorScreen} alt="error-screen" />
      <span className="lm-chat-error-message-text">
        {`An error occured` + `${errorMessage ? " " + errorMessage : ""}`}
      </span>
    </div>
  );
};

export default LMAIChatbotErrorScreen;

export interface LMAIChatbotErrorScreenProps {
  errorMessage?: string;
}
