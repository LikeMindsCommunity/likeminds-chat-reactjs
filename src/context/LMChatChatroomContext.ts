import { createContext } from "react";
import { LMChatChatroomContextInterface } from "../types/contexts/LMChatChatoomContextInterface";

export const LMChatChatroomContext =
  createContext<LMChatChatroomContextInterface>(
    {} as LMChatChatroomContextInterface,
  );
