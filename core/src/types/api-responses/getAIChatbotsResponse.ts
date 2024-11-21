import {
  GetAIChatbotsResponse as LMAiChatbotResponse,
  LMResponseType,
} from "@likeminds.community/chat-js-beta";

export interface GetAIChatbotsResponse
  extends LMResponseType<LMAiChatbotResponse> {}
