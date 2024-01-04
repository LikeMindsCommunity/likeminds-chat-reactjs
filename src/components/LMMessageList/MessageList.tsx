import React, { PropsWithChildren, memo, useContext } from "react";
import { MessageListProps } from "../../types/prop-types/MessageListProps";
import MessageListContext from "../../context/MessageListContext";
import MessageContext from "../../context/MessageContext";
import Message from "../LMMessage/Message";

const MessageList: React.FC<PropsWithChildren<MessageListProps>> = memo(
  (props) => {
    const { MessageComponent } = props;

    const { conversations } = useContext(MessageListContext);

    return (
      <div className="lm-channel">
        {conversations?.map((conversation: unknown) => {
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
      </div>
    );
  }
);

export default MessageList;
