import { createBrowserRouter, Outlet } from "react-router-dom";
import LMChatClient from "@likeminds.community/chat-js-beta";
import LMClientOverlayProvider from "./components/LMChatProvider/LMClientOverlayProvider";
import "./App.css";
import { LMClient } from "./types/DataLayerExportsTypes";
import Error from "./shared/components/Error";
import Channel from "./components/channel/Channel";

const LMAppLayout = () => {
  const myClient: LMClient = LMChatClient.setApiKey(
    "ac8ee360-dedb-462f-93f1-fd400ca343a7",
  )
    .setPlatformCode("rt")
    .setVersionCode(35)
    .build();
  console.log(myClient);
  return (
    <LMClientOverlayProvider client={myClient}>
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
        path: "/",
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
