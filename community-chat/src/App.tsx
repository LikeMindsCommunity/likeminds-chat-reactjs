import { useEffect, useState } from "react";
import {
  LMClientOverlayProvider,
  LMChannel,
  initiateLMClient,
  LMChatCurrentMode,
  LMChatTheme,
} from "@likeminds.community/likeminds-chat-reactjs";

const App = () => {
  const [userDetails, setUserDetails] = useState<{
    accessToken?: string;
    refreshToken?: string;
    uuid?: string;
    username?: string;
    isGuest?: boolean;
    apiKey?: string;
  }>({});

  const lmChatClient = initiateLMClient();

  useEffect(() => {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const apiKey = params.get("apiKey") || "";
    const uuid = params.get("uuid") || "";
    const username = params.get("username") || "";
    setUserDetails({
      apiKey: apiKey,
      uuid: uuid,
      username: username,
    });
  }, []);

  return (
    <LMClientOverlayProvider
      client={lmChatClient}
      userDetails={userDetails}
      lmChatTheme={LMChatTheme.COMMUNITY_THEME}
    >
      <LMChannel currentMode={LMChatCurrentMode.GROUP_CHAT} />
    </LMClientOverlayProvider>
  );
};
export default App;
