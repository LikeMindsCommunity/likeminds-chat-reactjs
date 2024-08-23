/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { memo, useContext, useEffect, useState } from "react";
import Conversation, {
  Poll,
  PollOptionNew,
} from "../../types/models/conversations";
import LMMessageContext from "../../context/LMMessageContext";
import LMMessage from "../LMMessage/LMMessage";
import UserProviderContext from "../../context/LMUserProviderContext";
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
    currentLocalMessage["deleted_by_member"] = currentUser!;
    setLocalMessageCopy(currentLocalMessage as Conversation);
  }
  function editMessageLocally(newMessage: Conversation) {
    if (localMessageCopy?.id === newMessage.id) {
      setLocalMessageCopy(newMessage);
    }
  }
  function addReactionLocally(emoji: EmojiData) {
    const currentLocalMessage = { ...localMessageCopy };
    const currentUserUUID = currentUser?.sdkClientInfo.uuid;
    currentLocalMessage.reactions =
      currentLocalMessage?.reactions?.filter(
        (reaction: any) =>
          reaction?.member?.sdkClientInfo.uuid !== currentUserUUID,
      ) || [];
    currentLocalMessage.reactions?.push({
      member: currentUser!,
      reaction: emoji.native,
    });
    setLocalMessageCopy(currentLocalMessage as Conversation);
  }
  function removeReactionLocally() {
    setLocalMessageCopy((currentLocalCopy: any) => {
      currentLocalCopy!.reactions =
        currentLocalCopy?.reactions.filter((reaction: any) => {
          return reaction.member.id.toString() !== currentUser?.id.toString();
        }) || [];
      return currentLocalCopy;
    });
  }
  function addPollOptionLocally(pollOption: PollOptionNew) {
    setLocalMessageCopy((currentLocalCopy: Conversation | null) => {
      if (!currentLocalCopy) {
        return currentLocalCopy;
      }
      currentLocalCopy = { ...currentLocalCopy };
      const newPollOption: Poll = {
        ...pollOption,
        is_selected: false,
        no_votes: 0,
        percentage: 0,
      };
      currentLocalCopy.polls.push(newPollOption);
      return currentLocalCopy as Conversation;
    });
  }
  function updatePollOnSubmitLocally(selectedPollIds: string[]) {
    setLocalMessageCopy((currentLocalCopy: Conversation | null) => {
      if (!currentLocalCopy) {
        return currentLocalCopy;
      }
      currentLocalCopy = { ...currentLocalCopy };
      currentLocalCopy.polls = currentLocalCopy.polls?.map((poll) => {
        if (selectedPollIds.includes(poll.id.toString())) {
          poll.is_selected = true;
          poll.no_votes += 1;
        }
        return poll;
      });
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
        addPollOptionLocally: addPollOptionLocally,
        updatePollOnSubmitLocally: updatePollOnSubmitLocally,
      }}
    >
      <LMMessage />
    </LMMessageContext.Provider>
  );
});

export default LMMessageMiddleware;
