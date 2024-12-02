import { Attachment } from "./Attachment";
import { Chatroom } from "./Chatroom";
import { Community } from "./Community";
import Member from "./member";

export interface SearchedChatroom {
  attachments: Attachment[];
  attending_status: boolean;
  chatroom: Chatroom;
  community: Community;
  follow_status: boolean;
  id: number;
  is_guest: boolean;
  is_tagged: boolean;
  member: Member;
  mute_status: boolean;
  secret_chatroom_left: boolean;
  state: number;
  updated_at: number;
}
