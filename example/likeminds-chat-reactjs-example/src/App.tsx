import LMChatClient from "@likeminds.community/chat-js";
import "./App.css";
import { LMAppLayout } from "likeminds-chat-reactjs-beta";
export const ROOT_PATH = "/";
export const ID_PATH = ":id";
export const CHANNEL_PATH = "channel";
export const PARTICIPANTS_PATH = "participants";
export const PAGE_NOT_FOUND_PATH = "404";
export const API_KEY = "";
export const PLATFORM_CODE = "";
export const VERSION_CODE = 45;

function App() {
  const myClient = LMChatClient.setApiKey("")
    .setPlatformCode("rt")
    .setVersionCode(40)
    .build();
  return (
    <LMAppLayout
      client={myClient}
      userDetails={{
        username: "",
        uuid: "",
        isGuest: false,
      }}
    />
  );
}

export default App;
