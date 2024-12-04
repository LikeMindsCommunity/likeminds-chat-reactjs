import {
  SyncConversationResponse,
  LMResponse,
} from "@likeminds.community/chat-js-beta";

export interface GetSyncConversationsResponse
  extends LMResponse<SyncConversationResponse> {}
