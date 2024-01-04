import { useContext } from "react";
import { Theme } from "./Themes/ThemeClass";
import Header from "./components/Header/Header";
import LMClientOverlayProvider from "./components/LMChatProvider/LMClientOverlayProvider";
import LMChatView from "./components/LMChatView/LMChatView";
import Input from "./components/LMInput/Input";
import MessageList from "./components/LMMessageList/MessageList";
import MessageContext from "./context/MessageContext";
import LMChatClient from "@likeminds.community/chat-js-beta";

function App() {
  const myClient: LMChatClient = LMChatClient.setApiKey(
    "5f567ca1-9d74-4a1b-be8b-a7a81fef796f"
  )
    .setPlatformCode("rt")
    .setVersionCode(35)
    .build();
  return (
    <>
      <LMClientOverlayProvider client={myClient} theme={new Theme().theme}>
        {/* <LMChannelList/> */}
        <LMChatView>
          <Header />
          <MessageList MessageComponent={CustomMessage} />
          <Input />
        </LMChatView>
      </LMClientOverlayProvider>
    </>
  );
}
function CustomMessage() {
  const { message } = useContext(MessageContext);
  return (
    <div
      style={{
        color: "green",
        background: "#f0f0f0",
        padding: "16px",
        borderRadius: "8px",
        margin: "30px",
        width: "250px",
      }}
    >
      {message?.toString()}
    </div>
  );
}

// function CustomMessageWithClassStyling() {
//   const { message } = useContext(MessageContext);
//   return <div className="customClass">{message?.toString()}</div>;
// }
export default App;
