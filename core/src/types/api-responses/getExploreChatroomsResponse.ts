/* eslint-disable @typescript-eslint/no-explicit-any */
export interface SdkClientInfo {
  community: number;
  user: number;
  user_unique_id: string;
  uuid: string;
  widget_id: string;
}

export interface Member {
  community_id: number;
  created_at: number;
  custom_title?: string;
  id: number;
  image_url: string;
  is_guest: boolean;
  is_owner: boolean;
  member_since: string;
  name: string;
  route: string;
  sdk_client_info: SdkClientInfo;
  state: number;
  user_unique_id: string;
  uuid: string;
}

export interface LastResponseMember extends Member {
  chatroom_id: number;
}

export interface Attachment {
  height: number;
  index: number;
  meta: {
    size: number;
  };
  name: string;
  type: string;
  url: string;
  width: number;
}

export interface Topic {
  answer: string;
  attachment_count: number;
  attachments: Attachment[];
  attachments_uploaded: boolean;
  audios: any[];
  chatroom_id: number;
  community_id: number;
  created_at: string;
  created_epoch: number;
  date: string;
  has_files: boolean;
  id: number;
  images: Attachment[];
  is_edited: boolean;
  member: Member;
  pdf: any[];
  reactions: any[];
  state: number;
  temporary_id: string;
  videos: any[];
  widget_id: string;
}

export interface ExploreChatroom {
  access: null;
  access_without_subscription: boolean;
  answer_text: string;
  answers_count: number;
  attachment_count: number;
  attachments_uploaded: boolean;
  attended: boolean;
  attending_count: number;
  attending_status: boolean;
  audio_count: number;
  auto_follow_done: boolean;
  card_creation_time: string;
  chat_request_created_at: null;
  chat_request_state: null;
  chat_requested_by: null;
  chatroom_image_url?: string;
  co_hosts?: any[];
  cohorts: any[];
  community_id: number;
  community_name: string;
  created_at: string;
  custom_tag: string;
  date: string;
  date_epoch: number;
  date_time: number;
  duration: number;
  event_kind: string;
  external_seen: boolean;
  follow_status: boolean;
  header: string;
  id: number;
  image_count: number;
  include_members_later: boolean;
  is_edited: boolean;
  is_guest: boolean;
  is_paid: boolean;
  is_pending: boolean;
  is_pinned: boolean;
  is_private: boolean;
  is_private_member: boolean;
  is_secret: boolean;
  is_tagged: boolean;
  last_response_members: LastResponseMember[];
  member: Member;
  member_can_message: boolean;
  mute_status: boolean;
  online_link_enable_before: number;
  online_link_type: null;
  participants_count: number;
  pdf_count: number;
  polls_count: number;
  reactions: any[];
  share_link: string;
  state: number;
  third_party_unique_id: null | string;
  title: string;
  topic?: Topic;
  total_response_count: number;
  type: number;
  updated_at: number;
  video_count: number;
}

export interface GetExploreChatroomsResponse {
  success: boolean;
  data: {
    chatrooms: ExploreChatroom[];
    pinned_chatrooms_count: number;
    // widgets: {};
  };
}
