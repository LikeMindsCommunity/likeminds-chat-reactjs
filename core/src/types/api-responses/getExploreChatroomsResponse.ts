import {
  GetExploreFeedResponse as LMGetExploreFeedResponse,
  LMResponse,
} from "@likeminds.community/chat-js-beta";

export interface GetExploreChatroomsResponse
  extends LMResponse<LMGetExploreFeedResponse> {}
