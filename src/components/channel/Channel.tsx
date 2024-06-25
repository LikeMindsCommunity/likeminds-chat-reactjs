import LMChannelList from "../LMChannelList/LMChannelList";
import LMChatChatroom from "./LMChatChatroom";

const Channel = () => {
  return (
    <div className="lm-d-flex">
      <div className="lm-left-panel">
        <LMChannelList />
      </div>
      <div className="lm-right-panel lm-d-flex flex-direction">
        {/* <Header />
        <MessageList />
        <Input /> */}
        {/*  */}
        {/* <Outlet /> */}
        <LMChatChatroom />
      </div>
    </div>
  );
};

export default Channel;
