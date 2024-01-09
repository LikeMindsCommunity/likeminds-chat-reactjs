import React, { useContext } from "react";
import MessageContext from "../../context/MessageContext";
import ConversationStates from "../../enums/conversation-states";

const Message = () => {
  const { message } = useContext(MessageContext);
  const { state } = message!;
  switch (state) {
    case ConversationStates.NORMAL: {
      return (
        <>
          <div className="conversation sender">
            <div className="msg">{message?.answer}</div>
            <div className="time">10:30</div>
          </div>
        </>
      );
    }
  }
  return <div>{message?.toString()}</div>;
};

export default Message;
