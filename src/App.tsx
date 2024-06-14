import { createBrowserRouter, Outlet } from "react-router-dom";
import LMChatClient from "@likeminds.community/chat-js-beta";

import { Theme } from "./Themes/ThemeClass";
import LMClientOverlayProvider from "./components/LMChatProvider/LMClientOverlayProvider";
// import LMChatView from "./components/LMChatView/LMChatView";

import "./App.css";
import { LMClient } from "./types/DataLayerExportsTypes";
import Error from "./shared/components/Error";
import Channel from "./components/channel/Channel";

const LMAppLayout = () => {
  const myClient: LMClient = LMChatClient.setApiKey(
    "01b4e80f-29e7-45ad-b914-69d61ffc130d",
  )
    .setPlatformCode("rt")
    .setVersionCode(35)
    .build();
  return (
    <LMClientOverlayProvider client={myClient} theme={new Theme().theme}>
      {/* <LMChatView> */}
      <Outlet />
      {/* </LMChatView> */}
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
        path: "/community",
        element: <Channel />,
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
