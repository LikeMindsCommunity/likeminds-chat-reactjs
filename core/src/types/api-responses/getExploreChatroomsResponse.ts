import {
  GetExploreFeedResponse as LMGetExploreFeedResponse,
  LMResponse,
} from "@likeminds.community/chat-js";

export interface GetExploreChatroomsResponse
  extends LMResponse<LMGetExploreFeedResponse> {}
