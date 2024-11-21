/* eslint-disable @typescript-eslint/no-explicit-any */
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { useContext, useState } from "react";

import {
  LMClientOverlayProvider,
  LMChannel,
  LMHeader,
  LMInput,
  LMParticipantList,
  LMCoreCallbacks,
  LMMessageList,
  initiateLMClient,
  LMMessageContext,
  // } from "@likeminds.community/likeminds-chat-reactjs";
  // } from "likeminds-chat-reactjs-beta";
} from "./main_index";
import { Toaster } from "react-hot-toast";

import LMChatAIButton from "./components/LMAIChatbot/LMChatAIButton";

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
    apiKey: "aa2a3a49-f371-45de-a071-7cafc1fa927a",
    isGuest: false,
    uuid: "Test User 01",
    username: "Test User 01",
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
          requestOptions,
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
    },
  );

  const lmChatClient = initiateLMClient();

  return (
    <BrowserRouter>
      <LMClientOverlayProvider
        lmChatCoreCallbacks={LMCORECALLBACKS}
        client={lmChatClient}
        userDetails={userDetails}
        customComponents={{
          messageBubbles: {
            customWidget: SampleCustomWidget,
          },
        }}
      >
        <Toaster position="top-right" />

        <Routes>
          <Route path={ROOT_PATH} element={<LMChannel />}>
            <Route path={MODE + "/"} element={null} />
            <Route
              path={MODE + "/" + ID_PATH}
              element={
                // <>
                //   <LMHeader />
                //   <LMMessageList />
                //   <LMInput />
                // </>
                <LMChatAIButton />
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
