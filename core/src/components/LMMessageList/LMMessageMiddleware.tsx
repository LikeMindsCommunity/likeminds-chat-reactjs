/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { memo, useContext, useEffect, useState } from "react";
import Conversation from "../../types/models/conversations";
import LMMessageContext from "../../context/MessageContext";
import Message from "../LMMessage/Message";
import UserProviderContext from "../../context/UserProviderContext";
import { EmojiData } from "../../types/models/emojiData";
interface LMMessageMiddlewareProps {
  message: Conversation;
  index: number;
}
const LMMessageMiddleware = memo((props: LMMessageMiddlewareProps) => {
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
        (reaction: any) => reaction?.member?.uuid !== currentUserUUID,
      ) || [];
    console.log(currentLocalMessage);
    currentLocalMessage.reactions?.push({
      member: currentUser!,
      reaction: emoji.native,
    });
    console.log(currentLocalMessage);
    setLocalMessageCopy(currentLocalMessage as Conversation);
  }
  function removeReactionLocally() {
    setLocalMessageCopy((currentLocalCopy: any) => {
      currentLocalCopy!.reactions =
        currentLocalCopy?.reactions.filter((reaction: any) => {
          return reaction.member.id.toString() !== currentUser?.id.toString();
        }) || [];
      console.log(currentLocalCopy);
      return currentLocalCopy;
    });
  }
  return (
    <LMMessageContext.Provider
      value={{
        message: localMessageCopy as Conversation,
        index,
        deleteMessage: deleteMessage,
        editMessageLocally: editMessageLocally,
        addReactionLocally: addReactionLocally,
        removeReactionLocally: removeReactionLocally,
      }}
    >
      <Message />
    </LMMessageContext.Provider>
  );
});

export default LMMessageMiddleware;
