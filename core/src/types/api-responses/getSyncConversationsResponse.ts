/* eslint-disable @typescript-eslint/no-explicit-any */
export interface GetSyncConversationsResponse {
  success: boolean;
  data: {
    chatroom_meta: {
      [key: string]: {
        about: string;
        access: null;
        access_without_subscription: boolean;
        attachment_count: number;
        attachments_uploaded: boolean;
        attending_status: boolean;
        auto_follow_done: boolean;
        card_id: number;
        chat_request_created_at: null;
        chat_request_state: null;
        chat_requested_by_id: null;
        chatroom_image_url: string;
        chatroom_with_user_id: null;
        co_hosts: string;
        community_id: number;
        created_at: number;
        custom_tag: string;
        date: string;
        date_epoch: number;
        date_time: number;
        deleted_by_user_id: null;
        device_id: string;
        event_kind: string;
        expiry_time: null;
        external_seen: boolean;
        follow_status: boolean;
        has_been_named: boolean;
        has_files: boolean;
        has_reactions: boolean;
        header: string;
        id: number;
        internal_link: null;
        is_edited: boolean;
        is_paid: boolean;
        is_pending: boolean;
        is_private: boolean;
        is_private_member: boolean;
        is_secret: boolean;
        is_tagged: boolean;
        last_seen_conversation_id: number;
        member_can_message: boolean;
        mute_status: boolean;
        og_tags: any;
        online_link: string;
        online_link_type: null;
        secret_chatroom_left: boolean;
        secret_chatroom_participants: null;
        share_link: string;
        state: number;
        title: string;
        topic_id: null;
        type: number;
        updated_at: number;
        user_id: number;
      };
    };
    chatroom_reactions_meta: any;
    community_meta: {
      [key: string]: {
        id: number;
        image_url: string;
        is_paid: boolean;
        name: string;
        purpose: string;
        sub_type: number;
        type: number;
      };
    };
    conv_attachments_meta: any;
    conv_polls_meta: Record<string, PollMeta[]>;
    conv_reactions_meta: {
      [key: string]: Array<{
        chatroom_id: number;
        conversation_id: number;
        id: number;
        reaction: string;
        user_id: number;
      }>;
    };
    conversations_data: Array<{
      allow_add_option: boolean;
      answer: string;
      api_version: number;
      attachment_count: number;
      attachments_uploaded: boolean;
      card_id: number;
      co_hosts: null;
      community_id: number;
      created_at: string;
      created_epoch: number;
      date: string;
      deleted_by_user_id: null;
      device_id: string;
      end_time: number;
      expiry_time: null;
      has_files: boolean;
      has_reactions: boolean;
      header: null;
      id: number;
      internal_link: null;
      is_anonymous: boolean;
      is_edited: boolean;
      last_updated: number;
      location: null;
      location_lat: null;
      location_long: null;
      multiple_select_no: null;
      multiple_select_state: null;
      og_tags: null;
      online_link_enable_before: number;
      poll_answer_text: string;
      poll_type: null;
      poll_type_text: null;
      preview_chatroom_id: null;
      preview_community_id: null;
      preview_type: string;
      reply_chatroom_id: null;
      reply_id: null;
      start_time: number;
      state: number;
      submit_type_text: null;
      temporary_id: null;
      to_show_results: boolean;
      user_id: number;
      widget_id: string;
    }>;
    user_meta: {
      [key: string]: {
        created_at: number;
        custom_title: string;
        id: number;
        image_link: string;
        image_url: string | null;
        is_guest: boolean;
        is_owner: boolean;
        name: string;
        sdk_client_info: {
          community_id: number;
          id: number;
          user: number;
          user_unique_id: string;
          uuid: string;
          widget_id: string;
        };
        state: number;
        user_unique_id: string;
        uuid: string;
      };
    };
    widgets: any;
  };
}

interface PollMeta {
  conversation_id: number;
  count: null | number;
  id: number;
  is_selected: boolean;
  no_votes: number;
  percentage: null | number;
  text: string;
  user_id: number;
}
