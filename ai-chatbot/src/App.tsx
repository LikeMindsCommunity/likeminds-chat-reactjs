import { useEffect, useState } from "react";
import {
  LMChatAIButton,
  LMChatTheme,
  initiateLMClient,
} from "@likeminds.community/likeminds-chat-reactjs";
import React from "react";
import "./App.css";
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

  // const lmChatClient = initiateLMClient();
  const VERSION_CODE = 42;
  const PLATFORM_CODE = "rt";

  const lmChatClient = LMChatClient.setPlatformCode(PLATFORM_CODE)
    .setVersionCode(VERSION_CODE)
    .setExcludedConversationStates([])
    .build();
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

  return (
    <LMChatAIButton
      client={lmChatClient}
      userDetails={{
        apiKey: "aa2a3a49-f371-45de-a071-7cafc1fa927a",
        uuid: "NEW_ANUJ_USER_04",
        username: "NEW_ANUJ_USER_04",
      }}
      lmChatCoreCallbacks={}
      // userDetails={userDetails}
      lmChatTheme={LMChatTheme.NETWORKING_CHAT}
    />
  );
};

export default App;
