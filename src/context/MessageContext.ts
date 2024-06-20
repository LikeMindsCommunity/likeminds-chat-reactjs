import React from "react";
import Conversation from "../types/models/conversations";
import { OneArgVoidReturns, ZeroArgVoidReturns } from "../hooks/useInput";

interface LMMessageContextInterface {
  message: Conversation | null;
  index: number;
  deleteMessage: ZeroArgVoidReturns;
  editMessageLocally: OneArgVoidReturns<Conversation>;
}

const LMMessageContext = React.createContext<LMMessageContextInterface>(
  {} as LMMessageContextInterface,
);
export default LMMessageContext;
