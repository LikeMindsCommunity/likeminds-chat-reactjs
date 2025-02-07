import { useEffect, useState } from "react";
import {
  LMClientOverlayProvider,
  LMChannel,
  initiateLMClient,
  LMChatCurrentMode,
  LMChatTheme,
} from "@likeminds.community/likeminds-chat-reactjs";
import LMChatClient from "@likeminds.community/chat-js-beta";

const App = () => {
  const [userDetails, setUserDetails] = useState<{
    accessToken?: string;
    refreshToken?: string;
    uuid?: string;
    username?: string;
    isGuest?: boolean;
    apiKey?: string;
  }>({});

  const VERSION_CODE = 42;
  const PLATFORM_CODE = "rt";
  const EXCLUDED_CONVERSATION_STATES = [] as number[];
  const lmChatClient = LMChatClient.setPlatformCode(PLATFORM_CODE)
    .setVersionCode(VERSION_CODE)
    .setExcludedConversationStates(EXCLUDED_CONVERSATION_STATES)
    .build();
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
      lmChatTheme={LMChatTheme.COMMUNITY_CHAT}
    >
      <LMChannel />
    </LMClientOverlayProvider>
  );
};
export default App;
