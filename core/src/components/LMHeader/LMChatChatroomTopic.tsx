import React, { useContext } from "react";
import { LMChatChatroomContext } from "../../context/LMChatChatroomContext";
import conversationAvatar from "../../assets/img/userSample.png";
const LMChatChatroomTopic = () => {
  const { chatroom } = useContext(LMChatChatroomContext);

  if (!chatroom) {
    return null;
  }
  return (
    <div className="lm-chatroom-topic">
      <span className="lm-chatroom-topic-conversation-user-avatar">
        <img src={conversationAvatar} alt="avatar" />
      </span>
      <div className="lm-topic-chatroom-details">
        <p className="lm-topic-chatroom-details-topic-conversation-details ">
          <span className="lm-topic-chatroom-user-details">Abhishek</span>
          <span className="lm-topic-chatroom-conversation-time">April 20</span>
        </p>
        <p className="lm-topic-chatroom-details-conversation-message">
          Can we start a chat room for all the community members who are in and
          around Gurgaon and…
        </p>
      </div>
    </div>
  );
};

export default LMChatChatroomTopic;
