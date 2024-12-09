import { useEffect, useState } from "react";

import {
  LMChatAIButton,
  initiateLMClient,
  // } from "@likeminds.community/likeminds-chat-reactjs";
} from "likeminds-chat-reactjs-beta";
import React from "react";
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

  return <LMChatAIButton client={lmChatClient} userDetails={userDetails} />;
};

export default App;
