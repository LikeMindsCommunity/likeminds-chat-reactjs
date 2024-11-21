/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Conversation as LMConversation,
  Poll as LMPoll,
  Reaction as LMReaction,
} from "@likeminds.community/chat-js-beta";
import Member from "./member";

export interface Conversation extends LMConversation {
  widget?: any;
}

export interface Poll extends LMPoll {}

export interface Reaction extends LMReaction {}

export interface PollOptionNew {
  id: number;
  member: Member;
  text: string;
  userId: number;
}
