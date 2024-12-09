import {
  GetAIChatbotsResponse as LMAiChatbotResponse,
  LMResponse,
} from "@likeminds.community/chat-js-beta";

export interface GetAIChatbotsResponse
  extends LMResponse<LMAiChatbotResponse> {}
