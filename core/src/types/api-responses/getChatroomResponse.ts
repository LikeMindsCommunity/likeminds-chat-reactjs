import {
  GetChatroomResponse as LMGetChatroomResponse,
  LMResponse,
} from "@likeminds.community/chat-js";
import { Chatroom } from "../models/Chatroom";
import { Community } from "../models/Community";
/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ChatroomAction {
  id: number;
  title: string;
}

export interface ConversationUser {
  id: number;
  image_url: string;
  name: string;
}

export interface ChatroomDetails {
  canAccessSecretChatroom: boolean | undefined;
  chatroom: Chatroom;
  chatroomActions: ChatroomAction[];
  community: Community;
  conversationUsers: ConversationUser[];
  lastConversationId: number;
  participantCount: number;
  unreadMessages: number;
  // widgets: any;
}

export interface GetChatroomResponse
  extends LMResponse<LMGetChatroomResponse> {}
