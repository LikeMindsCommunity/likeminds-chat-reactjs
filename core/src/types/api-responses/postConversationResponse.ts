/* eslint-disable @typescript-eslint/no-explicit-any */

import { SDKClientInfo } from "./getChatroomResponse";

export interface Member {
  id: number;
  image_url: string;
  is_guest: boolean;
  name: string;
  organisation_name: string | null;
  updated_at: number;
  user_unique_id: string;
  uuid: string;
  sdk_client_info: SDKClientInfo;
}

export interface Conversation {
  id: number;
  answer: string;
  created_at: string;
  state: number;
  is_edited: boolean;
  has_files: boolean;
  date: string;
  attachment_count: number;
  attachments_uploaded: boolean;
  created_epoch: number;
  is_anonymous: boolean;
  allow_add_option: boolean;
  reactions: any[];
  poll_answer_text: string;
  start_time: number;
  end_time: number;
  has_event_recording: boolean;
  widget_id: string;
  chatroom_id: number;
  member_id: number;
  member: Member;
  community_id: number;
}

export interface PostConversationResponse {
  success: boolean;
  data: { id: number; conversation: Conversation };
}
