import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import LMChatClient from "@likeminds.community/chat-js-beta";

import { Theme } from "./Themes/ThemeClass";
import LMClientOverlayProvider from "./components/LMChatProvider/LMClientOverlayProvider";
import LMChatView from "./components/LMChatView/LMChatView";

import "./App.css";
import { LMClient } from "./types/DataLayerExportsTypes";
import Error from "./shared/Error";
import Channel from "./components/channel/Channel";

const LMAppLayout = () => {
  const myClient: LMClient = LMChatClient.setApiKey(
    "8fa4304d-a5b6-4f10-baeb-a80650a480a4",
  )
    .setPlatformCode("rt")
    .setVersionCode(35)
    .build();
  return (
    <LMClientOverlayProvider client={myClient} theme={new Theme().theme}>
      <LMChatView>
        <Outlet />
      </LMChatView>
    </LMClientOverlayProvider>
  );
};

// Routing
const appRoute = createBrowserRouter([
  {
    path: "/",
    element: <LMAppLayout />,
    children: [
      {
        path: "/",
        element: <Channel />,
      },
    ],
    errorElement: <Error />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(<RouterProvider router={appRoute} />);

export default LMAppLayout;
