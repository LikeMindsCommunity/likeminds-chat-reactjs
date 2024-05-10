import React, { memo } from "react";
import Conversation from "../../types/models/conversations";
import LMMessageContext from "../../context/MessageContext";
import Message from "../LMMessage/Message";
interface LMMessageMiddlewareProps {
  message: Conversation;
}
const LMMessageMiddleware = memo((props: LMMessageMiddlewareProps) => {
  const { message } = props;
  return (
    <LMMessageContext.Provider value={{ message }}>
      <Message />
    </LMMessageContext.Provider>
  );
});

export default LMMessageMiddleware;
