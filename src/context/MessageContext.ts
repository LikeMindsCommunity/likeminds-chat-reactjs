import React from "react";
import Conversation from "../types/models/conversations";

interface LMMessageContextInterface {
  message: Conversation | null;
  index: number;
}

const LMMessageContext = React.createContext<LMMessageContextInterface>(
  {} as LMMessageContextInterface,
);
export default LMMessageContext;
