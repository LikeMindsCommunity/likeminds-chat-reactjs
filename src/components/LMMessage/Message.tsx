import React, { useContext } from "react";
import MessageContext from "../../context/MessageContext";
import ConversationStates from "../../enums/conversation-states";
import { Utils } from "../../utils/helpers";
import useUserProvider from "../../hooks/useUserProvider";
import useChatroomList from "../../hooks/useChatroomsList";
import { getAvatar } from "../../shared/components/LMUserMedia";

const Message = () => {
  const { message } = useContext(MessageContext);
  const { lmChatUser } = useUserProvider();
  const { state } = message!;

  console.log(message);

  const isSender = message?.member?.uuid === lmChatUser?.uuid;
  const messageClass = isSender ? "sender" : "receiver";
  const imgUrl = message?.member.imageUrl;
  const userName = message?.member.name;
  const avatarContent = getAvatar({ imgUrl, userName });

  switch (state) {
    case ConversationStates.NORMAL: {
      return (
        <div className="lm-chat-card">
          <div className="lmUserData">
            {/* <img src={message?.member.imageUrl} alt={message?.member.name} /> */}
            {avatarContent}
          </div>
          <div className={`conversation ${messageClass}`}>
            {!isSender ? (
              <div className="name">{message?.member.name}</div>
            ) : null}

            <div className="msg">{Utils.parseAnser(message?.answer || "")}</div>
            <div className="time">{message?.created_at}</div>
          </div>
          {/* <div className="data-pill">{message?.date}</div> */}
        </div>
      );
    }
    case ConversationStates.CHAT_ROOM_HEADER: {
      return (
        <div className="lm-chat-card">
          <div className="lmUserData">
            {/* <img src={message?.member.imageUrl} alt={message?.member.name} /> */}
          </div>
          <div className={`conversation ${messageClass}`}>
            {!isSender ? (
              <div className="name">{message?.member.name}</div>
            ) : null}

            <div className="msg">{Utils.parseAnser(message?.answer || "")}</div>
            <div className="time">{message?.created_at}</div>
          </div>
          {/* <div className="data-pill">{message?.date}</div> */}
        </div>
      );
    }
    case 11:
      return (
        <div className="lm-chat-card">
          <div className="lmUserData">
            {/* <img src={message?.member.imageUrl} alt={message?.member.name} /> */}
          </div>
          <div className={`conversation ${messageClass}`}>
            {!isSender ? (
              <div className="name">{message?.member.name}</div>
            ) : null}

            <div className="msg">{Utils.parseAnser(message?.answer || "")}</div>
            <div className="time">{message?.created_at}</div>
          </div>
          {/* <div className="data-pill">{message?.date}</div> */}
        </div>
      );
    default: {
      return (
        <div className="lm-chat-card">
          <div className="lmUserData">
            {/* <img src={message?.member.imageUrl} alt={message?.member.name} /> */}
          </div>
          <div className={`conversation ${messageClass}`}>
            {!isSender ? (
              <div className="name">{message?.member.name}</div>
            ) : null}

            <div className="msg">{Utils.parseAnser(message?.answer || "")}</div>
            <div className="time">{message?.created_at}</div>
          </div>
          {/* <div className="data-pill">{message?.date}</div> */}
        </div>
      );
    }
  }
  // return <div>{message?.toString()}</div>;
};

export default Message;
