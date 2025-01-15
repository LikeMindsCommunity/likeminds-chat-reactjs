import { useEffect, useState } from "react";
import {
  LMClientOverlayProvider,
  LMChannel,
  initiateLMClient,
  LMChatCurrentMode,
  LMChatTheme,
} from "@likeminds.community/likeminds-chat-reactjs";
import "./App.css";
const App = () => {
  const [userDetails, setUserDetails] = useState<{
    accessToken?: string;
    refreshToken?: string;
    uuid?: string;
    username?: string;
    isGuest?: boolean;
    apiKey?: string;
  }>({});
  const [currentChatMode, setCurrentChatMode] = useState<LMChatCurrentMode>(
    LMChatCurrentMode.GROUP_CHAT
  );
  const lmChatClient = initiateLMClient();

  useEffect(() => {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const apiKey = params.get("apiKey");
    const uuid = params.get("uuid");
    const username = params.get("username");
    setUserDetails({
      apiKey: apiKey || "",
      uuid: uuid || "",
      username: username || "",
    });
  }, []);
  function changeChatMode(mode: LMChatCurrentMode) {
    setCurrentChatMode(mode);
  }
  return (
    <>
      <div className="chat-switcher">
        <button
          className="community-chat chat-switch"
          onClick={() => {
            changeChatMode(LMChatCurrentMode.GROUP_CHAT);
          }}
        >
          Community
        </button>
        <button
          className="network-chat chat-switch"
          onClick={() => {
            changeChatMode(LMChatCurrentMode.DIRECT_MESSAGE);
          }}
        >
          DM
        </button>
      </div>
      <LMClientOverlayProvider
        client={lmChatClient}
        userDetails={userDetails}
        lmChatTheme={LMChatTheme.COMMUNITY_HYBRID_CHAT}
      >
        <LMChannel currentMode={currentChatMode} />
      </LMClientOverlayProvider>
    </>
  );
};
export default App;
