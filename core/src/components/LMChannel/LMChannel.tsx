import React, { useState, useEffect, useContext } from "react";

import LMChannelList from "../LMChannelList/LMChannelList";
import LMChatroom from "./LMChatChatroom";
import LMHeader from "../LMHeader/LMHeader";
import LMMessageList from "../LMMessageList/LMMessageList";
import LMInput from "../LMInput/LMInput";
import LMGlobalClientProviderContext from "../../context/LMGlobalClientProviderContext";

const LMChannel = ({ currentChatroomId }: LMChannelProps) => {
  const { lmChatTheme } = useContext(LMGlobalClientProviderContext);

  // State to track whether the screen is mobile size
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);

  // Effect to detect screen size changes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="lm-channel-block">
      {/* Conditionally render the lm-left-panel div */}
      {(!currentChatroomId || !isMobile) && (
        <div
          className={`lm-left-panel ${currentChatroomId && isMobile ? "mobile-hide" : ""}`}
        >
          <LMChannelList
            currentChatroomId={currentChatroomId}
            currentTheme={lmChatTheme}
          />
        </div>
      )}
      <div className="lm-right-panel">
        <div className="lm-chat-box">
          <LMChatroom currentChatroomId={currentChatroomId}>
            <LMHeader />
            <LMMessageList />
            <LMInput />
          </LMChatroom>
        </div>
      </div>
    </div>
  );
};

export default LMChannel;

export interface LMChannelProps {
  currentChatroomId?: number;
}
