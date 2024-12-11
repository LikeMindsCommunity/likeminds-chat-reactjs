import {
  SyncConversationResponse,
  LMResponse,
} from "@likeminds.community/chat-js";

export interface GetSyncConversationsResponse
  extends LMResponse<SyncConversationResponse> {}
