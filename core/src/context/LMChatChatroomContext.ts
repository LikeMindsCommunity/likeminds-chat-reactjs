import { createContext } from "react";
import { LMChatChatroomContextInterface } from "../types/contexts/LMChatChatoomContextInterface";

export const LMChatroomContext = createContext<LMChatChatroomContextInterface>(
  {} as LMChatChatroomContextInterface,
);
