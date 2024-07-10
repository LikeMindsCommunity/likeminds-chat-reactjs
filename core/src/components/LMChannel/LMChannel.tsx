import LMChannelList from "../LMChannelList/LMChannelList";
import LMChatChatroom from "./LMChatChatroom";
import React from "react";
const LMChannel = () => {
  return (
    <div className="lm-channel-block">
      <div className="lm-left-panel">
        <LMChannelList />
      </div>
      <div className="lm-right-panel lm-d-flex flex-direction">
        <LMChatChatroom />
      </div>
    </div>
  );
};

export default LMChannel;
