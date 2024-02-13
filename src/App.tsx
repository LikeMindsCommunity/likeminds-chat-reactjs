// import { useContext } from "react";
import { Theme } from "./Themes/ThemeClass";
import Header from "./components/Header/Header";
import LMClientOverlayProvider from "./components/LMChatProvider/LMClientOverlayProvider";
import LMChatView from "./components/LMChatView/LMChatView";
import Input from "./components/LMInput/Input";
import MessageList from "./components/LMMessageList/MessageList";
// import MessageContext from "./context/MessageContext";
import LMChatClient from "@likeminds.community/chat-js-beta";

import "./App.css";
import LMChannelList from "./components/LMChannelList/LMChannelList";
import { LMClient } from "./types/DataLayerExportsTypes";

function App() {
  const myClient: LMClient = LMChatClient.setApiKey(
    "8fa4304d-a5b6-4f10-baeb-a80650a480a4"
  )
    .setPlatformCode("rt")
    .setVersionCode(35)
    .build();
  return (
    <>
      <LMClientOverlayProvider client={myClient} theme={new Theme().theme}>
        <LMChatView>
          <div className="d-flex">
            <div className="lm-left-panel">
              <LMChannelList />
            </div>
            <div className="lm-right-panel d-flex flex-direction">
              <Header />
              <MessageList />
              <Input />
            </div>
          </div>
        </LMChatView>
      </LMClientOverlayProvider>
    </>
  );
}
// function CustomMessage() {
//   const { message } = useContext(MessageContext);
//   return (
//     <div
//       style={{
//         color: "green",
//         background: "#f0f0f0",
//         padding: "16px",
//         borderRadius: "8px",
//         margin: "30px",
//         width: "250px",
//       }}
//     >
//       {message?.toString()}
//     </div>
//   );
// }

// function CustomMessageWithClassStyling() {
//   const { message } = useContext(MessageContext);
//   return <div className="customClass">{message?.toString()}</div>;
// }
export default App;
