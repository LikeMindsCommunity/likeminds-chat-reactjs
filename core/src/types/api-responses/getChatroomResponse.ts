/* eslint-disable @typescript-eslint/no-explicit-any */
export interface SDKClientInfo {
  community: number;
  user: number;
  user_unique_id: string;
  uuid: string;
  widget_id: string;
}

export interface Member {
  community_id: number;
  created_at: number;
  custom_title: string;
  id: number;
  image_url: string;
  is_guest: boolean;
  is_owner: boolean;
  member_since: string;
  name: string;
  route: string;
  sdk_client_info: SDKClientInfo;
  state: number;
  user_unique_id: string;
  uuid: string;
}

export interface LastResponseMember extends Member {
  chatroom_id: number;
}

export interface Chatroom {
  about_recording: any;
  access: any;
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
  chat_request_created_at: any;
  chat_request_state: any;
  chat_requested_by: any;
  chatroom_with_user?: Member;
  chatroom_image_url: string;
  co_hosts: any[];
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
  online_link_type: any;
  participants_count: number;
  pdf_count: number;
  polls_count: number;
  reactions: any[];
  recording_url_og_tags: any;
  recordings_attachments: any[];
  recordings_attachments_view: number;
  recordings_url: any[];
  share_link: string;
  show_follow_auto_tag: boolean;
  show_follow_telescope: boolean;
  state: number;
  third_party_unique_id: string;
  title: string;
  total_response_count: number;
  type: number;
  updated_at: number;
  video_count: number;
}

export interface ChatroomAction {
  id: number;
  title: string;
}

export interface BrandingAdvanced {
  buttons_icons_colour: string;
  header_colour: string;
  text_links_colour: string;
}

export interface BrandingBasic {
  primary_colour: string;
}

export interface Branding {
  advanced: BrandingAdvanced;
  basic: BrandingBasic;
}

export interface CommunitySettingRight {
  id: number;
  is_locked: boolean;
  is_selected: boolean;
  state: number;
  title: string;
  sub_title?: string;
}

export interface Community {
  auto_approval: boolean;
  branding: Branding;
  community_setting_rights: CommunitySettingRight[];
  fee_event: number;
  fee_membership: number;
  fee_payment_pages: number;
  grace_period: number;
  hide_dm_tab: boolean;
  id: number;
  image_url: string;
  is_discoverable: boolean;
  is_freemium_community: boolean;
  is_paid: boolean;
  is_whitelabel: boolean;
  members_count: number;
  name: string;
  purpose: string;
  referral_enabled: boolean;
  sub_type: number;
  type: number;
  updated_at: number;
}

export interface ConversationUser {
  id: number;
  image_url: string;
  name: string;
}

export interface ChatroomCollabcard {
  can_access_secret_chatroom: boolean | undefined;
  chatroom: Chatroom;
  chatroom_actions: ChatroomAction[];
  community: Community;
  conversation_users: ConversationUser[];
  last_conversation_id: number;
  participant_count: number;
  unread_messages: number;
  // widgets: any;
}

export interface GetChatroomResponse {
  success: boolean;
  data: ChatroomCollabcard;
}
