import React from "react";
import { Conversation, PollOptionNew } from "../types/models/conversations";
import { OneArgVoidReturns, ZeroArgVoidReturns } from "../hooks/useInput";
import { EmojiData } from "../types/models/emojiData";

interface LMMessageContextInterface {
  message: Conversation;
  index: number;
  deleteMessage: ZeroArgVoidReturns;
  editMessageLocally: OneArgVoidReturns<Conversation>;
  addReactionLocally: OneArgVoidReturns<EmojiData>;
  removeReactionLocally: ZeroArgVoidReturns;
  addPollOptionLocally: OneArgVoidReturns<PollOptionNew>;
  updatePollOnSubmitLocally: OneArgVoidReturns<string[]>;
}

const LMMessageContext = React.createContext<LMMessageContextInterface>(
  {} as LMMessageContextInterface,
);
export default LMMessageContext;
