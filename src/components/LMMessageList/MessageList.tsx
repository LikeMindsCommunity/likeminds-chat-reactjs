import React, { PropsWithChildren, memo, useContext } from "react";
import { MessageListProps } from "../../types/prop-types/MessageListProps";
import MessageListContext from "../../context/MessageListContext";
import MessageContext from "../../context/MessageContext";
import Message from "../LMMessage/Message";
import Conversation from "../../types/models/conversations";
// import DmReqBlock from "./DmReqBlock";

const MessageList: React.FC<PropsWithChildren<MessageListProps>> = memo(
  (props) => {
    const { MessageComponent } = props;

    const { conversations } = useContext(MessageListContext);

    return (
      <div className="lm-channel">
        {/* default msg */}
        <div className="data-pill">
          This is the beginning of your direct message with Marvin McKinny
        </div>

        {/* Date */}
        <div className="data-pill">Jan 4</div>

        {/* Conversations */}
        {/* Static */}
        <div className="conversation receiver">
          <div className="name">Name</div>
          <div className="msg">Can we connect sometime?</div>
          <div className="time">10:30</div>
        </div>

        <div className="conversation sender">
          <div className="msg">Sender's message goes here</div>
          <div className="time">10:30</div>
        </div>

        {conversations?.map((conversation: Conversation) => {
          return (
            <MessageContext.Provider
              value={{
                message: conversation,
              }}
            >
              {MessageComponent ? <MessageComponent /> : <Message />}
            </MessageContext.Provider>
          );
        })}

        {/* DM Request Block */}
        {/* <DmReqBlock /> */}
      </div>
    );
  }
);

export default MessageList;
