import { Theme } from "./Themes/ThemeClass";
import LMClientOverlayProvider from "./components/LMChatProvider/LMClientOverlayProvider";
import LMChatView from "./components/LMChatView/LMChatView";

function App() {
  return (
    <>
      <LMClientOverlayProvider client={null} theme={new Theme().theme}>
        <LMChatView
        // MessageComponent={() => {
        //   return <p>hello this is a custom component</p>;
        // }}
        />
      </LMClientOverlayProvider>
    </>
  );
}

export default App;
