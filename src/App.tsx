import { createBrowserRouter, Outlet } from "react-router-dom";
import LMChatClient from "@likeminds.community/chat-js-beta";
import LMClientOverlayProvider from "./components/LMChatProvider/LMClientOverlayProvider";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { LMClient } from "./types/DataLayerExportsTypes";
import Error from "./shared/components/Error";
import Channel from "./components/channel/Channel";
import LMParticipantList from "./components/LMParticipant/LMParticipantList";
//import LMChatChatroom from "./components/channel/LMChatChatroom";
import Header from "./components/Header/Header";
import MessageList from "./components/LMMessageList/MessageList";
import Input from "./components/LMInput/Input";

const LMAppLayout = () => {
  const myClient: LMClient = LMChatClient.setApiKey(
    "ac8ee360-dedb-462f-93f1-fd400ca343a7",
  )
    .setPlatformCode("rt")
    .setVersionCode(45)
    .build();
  console.log(myClient);
  return (
    <LMClientOverlayProvider client={myClient}>
      <Outlet />
    </LMClientOverlayProvider>
  );
};

// Routing
export const appRoute = createBrowserRouter([
  {
    path: "/",
    element: <LMAppLayout />,
    children: [
      {
        path: "/",
        element: <Channel />,
        children: [
          {
            path: "chat/:id",
            element: (
              <>
                <Header />
                <MessageList />
                <Input />
              </>
            ),
          },
          {
            path: "participants/:id",
            element: <LMParticipantList />,
          },
        ],
      },
    ],
    errorElement: <Error />,
  },
]);

// const root = ReactDOM.createRoot(
//   document.getElementById("root") as HTMLElement,
// );
// root.render(<RouterProvider router={appRoute} />);

export default LMAppLayout;
