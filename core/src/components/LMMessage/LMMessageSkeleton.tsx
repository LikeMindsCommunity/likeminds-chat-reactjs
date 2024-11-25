import { Skeleton } from "@mui/material";
import React, { useContext } from "react";
import { LMChatroomContext } from "../../context/LMChatChatroomContext";

import { getAvatar } from "../../shared/components/LMUserMedia";
import { Utils } from "../../utils/helpers";
import LMUserProviderContext from "../../context/LMUserProviderContext";

const LMMessageSkeleton = () => {
  const {
    chatroomDetails: { chatroom },
  } = useContext(LMChatroomContext);
  const { currentUser } = useContext(LMUserProviderContext);
  const getOtherUser = (() => {
    const otherMember =
      chatroom.member.sdkClientInfo?.uuid === currentUser.sdkClientInfo?.uuid
        ? chatroom.chatroomWithUser
        : chatroom.member;
    return otherMember;
  })();
  const avatarContent = getAvatar({
    imageUrl: getOtherUser?.imageUrl || "",
    name: getOtherUser?.name || "",
  });
  return (
    <div className={`lm-chat-card receiver `}>
      <div className="lmUserData">{avatarContent}</div>

      <div className="lm-chat-message-reactions-holder-plate">
        <div
          className={`conversation receiver ${
            Utils.isOtherUserAIChatbot(chatroom, currentUser) &&
            "ai-chatbot-conversation"
          }`}
        >
          <Skeleton />
          <Skeleton animation="wave" />
          <Skeleton animation={false} />
        </div>
      </div>

      {/* <div className="data-pill">{message?.date}</div> */}
    </div>
  );
};

export default LMMessageSkeleton;
