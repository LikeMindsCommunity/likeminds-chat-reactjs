import {
  LMResponse,
  ViewParticipantsResponse as LMViewParticipantsResponse,
} from "@likeminds.community/chat-js";

export interface ViewParticipantsResponse
  extends LMResponse<LMViewParticipantsResponse> {}
