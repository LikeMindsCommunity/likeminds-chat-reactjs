import React from "react";
import Conversation from "../types/models/conversations";
import { ZeroArgVoidReturns } from "../hooks/useInput";

interface LMMessageContextInterface {
  message: Conversation | null;
  index: number;
  deleteMessage: ZeroArgVoidReturns;
}

const LMMessageContext = React.createContext<LMMessageContextInterface>(
  {} as LMMessageContextInterface,
);
export default LMMessageContext;
