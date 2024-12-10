/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useContext, useState } from "react";
import animationData from "./assets/animation/AiBotLoader.json";
import {
  initiateLMClient,
  LMMessageContext,
  // } from "@likeminds.community/likeminds-chat-reactjs";
  // } from "likeminds-chat-reactjs-beta";
} from "./old_index";

// import LMChatAIButton from "./components/LMAIChatbot/LMChatAIButton";
// import { LMChatCurrentMode } from "./enums/lm-chat-modes";
import LMChatAIButton from "./components/LMAIChatbot/LMChatAIButton";
import Lottie from "lottie-react";

const LMAppLayout = () => {
  const [userDetails, setUserDetails] = useState<{
    accessToken?: string;
    refreshToken?: string;
    uuid?: string;
    username?: string;
    isGuest?: boolean;
    apiKey?: string;
  }>({
    // apiKey: "d4356d31-306e-406d-aa4a-cd49f1b88f19",
    // Beta Key Below
    // apiKey: "aa2a3a49-f371-45de-a071-7cafc1fa927a",
    // AI chatbot key below
    apiKey: "3966d591-3ba1-46db-b25b-69a45e1414f3",
    isGuest: false,
    uuid: "Test User 62",
    username: "Test User 62",
  });

  const lmChatClient = initiateLMClient();

  return <LMChatAIButton client={lmChatClient} userDetails={userDetails} />;
};

export const ROOT_PATH = "/";
export const ID_PATH = ":id";
export const MODE = ":mode";
export const CHANNEL_PATH = "channel";
export const DM_CHANNEL_PATH = "dm";
export const PARTICIPANTS_PATH = "participants";
export const PAGE_NOT_FOUND_PATH = "404";

export default LMAppLayout;

// Write a custom widget

const SampleCustomWidget: React.FC = () => {
  const { message } = useContext(LMMessageContext);
  return (
    <div>
      <h1>Hello World</h1>
      <select>
        <option value="1">1</option>
        <option value="1">1</option>
        <option value="1">1</option>
        <option value="1">1</option>
        <option value="1">1</option>
      </select>
      {`Ye h message ${JSON.stringify(message.widget)}`}
    </div>
  );
};
