import React, { useContext, useEffect } from "react";
import MessageContext from "../../context/MessageContext";
import ConversationStates from "../../enums/conversation-states";
import { Utils } from "../../utils/helpers";
import { getAvatar } from "../../shared/components/LMUserMedia";
import UserProviderContext from "../../context/UserProviderContext";
import MessageOptions from "./MessageOptions";
import Reactions from "./Reactions";
import MessageListContext from "../../context/MessageListContext";
import { ConstantStrings } from "../../enums/common-strings";
import LMMessageContext from "../../context/MessageContext";

const Message = () => {
  const { message, index } = useContext(LMMessageContext);
  const { conversations } = useContext(MessageListContext);
  const { currentUser } = useContext(UserProviderContext);
  useEffect(() => {
    console.log("updated message, the new message is");
    console.log(message);
  }, [message]);
  const isSender = message?.member?.uuid === currentUser?.uuid;
  const messageClass = isSender ? "sender" : "receiver";

  const imageUrl = message?.member.imageUrl;
  const name = message?.member.name;
  const avatarContent = getAvatar({ imageUrl, name });

  function renderDatePill() {
    if (index === 0) {
      return <div className="data-pill">{message?.date}</div>;
    } else {
      if (conversations![index - 1].date !== message?.date) {
        return <div className="data-pill">{message?.date}</div>;
      }
    }
  }
  if (message?.deleted_by) {
    return (
      <div className={`lm-chat-card ${messageClass} ${message?.state}`}>
        {!isSender ? <div className="lmUserData">{avatarContent}</div> : null}
        <div className={`conversation ${messageClass}`}>
          <div className="msg">{ConstantStrings.MESSAGE_DELETED}</div>
        </div>

        <div className="actions">
          <div className="lm-cursor-pointer">
            <MessageOptions />
          </div>
          <div className="lm-cursor-pointer">
            <Reactions />
          </div>
        </div>

        {/* <div className="data-pill">{message?.date}</div> */}
      </div>
    );
  }
  switch (message?.state) {
    case ConversationStates.NORMAL: {
      return (
        <>
          <div className={`lm-chat-card ${message?.state}`}>
            {/* {message?.state} */}
            {renderDatePill()}
          </div>
          <div className={`lm-chat-card ${messageClass} ${message?.state}`}>
            {!isSender ? (
              <div className="lmUserData">{avatarContent}</div>
            ) : null}
            <div className={`conversation ${messageClass}`}>
              {!isSender ? (
                <div className="name">{message?.member.name}</div>
              ) : null}

              <div className="msg">
                {Utils.parseAnser(message?.answer || "")}
              </div>
              <div className="time">{message?.created_at}</div>
            </div>

            <div className="actions">
              <div className="lm-cursor-pointer">
                <MessageOptions />
              </div>
              <div className="lm-cursor-pointer">
                <Reactions />
              </div>
            </div>

            {/* <div className="data-pill">{message?.date}</div> */}
          </div>
        </>
      );
    }
    case ConversationStates.CHAT_ROOM_HEADER: {
      return (
        <>
          <div className={`lm-chat-card ${message?.state}`}>
            {/* {message?.state} */}
            {renderDatePill()}
          </div>
          <div className="lm-chat-card">
            <div className="lm-date-data ">
              <div className="data-pill">{message?.date}</div>

              <div className="data-pill">
                {Utils.parseAnser(message?.answer || "")}
              </div>
            </div>
          </div>
        </>
      );
    }
    case 11:
      return (
        <div className={`lm-chat-card ${message?.state}`}>
          <div className="data-pill">{message?.date}</div>
        </div>
      );
    default: {
      return null;
      // <div className={`lm-chat-card ${message?.state}`}>
      //   {/* {message?.state} */}
      //   <div className="data-pill">{message?.date}</div>
      // </div>
    }
  }
  // return <div>{message?.toString()}</div>;
};

export default Message;
