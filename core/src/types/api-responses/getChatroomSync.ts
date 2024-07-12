/* eslint-disable @typescript-eslint/no-explicit-any */
import { SdkClientInfo } from "../models/member";

export interface GetChatroomsSyncResponse {
  success: boolean;
  data: Data;
}

export interface Data {
  card_attachments_meta: Record<string, never>;
  chatrooms_data: ChatroomData[];
  community_meta: Record<string, CommunityMeta>;
  conv_attachments_meta: Record<string, ConvAttachmentMeta[]>;
  conv_polls_meta: Record<string, never>;
  conversation_meta: Record<string, ConversationMeta>;
  sync_meta: Record<string, never>;
  user_meta: Record<string, UserMeta>;
  widgets: Record<string, never>;
}

export interface ChatroomData {
  about: string | any;
  access: any;
  access_without_subscription: boolean;
  attachment_count: number;
  attachments_uploaded: boolean;
  attending_status: boolean;
  auto_follow_done: boolean;
  card_id: number;
  chat_request_created_at: any;
  chat_request_state: any;
  chat_requested_by_id: any;
  chatroom_image_url: string | any;
  chatroom_with_user_id: any;
  co_hosts: string | any;
  community_id: number;
  created_at: number;
  custom_tag: string;
  date: string;
  date_epoch: number;
  date_time: number;
  deleted_by_user_id: any;
  device_id: string | any;
  event_kind: string;
  expiry_time: any;
  external_seen: boolean;
  follow_status: boolean;
  has_been_named: boolean;
  has_files: boolean;
  has_reactions: boolean;
  header: string;
  id: number;
  internal_link: any;
  is_edited: boolean;
  is_paid: boolean;
  is_pending: boolean;
  is_private: boolean;
  is_private_member: boolean;
  is_secret: boolean;
  is_tagged: boolean;
  last_conversation_id: number;
  last_seen_conversation_id: number | any;
  member_can_message: boolean;
  mute_status: boolean;
  og_tags: any;
  online_link: string;
  online_link_type: any;
  secret_chatroom_left: boolean;
  secret_chatroom_participants: any;
  share_link: string;
  state: number;
  title: string;
  topic_id: number | any;
  type: number;
  unseen_count: number;
  updated_at: number;
  user_id: number;
}

export interface CommunityMeta {
  id: number;
  image_url: string;
  is_paid: boolean;
  name: string;
  purpose: string;
  sub_type: number;
  type: number;
}

export interface ConvAttachmentMeta {
  answer_id: number;
  created_at: number;
  dimensions: any;
  file_url: string;
  height: number;
  id: number;
  index: number;
  location_lat: any;
  location_long: any;
  location_name: any;
  meta: {
    size: number;
  };
  name: string;
  thumbnail_url: any;
  type: string;
  width: number;
}

export interface ConversationMeta {
  allow_add_option: boolean;
  answer: string;
  api_version: number;
  attachment_count: number;
  attachments_uploaded: boolean;
  card_id: number;
  co_hosts: any; // Changed from any
  community_id: number;
  created_at: string;
  created_epoch: number;
  date: string;
  deleted_by_user_id: any; // Changed from any
  device_id: string | any; // Changed from string | any
  end_time: number;
  expiry_time: any; // Changed from any
  has_files: boolean;
  has_reactions: boolean;
  header: any; // Changed from any
  id: number;
  internal_link: any; // Changed from any
  is_anonymous: boolean;
  is_edited: boolean;
  last_updated: number;
  location: any; // Changed from any
  location_lat: any; // Changed from any
  location_long: any; // Changed from any
  multiple_select_no: any; // Changed from any
  multiple_select_state: any; // Changed from any
  og_tags: any; // Changed from any
  online_link_enable_before: number;
  poll_answer_text: string;
  poll_type: any; // Changed from any
  poll_type_text: any; // Changed from any
  preview_chatroom_id: any; // Changed from any
  preview_community_id: any; // Changed from any
  preview_type: any; // Changed from any | string
  reply_chatroom_id: any; // Changed from any
  reply_id: any; // Changed from any
  start_time: number;
  state: number;
  submit_type_text: any; // Changed from any
  temporary_id: any; // Changed from any | string
  to_show_results: boolean;
  user_id: number;
  widget_id: string;
}
export interface UserMeta {
  created_at: number;
  custom_title: string;
  id: number;
  image_link: string;
  image_url: string | any;
  is_guest: boolean;
  is_owner: boolean;
  name: string;
  sdk_client_info: SdkClientInfo;
  state: number;
  user_unique_id: string;
  uuid: string;
}
