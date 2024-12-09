import {
  LMResponse,
  PostConversationResponse as LMPostConversationResponse,
} from "@likeminds.community/chat-js-beta";

export interface PostConversationResponse
  extends LMResponse<LMPostConversationResponse> {}
