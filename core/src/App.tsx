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

const LMAppLayout = () => {
  const lmChatClient = LMChatClient.setApiKey(
    "5f567ca1-9d74-4a1b-be8b-a7a81fef796f",
  )
    .setPlatformCode("rt")
    .setVersionCode(40)
    .build();

  const userDetails = {
    uuid: "07012200-9c3c-4990-997e-bfde683d911b",
    username: "Gaurav Rajput",
    isGuest: false,
  };

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
                  <Header />
                  <MessageList />
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
                <Header />
                <MessageList />
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
