import {
  GetConversation,
  LMResponseType,
} from "@likeminds.community/chat-js-beta";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface GetSyncConversationsResponse
  extends LMResponseType<GetConversation> {}
