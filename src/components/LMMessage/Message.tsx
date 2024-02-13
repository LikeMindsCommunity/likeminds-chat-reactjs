import React, { useContext } from "react";
import MessageContext from "../../context/MessageContext";
import ConversationStates from "../../enums/conversation-states";
import { Utils } from "../../utils/helpers";

const Message = () => {
  const { message } = useContext(MessageContext);
  const { state } = message!;

  switch (state) {
    case ConversationStates.NORMAL: {
      return (
        <>
          <div className="conversation sender">
            <div className="msg">{Utils.parseAnser(message?.answer || "")}</div>
            <div className="time">10:30</div>
          </div>
        </>
      );
    }
    case ConversationStates.CHAT_ROOM_HEADER: {
      return (
        <div className="data-pill">
          {Utils.parseAnser(message?.answer || "")}
        </div>
      );
    }
    case 11:
      return (
        <div className="data-pill">
          {Utils.parseAnser(message?.answer || "")}
        </div>
      );
    default: {
      return (
        <>
          <div className="conversation sender">
            <div className="msg">{Utils.parseAnser(message?.answer || "")}</div>
            <div className="time">10:30</div>
          </div>
        </>
      );
    }
  }
  return <div>{message?.toString()}</div>;
};

export default Message;
