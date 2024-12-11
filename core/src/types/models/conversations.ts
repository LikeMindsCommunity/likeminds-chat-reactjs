import {
  Conversation as LMConversation,
  Poll as LMPoll,
  Reaction as LMReaction,
} from "@likeminds.community/chat-js";
import Member from "./member";
import { Widget } from "./Widget";

export interface Conversation extends LMConversation {
  widget?: Widget;
}

export interface Poll extends LMPoll {}

export interface Reaction extends LMReaction {}

export interface PollOptionNew {
  id: number;
  member: Member;
  text: string;
  userId: number;
}
