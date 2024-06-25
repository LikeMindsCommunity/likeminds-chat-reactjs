import React from "react";
import Conversation from "../types/models/conversations";
import { OneArgVoidReturns, ZeroArgVoidReturns } from "../hooks/useInput";
import { EmojiData } from "../types/models/emojiData";

interface LMMessageContextInterface {
  message: Conversation | null;
  index: number;
  deleteMessage: ZeroArgVoidReturns;
  editMessageLocally: OneArgVoidReturns<Conversation>;
  addReactionLocally: OneArgVoidReturns<EmojiData>;
}

const LMMessageContext = React.createContext<LMMessageContextInterface>(
  {} as LMMessageContextInterface,
);
export default LMMessageContext;
