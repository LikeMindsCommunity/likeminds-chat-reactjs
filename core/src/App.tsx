import {
  BrowserRouter,
  createBrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import LMClientOverlayProvider from "./components/LMChatProvider/LMClientOverlayProvider";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import LMParticipantList from "./components/LMParticipant/LMParticipantList";
import LMHeader from "./components/LMHeader/LMHeader";
import LMMessageList from "./components/LMMessageList/LMMessageList";
import LMInput from "./components/LMInput/LMInput";
import LMChannel from "./components/LMChannel/LMChannel";
import {
  CHANNEL_PATH,
  ID_PATH,
  MODE,
  PARTICIPANTS_PATH,
  ROOT_PATH,
} from "./shared/constants/lm.routes.constant";

import LMChatClient from "@likeminds.community/chat-js-beta";
import { Toaster } from "react-hot-toast";
import { UserDetails } from "./context/GlobalClientProviderContext";
import { LMCoreCallbacks } from "./LMSDKCoreCallbacks";
import { useState } from "react";

const LMAppLayout = () => {
  const [userDetails, setUserDetails] = useState<{
    accessToken?: string;
    refreshToken?: string;
    uuid?: string;
    username?: string;
    isGuest?: boolean;
    apiKey?: string;
  }>({
    apiKey: "5f567ca1-9d74-4a1b-be8b-a7a81fef796f",
    isGuest: false,
    uuid: "07012200-9c3c-4990-997e-bfde683d911b",
    username: "Gaurav Rajput",
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
      myHeaders.append("x-version-code", "1");
      myHeaders.append("x-sdk-source", "feed");
      myHeaders.append("Content-Type", "application/json");

      interface RequestBody {
        user_name: string;
        user_unique_id: string;
        token_expiry_beta: number;
        rtm_token_expiry_beta: number;
      }

      const raw: RequestBody = {
        user_name: "",
        user_unique_id: "",
        token_expiry_beta: 2,
        rtm_token_expiry_beta: 4,
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
        alert(`Error occoured: ${error}`);
        return {
          accessToken: "",
          refreshToken: "",
        };
      }
    },
  );

  const lmChatClient = LMChatClient.setLMSDKCallbacks(LMCORECALLBACKS)
    .setPlatformCode("rt")
    .setVersionCode(40)
    .build();

  return (
    <BrowserRouter>
      <LMClientOverlayProvider client={lmChatClient} userDetails={userDetails}>
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

// Routing
export const appRoute = createBrowserRouter([
  {
    path: ROOT_PATH,
    element: <LMAppLayout />,
    children: [
      {
        path: ROOT_PATH,
        element: <LMChannel />,
        children: [
          {
            path: CHANNEL_PATH + "/" + ID_PATH,
            element: (
              <>
                <LMHeader />
                <LMMessageList />
                <LMInput />
              </>
            ),
          },
          {
            path: PARTICIPANTS_PATH + "/" + ID_PATH,
            element: <LMParticipantList />,
          },
        ],
      },
    ],
    errorElement: null,
  },
]);

export default LMAppLayout;
