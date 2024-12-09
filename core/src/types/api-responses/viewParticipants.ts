import {
  LMResponse,
  ViewParticipantsResponse as LMViewParticipantsResponse,
} from "@likeminds.community/chat-js-beta";

export interface ViewParticipantsResponse
  extends LMResponse<LMViewParticipantsResponse> {}
