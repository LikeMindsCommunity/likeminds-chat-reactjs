import { useContext } from "react";
import { EmojiData } from "../types/models/emojiData";
import { OneArgVoidReturns } from "./useInput";
import GlobalClientProviderContext from "../context/LMGlobalClientProviderContext";
import LMMessageContext from "../context/LMMessageContext";
import { LMChatroomContext } from "../context/LMChatChatroomContext";
import { CustomisationContextProvider } from "../context/LMChatCustomisationContext";

export function useReactions(): UseReactionReturns {
  const { lmChatClient } = useContext(GlobalClientProviderContext);
  const { message, addReactionLocally } = useContext(LMMessageContext);
  const { reactionCustomActions = {} } = useContext(
    CustomisationContextProvider,
  );
  const { addReactionCustomCallback, removeReactionCustomCallback } =
    reactionCustomActions;
  const { chatroomDetails } = useContext(LMChatroomContext);
  const addReaction = async (emoji: EmojiData) => {
    try {
      await lmChatClient?.putReaction({
        conversationId: parseInt(message!.id.toString()),
        chatroomId: parseInt(chatroomDetails?.chatroom.id.toString() || ""),
        reaction: emoji.native,
      });
      addReactionLocally(emoji);
    } catch (error) {
      console.log(error);
    }
  };
  const removeReaction = async (emoji: string) => {
    try {
      await lmChatClient?.deleteReaction({
        chatroomId: chatroomDetails!.chatroom!.id!,
        conversationId: message!.id!,
        reaction: emoji,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const reactionsDefaultActions: ReactionsDefaultActions = {
    addReaction,
    removeReaction,
  };
  const reactionsDataStore: ReactionsDataStore = {};
  return {
    addReaction: addReactionCustomCallback
      ? addReactionCustomCallback.bind(
          null,
          reactionsDefaultActions,
          reactionsDataStore,
        )
      : addReaction,
    removeReaction: removeReactionCustomCallback
      ? removeReactionCustomCallback.bind(
          null,
          reactionsDefaultActions,
          reactionsDataStore,
        )
      : removeReaction,
  };
}
export interface UseReactionReturns {
  addReaction: OneArgVoidReturns<EmojiData>;
  removeReaction: OneArgVoidReturns<string>;
}

export interface ReactionsDefaultActions {
  addReaction: OneArgVoidReturns<EmojiData>;
  removeReaction: OneArgVoidReturns<string>;
}

export interface ReactionsDataStore {}
