import LMChannelList from "../LMChannelList/LMChannelList";
import LMChatChatroom from "./LMChatChatroom";

const Channel = () => {
  return (
    <div className="d-flex">
      <div className="lm-left-panel">
        <LMChannelList />
      </div>
      <div className="lm-right-panel d-flex flex-direction">
        {/* <Header />
        <MessageList />
        <Input /> */}
        {/*  */}
        <LMChatChatroom />
      </div>
    </div>
  );
};

export default Channel;
