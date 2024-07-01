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

import { LMChatProps } from "./types/prop-types/LMChatProps";
import LMChatClient from "@likeminds.community/chat-js-beta";

const LMAppLayout = () => {
  const lmChatClient = LMChatClient.setApiKey(
    "2db78d4b-5523-4350-9a44-1020299aebad",
  )
    .setPlatformCode("rt")
    .setVersionCode(40)
    .build();

  const userDetails = {
    uuid: "new-chat-client-user",
    username: "new client",
    isGuest: false,
  };

  return (
    <BrowserRouter>
      <LMClientOverlayProvider client={lmChatClient} userDetails={userDetails}>
        {/* <Outlet /> */}
        <Routes>
          <Route path={ROOT_PATH} element={<LMChannel />}>
            <Route
              path={CHANNEL_PATH + "/" + ID_PATH}
              element={
                <>
                  <Header />
                  <MessageList />
                  <Input />
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
    errorElement: null,
  },
]);

export default LMAppLayout;
