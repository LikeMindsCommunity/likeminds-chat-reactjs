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
    const currentLocalMessage = { ...localMessageCopy };
    currentLocalMessage["deleted_by"] = currentUser?.id;
    currentLocalMessage["deleted_by_member"] = currentUser;
    setLocalMessageCopy(currentLocalMessage as Conversation);
  }
  function editMessageLocally(newMessage: Conversation) {
    console.log(localMessageCopy?.id === newMessage.id);
    if (localMessageCopy?.id === newMessage.id) {
      setLocalMessageCopy(newMessage);
    }
  }
  return (
    <LMMessageContext.Provider
      value={{
        message: localMessageCopy || null,
        index,
        deleteMessage: deleteMessage,
        editMessageLocally: editMessageLocally,
      }}
    >
      <Message />
    </LMMessageContext.Provider>
  );
};

export default LMMessageMiddleware;
