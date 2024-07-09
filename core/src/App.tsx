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
  MODE,
  PARTICIPANTS_PATH,
  ROOT_PATH,
} from "./shared/constants/lm.routes.constant";

// import { LMChatProps } from "./types/prop-types/LMChatProps";
import LMChatClient from "@likeminds.community/chat-js-beta";
import { useEffect } from "react";
import { generateToken, messaging } from "./notifications/firebase";
import { onMessage } from "firebase/messaging";

const LMAppLayout = () => {
  useEffect(() => {
    generateToken();
    onMessage(messaging, (payload) => {
      console.log("Message received. ", payload);
    }
  }, []);

  const lmChatClient = LMChatClient.setApiKey(
    "1b442bdc-bec5-4e08-bb41-e13debf97e00",
  )
    .setPlatformCode("rt")
    .setVersionCode(40)
    .build();

  const userDetails = {
    // uuid: "9d296adf-ee24-4d1a-a7e8-d7a7544e9573",
    uuid: "dc41b498-9217-4b00-a658-e1807a105d08",
    username: "",
    isGuest: false,
  };

  return (
    <BrowserRouter>
      <LMClientOverlayProvider client={lmChatClient} userDetails={userDetails}>
        {/* <Outlet /> */}
        <Routes>
          <Route path={ROOT_PATH} element={<LMChannel />}>
            <Route path={MODE + "/"} element={null} />
            <Route
              path={MODE + "/" + ID_PATH}
              element={
                <>
                  <Header />
                  <MessageList />
                  <Input />
                </>
              }
            />

            {/* <Route
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
              path={DM_CHANNEL_PATH + "/" + ID_PATH}
              element={
                <>
                  <Header />
                  <MessageList />
                  <Input />
                </>
              }
            /> */}
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
