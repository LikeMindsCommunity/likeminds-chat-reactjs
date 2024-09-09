// import LMChannelList from "../LMChannelList/LMChannelList";
// import LMChatChatroom from "./LMChatChatroom";
// import React from "react";
// const LMChannel = () => {
//   return (
//     <div className="lm-channel-block">
//       <div className="lm-left-panel">
//         <LMChannelList />
//       </div>
//       <div className="lm-right-panel">
//         <div className="lm-chat-box">
//           <LMChatChatroom />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LMChannel;

// import React from "react";
// import { useParams } from "react-router-dom";
// import LMChannelList from "../LMChannelList/LMChannelList";
// import LMChatChatroom from "./LMChatChatroom";

// const LMChannel = () => {
//   // Get the chatroomId from the URL parameters
//   const { id } = useParams<{ id: string }>();

//   return (
//     <div className="lm-channel-block">
//       {/* Conditionally render the lm-left-panel div if chatroomId doesn't exist */}
//       {!id && (
//         <div className="lm-left-panel mobile-hide">
//           {" "}
//           {/* Add mobile-hide class */}
//           <LMChannelList />
//         </div>
//       )}
//       <div className="lm-right-panel">
//         <div className="lm-chat-box">
//           <LMChatChatroom />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LMChannel;

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import LMChannelList from "../LMChannelList/LMChannelList";
import LMChatChatroom from "./LMChatChatroom";

const LMChannel = () => {
  // Get the chatroomId from the URL parameters
  const { id } = useParams<{ id: string }>();

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
      {(!id || !isMobile) && (
        <div className={`lm-left-panel ${id && isMobile ? "mobile-hide" : ""}`}>
          <LMChannelList />
        </div>
      )}
      <div className="lm-right-panel">
        <div className="lm-chat-box">
          <LMChatChatroom />
        </div>
      </div>
    </div>
  );
};

export default LMChannel;
