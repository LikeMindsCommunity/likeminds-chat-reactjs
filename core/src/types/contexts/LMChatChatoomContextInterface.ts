import React from "react";
import { ChatroomDetails } from "../api-responses/getChatroomResponse";
import { Conversation } from "../models/conversations";
import { ReplyDmQueries } from "../../enums/lm-reply-dm-queries";

export interface LMChatChatroomContextInterface {
  conversationToReply: Conversation | null;
  conversationToedit: Conversation | null;
  setConversationToReply: React.Dispatch<Conversation | null>;
  setConversationToEdit: React.Dispatch<Conversation | null>;
  chatroomDetails: ChatroomDetails;
  setNewChatroom: React.Dispatch<ChatroomDetails | null>;
  canUserReplyPrivately: ReplyDmQueries;
  searchedConversationId: number | null;
  setSearchedConversationId: React.Dispatch<number | null>;
}
