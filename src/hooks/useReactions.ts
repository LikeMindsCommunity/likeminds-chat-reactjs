import { useContext } from "react";
import { EmojiData } from "../types/models/emojiData";
import { OneArgVoidReturns } from "./useInput";
import GlobalClientProviderContext from "../context/GlobalClientProviderContext";
import LMMessageContext from "../context/MessageContext";
import { LMChatChatroomContext } from "../context/LMChatChatroomContext";

export function useReactions(): UseReactionReturns {
  const { lmChatclient } = useContext(GlobalClientProviderContext);
  const { message, addReactionLocally } = useContext(LMMessageContext);
  const { chatroom } = useContext(LMChatChatroomContext);
  const addReaction = async (emoji: EmojiData) => {
    try {
      const call = await lmChatclient?.putReaction({
        conversationId: parseInt(message!.id.toString()),
        chatroomId: parseInt(chatroom?.chatroom.id.toString() || ""),
        reaction: emoji.native,
      });
      addReactionLocally(emoji);
      console.log(call);
    } catch (error) {
      console.log(error);
    }
  };
  return {
    addReaction,
  };
}
export interface UseReactionReturns {
  addReaction: OneArgVoidReturns<EmojiData>;
}
