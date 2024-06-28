import { createBrowserRouter, Outlet } from "react-router-dom";
import LMChatClient from "@likeminds.community/chat-js-beta";
import LMClientOverlayProvider from "./components/LMChatProvider/LMClientOverlayProvider";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { LMClient } from "./types/DataLayerExportsTypes";
import Error from "./shared/components/Error";

import LMParticipantList from "./components/LMParticipant/LMParticipantList";
import Header from "./components/LMHeader/LMHeader";
import MessageList from "./components/LMMessageList/LMMessageList";
import Input from "./components/LMInput/Input";
import LMChannel from "./components/LMChannel/LMChannel";
import {
  CHANNEL_PATH,
  ID_PATH,
  PARTICIPANTS_PATH,
  ROOT_PATH,
} from "./shared/constants/lm.routes.constant";
import {
  API_KEY,
  PLATFORM_CODE,
  VERSION_CODE,
} from "./shared/constants/lm.api.constant";

const LMAppLayout = () => {
  const myClient: LMClient = LMChatClient.setApiKey(API_KEY)
    .setPlatformCode(PLATFORM_CODE)
    .setVersionCode(VERSION_CODE)
    .build();
  return (
    <LMClientOverlayProvider client={myClient}>
      <Outlet />
    </LMClientOverlayProvider>
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
                <Header />
                <MessageList />
                <Input />
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
    errorElement: <Error />,
  },
]);

export default LMAppLayout;
