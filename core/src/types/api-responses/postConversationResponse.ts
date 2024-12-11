import {
  LMResponse,
  PostConversationResponse as LMPostConversationResponse,
} from "@likeminds.community/chat-js";

export interface PostConversationResponse
  extends LMResponse<LMPostConversationResponse> {}
