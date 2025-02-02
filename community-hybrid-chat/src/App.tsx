import { useEffect, useState } from "react";
import {
  LMClientOverlayProvider,
  LMChannel,
  initiateLMClient,
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
    <LMClientOverlayProvider
      client={lmChatClient}
      // userDetails={userDetails}
      userDetails={{
        apiKey: "c142bc84-4c40-4412-ad09-c7e59b93a2ca",
        uuid: "Test_User_01",
        username: "Test_User_01",
      }}
      lmChatTheme={LMChatTheme.COMMUNITY_HYBRID_CHAT}
    >
      <LMChannel />
    </LMClientOverlayProvider>
  );
};
export default App;
