import { SDKClientInfo } from "./getChatroomResponse";

export interface Participant {
  id: number;
  image_url: string;
  is_guest: boolean;
  name: string;
  sdk_client_info: SDKClientInfo;
  state: number;
  user_unique_id: string;
  uuid: string;
  custom_title?: string; // Optional property for custom title
}

export interface ResponseData {
  can_edit_participant: boolean;
  participants: Participant[];
  total_participants_count?: number;
  // widgets: { [key: string]: any }; // Assuming widgets can have dynamic keys
}

export interface ViewParticipantsResponse {
  success: boolean;
  data: ResponseData;
}
