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

import {
  LMCoreCallbacks,
  LMSDKCallbacksImplementations,
} from "./LMSDKCoreCallbacks";
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
    // apiKey: "1b442bdc-bec5-4e08-bb41-e13debf97e00",
    // isGuest: false,
    // uuid: "a6c65e80-e4f9-407a-9e1e-6f67aa362ab9",
    // username: "kurama",
    accessToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoic2ZoUU12b1c3RmdMMHl0d1lRckFPcU1pbGUrRFJqTzBJa3NCRnp2bXZBeGV2ZzhFblBoZ3JEZFFUejBPS3JlRXFVQlhOVUVLQTd6QWhoWEpjY1dHQzBISFZ0cUhkVXRFNENKV2w3U3RUOFhLOXArRGNKNXR3OVg1N250SWNGR0lVWUFKL0M0Y1M0VzU5QjdpbWVNenVLeTRRL0tXYmFna04rSDlJODZMdmE3Ym1aZlZBUVp3Z09FaWVrMkYzVjF0ZVVzeUNZbVFwUkR4ZlN3Qk0zU2pzenBYckUwRkFjK2pycXdNWElVejZKQTU1QldNNms3UXhaWnhGWmtqd3NvdEtwRE0yUWJ0a20rRnJ1U2oiLCJleHAiOjE3MjA3NzQ1MTl9.gfp_Ssoho5ZKYUlT_HdgFpWy9hX-axWudjC_FCisBo8",
    refreshToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoieWUyenZVVklEN0hUbS9HTHA2Q2UzWi8rajE2SUJVMlFpbzZHYmxORFZLYWVpVVhQc0xFTXUvZ0pJQzBvVTlWSkpMU1JwYWpGajAvNTdqdjRBK3lMaTYvam1GOHZuZk5LSDhNamNuZDArdENoQ1p4ZS9ZSzhqTHBTT3NJWk82UWMySmFMakxXMno5MmRkVU5FcjZOR3FiRG1LRmFrWHBDMlJFVEZFaFJkaHYwaDFaYkhHb1F3NENCOGh1c3owdmtPUXdRL2dqYnBhQ2RnbGlzRHg5OXNLNW5EWHVxK0dINkRmTjNvN0FpWDlHSGJ2OXB2aml5bFNhUUh0akFhQ1NZemRyK3NDTDBVYnNTckU0cVVCQT09IiwiZXhwIjoxNzIwNzc0NTc5fQ.c_tyIirTtGtLG-1VW2x9GeHlun-GyzXrf80hTcwsoCI",
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
      myHeaders.append("x-api-key", "1b442bdc-bec5-4e08-bb41-e13debf97e00");
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
        user_unique_id: "a6c65e80-e4f9-407a-9e1e-6f67aa362ab9",
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
        console.log(result_1);
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

  const lmChatClient = LMChatClient.setPlatformCode("rt")
    .setVersionCode(40)
    .build();
  const sdk = new LMSDKCallbacksImplementations(LMCORECALLBACKS, lmChatClient);
  lmChatClient.setLMSDKCallbacks(sdk);
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
