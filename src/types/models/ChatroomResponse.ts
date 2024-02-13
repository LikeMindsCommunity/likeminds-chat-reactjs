import { DMChatroom } from "./Chatroom";
import { Community } from "./Community";
import Conversation from "./conversations";
import Member from "./member";

export interface DMChatroomResponse {
  chatroom: DMChatroom;
  isDraft: boolean;
  customTag: string;
  lastConversation: Conversation;
  unseenConversationCount: number;
  lastConversationTime: string;
  memberState: number;
  chatRequestState: number;
  chatRequestCreatedAt: number;
  chatRequestedBy: Member[];
  isPrivateMember: boolean;
  memberRightStates: number[];
  community: Community;
}
