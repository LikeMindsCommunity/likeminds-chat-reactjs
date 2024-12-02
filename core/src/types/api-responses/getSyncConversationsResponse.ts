import {
  GetConversation,
  LMResponseType,
} from "@likeminds.community/chat-js-beta";

export interface GetSyncConversationsResponse
  extends LMResponseType<GetConversation> {}
