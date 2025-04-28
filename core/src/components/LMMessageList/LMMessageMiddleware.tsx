/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { memo, useContext, useEffect, useState } from "react";
import {
  Conversation,
  Poll,
  PollOptionNew,
  Reaction,
} from "../../types/models/conversations";
import LMMessageContext from "../../context/LMMessageContext";
import LMMessage from "../LMMessage/LMMessage";
import UserProviderContext from "../../context/LMUserProviderContext";
import { EmojiData } from "../../types/models/emojiData";
import { CustomActions } from "../../customActions";

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

  function deleteMessage() {
    const currentLocalMessage = { ...localMessageCopy };
    currentLocalMessage["deletedBy"] = currentUser?.id.toString();
    currentLocalMessage["deletedByMember"] = currentUser!;
    setLocalMessageCopy(currentLocalMessage as Conversation);
    document.dispatchEvent(
      new CustomEvent(CustomActions.CONVERSATION_DELETED, {
        detail: { conversation: currentLocalMessage },
      }),
    );
  }

  function editMessageLocally(newMessage: Conversation) {
    if (localMessageCopy?.id === newMessage.id) {
      setLocalMessageCopy((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          answer: newMessage.answer,
        };
      });
    }
  }

  function addReactionLocally(emoji: EmojiData) {
    const currentLocalMessage = { ...localMessageCopy };
    const currentUserUUID = currentUser?.uuid;
    currentLocalMessage.reactions =
      currentLocalMessage?.reactions?.filter(
        (reaction: any) => reaction?.member?.uuid !== currentUserUUID,
      ) || [];
    currentLocalMessage.reactions?.push({
      member: currentUser!,
      reaction: emoji.native,
    } as Reaction);
    setLocalMessageCopy(currentLocalMessage as Conversation);
  }

  function removeReactionLocally() {
    setLocalMessageCopy((currentLocalReactionsCopy: any) => {
      const currentLocalCopy = { ...currentLocalReactionsCopy };
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
        isSelected: false,
        noVotes: 0,
        percentage: 0,
        id: pollOption.id.toString(),
        userId: pollOption.userId.toString(),
      };
      currentLocalCopy?.polls?.push(newPollOption);
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
          poll.isSelected = true;
          poll.noVotes = (poll?.noVotes || 0) + 1;
        }
        return poll;
      });
      return currentLocalCopy;
    });
  }

  useEffect(() => {
    setLocalMessageCopy(message);
  }, [message]);

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
        chatroomTopic: () => {},
      }}
    >
      <LMMessage />
    </LMMessageContext.Provider>
  );
});

export default LMMessageMiddleware;
