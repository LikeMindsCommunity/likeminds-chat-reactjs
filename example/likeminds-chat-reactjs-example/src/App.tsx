import { BrowserRouter, Route, Routes } from "react-router-dom";

import { useState } from "react";
// import LMChatClient from "@likeminds.community/chat-js";
import {
  LMClientOverlayProvider,
  LMChannel,
  LMHeader,
  LMInput,
  LMParticipantList,
  LMCoreCallbacks,
  LMMessageList,
  initiateLMClient,
} from "@likeminds.community/likeminds-chat-reactjs";
import { Toaster } from "react-hot-toast";

const LMAppLayout = () => {
  const [userDetails, setUserDetails] = useState<{
    accessToken?: string;
    refreshToken?: string;
    uuid?: string;
    username?: string;
    isGuest?: boolean;
    apiKey?: string;
  }>({
    apiKey: "",
    isGuest: false,
    uuid: "",
    username: "",
  });
  const LMCORECALLBACKS = new LMCoreCallbacks(
    (a: string, b: string) => {
      setUserDetails((userDetails) => {
        userDetails.accessToken = a;
        userDetails.refreshToken = b;
        return userDetails;
      });
    },
    async () => {
      const myHeaders = new Headers();
      myHeaders.append("x-api-key", "");
      myHeaders.append("x-platform-code", "rt");
      myHeaders.append("x-version-code", "40");
      myHeaders.append("x-sdk-source", "chat");
      myHeaders.append("Content-Type", "application/json");

      interface RequestBody {
        user_name: string;
        user_unique_id: string;
        token_expiry_beta: number;
        rtm_token_expiry_beta: number;
        is_guest?: boolean;
      }

      const raw: RequestBody = {
        user_name: "",
        is_guest: false,
        user_unique_id: "",
        token_expiry_beta: 1,
        rtm_token_expiry_beta: 2,
      };

      const requestOptions: RequestInit = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(raw),
        redirect: "follow",
      };

      try {
        const response = await fetch(
          "https://betaauth.likeminds.community/sdk/initiate",
          requestOptions
        );
        const result_1 = await response.json();

        return {
          accessToken: result_1.data.access_token,
          refreshToken: result_1.data.refresh_token,
        };
      } catch (error) {
        console.log(error);

        return {
          accessToken: "",
          refreshToken: "",
        };
      }
    }
  );

  const lmChatClient = initiateLMClient();

  return (
    <BrowserRouter>
      <LMClientOverlayProvider
        lmChatCoreCallbacks={LMCORECALLBACKS}
        client={lmChatClient}
        userDetails={userDetails}
      >
        <Toaster position="top-right" />
        <Routes>
          <Route path={ROOT_PATH} element={<LMChannel />}>
            <Route path={MODE + "/"} element={null} />
            <Route
              path={MODE + "/" + ID_PATH}
              element={
                <>
                  <LMHeader />
                  <LMMessageList />
                  <LMInput />
                </>
              }
            />
            <Route
              path={PARTICIPANTS_PATH + "/" + ID_PATH}
              element={<LMParticipantList />}
            />
          </Route>
        </Routes>
      </LMClientOverlayProvider>
    </BrowserRouter>
  );
};

export const ROOT_PATH = "/";
export const ID_PATH = ":id";
export const MODE = ":mode";
export const CHANNEL_PATH = "channel";
export const DM_CHANNEL_PATH = "dm";
export const PARTICIPANTS_PATH = "participants";
export const PAGE_NOT_FOUND_PATH = "404";

export default LMAppLayout;
