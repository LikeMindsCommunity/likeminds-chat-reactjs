import { useContext } from "react";
import { Theme } from "./Themes/ThemeClass";
import Header from "./components/Header/Header";
import LMClientOverlayProvider from "./components/LMChatProvider/LMClientOverlayProvider";
import LMChatView from "./components/LMChatView/LMChatView";
import Input from "./components/LMInput/Input";
import MessageList from "./components/LMMessageList/MessageList";
import MessageContext from "./context/MessageContext";

import "./App.css";

function App() {
  return (
    <>
      <LMClientOverlayProvider client={null} theme={new Theme().theme}>
        <LMChatView
        // MessageComponent={() => {
        //   return <p>hello this is a custom component</p>;
        // }}
        >
          <div className="d-flex flex-direction ">
            <Header />
            <MessageList MessageComponent={CustomMessageWithClassStyling} />
            <Input />
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

function CustomMessageWithClassStyling() {
  const { message } = useContext(MessageContext);
  return <div className="customClass">{message?.toString()}</div>;
}
export default App;
