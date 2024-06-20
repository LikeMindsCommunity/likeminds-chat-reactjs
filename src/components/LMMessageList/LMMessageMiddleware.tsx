import React, { memo, useContext, useEffect, useState } from "react";
import Conversation from "../../types/models/conversations";
import LMMessageContext from "../../context/MessageContext";
import Message from "../LMMessage/Message";
import UserProviderContext from "../../context/UserProviderContext";
interface LMMessageMiddlewareProps {
  message: Conversation;
  index: number;
}
const LMMessageMiddleware = (props: LMMessageMiddlewareProps) => {
  const { message, index } = props;
  const { currentUser } = useContext(UserProviderContext);
  const [localMessageCopy, setLocalMessageCopy] = useState<Conversation | null>(
    null,
  );
  useEffect(() => {
    console.log("Inside use effect");
    setLocalMessageCopy(message);
  }, [message]);
  function deleteMessage() {
    // const newLocalMessage = {...localMessageCopy}
    setLocalMessageCopy((currentLocalMessage) => {
      console.log(currentLocalMessage);
      if (currentLocalMessage) {
        currentLocalMessage["deleted_by"] = currentUser?.id;
        currentLocalMessage["deleted_by_member"] = currentUser;
        console.log("current local message after editing");
        console.log(currentLocalMessage);
        return currentLocalMessage;
      } else {
        return currentLocalMessage;
      }
    });
  }
  return (
    <LMMessageContext.Provider
      value={{
        message: localMessageCopy || null,
        index,
        deleteMessage: deleteMessage,
      }}
    >
      <Message />
    </LMMessageContext.Provider>
  );
};

export default LMMessageMiddleware;
