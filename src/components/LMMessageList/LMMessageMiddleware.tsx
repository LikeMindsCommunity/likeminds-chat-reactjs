import React, { memo } from "react";
import Conversation from "../../types/models/conversations";
import LMMessageContext from "../../context/MessageContext";
import Message from "../LMMessage/Message";
interface LMMessageMiddlewareProps {
  message: Conversation;
  index: number;
}
const LMMessageMiddleware = memo((props: LMMessageMiddlewareProps) => {
  const { message, index } = props;
  return (
    <LMMessageContext.Provider value={{ message, index }}>
      <Message />
    </LMMessageContext.Provider>
  );
});

export default LMMessageMiddleware;
