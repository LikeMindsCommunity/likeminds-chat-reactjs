import {
  GetAIChatbotsResponse as LMAiChatbotResponse,
  LMResponse,
} from "@likeminds.community/chat-js";

export interface GetAIChatbotsResponse
  extends LMResponse<LMAiChatbotResponse> {}
