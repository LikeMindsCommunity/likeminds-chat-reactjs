/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from "react";
import Conversation from "../../types/models/conversations";
import LMMessageContext from "../../context/MessageContext";
import Message from "../LMMessage/Message";
import UserProviderContext from "../../context/UserProviderContext";
import { EmojiData } from "../../types/models/emojiData";
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
  function addReactionLocally(emoji: EmojiData) {
    const currentLocalMessage = { ...localMessageCopy };
    const currentUserUUID = currentUser?.uuid;
    console.log(currentLocalMessage);
    currentLocalMessage.reactions =
      currentLocalMessage?.reactions?.filter(
        (reaction: any) => reaction?.user?.uuid !== currentUserUUID,
      ) || [];
    console.log(currentLocalMessage);
    currentLocalMessage.reactions?.push({
      user: currentUser,
      reaction: emoji.native,
    });
    console.log(currentLocalMessage);
    setLocalMessageCopy(currentLocalMessage as Conversation);
  }
  return (
    <LMMessageContext.Provider
      value={{
        message: localMessageCopy || null,
        index,
        deleteMessage: deleteMessage,
        editMessageLocally: editMessageLocally,
        addReactionLocally: addReactionLocally,
      }}
    >
      <Message />
    </LMMessageContext.Provider>
  );
};

export default LMMessageMiddleware;
