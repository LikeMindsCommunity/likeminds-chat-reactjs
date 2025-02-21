import { useEffect, useState } from "react";
import {
  LMChatAIButton,
  LMChatTheme,
  initiateLMClient,
} from "@likeminds.community/likeminds-chat-reactjs";
import React from "react";
import "./App.css";

const App = () => {
  const [userDetails, setUserDetails] = useState<{
    uuid?: string;
    username?: string;
    apiKey?: string;
  }>({
    apiKey: "ENTER YOUT API KEY HERE",
    uuid: "ENTER YOUR UUID HERE",
    username: "ENTER YOUR USERNAME HERE",
  });

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

  return (
    <>
      <LMChatAIButton
        isClearChatOptionEnabled={true}
        client={lmChatClient}
        userDetails={userDetails}
        lmChatTheme={LMChatTheme.NETWORKING_CHAT}
        customComponents={{
          input: {
            chatroomInputAttachmentsSelector: () => null,
          },
        }}
      />
    </>
  );
};

export default App;
