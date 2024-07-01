import Member from "./member";

export interface Conversation {
  answer: string;
  attachment_count: number;
  attachments_uploaded: boolean;
  chatroom_id: number;
  community_id: number;
  created_at: string;
  created_epoch: number;
  date: string;
  has_files: boolean;
  id: number;
  is_edited: boolean;
  member: Member;
  reactions: Reaction[];
  state: number;
  deleted_by?: number;
  deleted_by_member?: Member;
  poll_type: number;
  multiple_select_no: number;
  multiple_select_state: number;
  is_anonymous: boolean;
  allow_add_option: boolean;
  expiry_time: number;
  polls: Poll[];
  to_show_results: boolean;
  poll_type_text: string;
  submit_type_text: string;
  poll_answer_text: string;
  last_seen: boolean;
}

export default Conversation;

export interface Poll {
  id: number;
  text: string;
  is_selected: boolean;
  no_votes: number;
  percentage: number;
  member: Member;
}
export interface Reaction {
  member: Member;
  reaction: string;
}