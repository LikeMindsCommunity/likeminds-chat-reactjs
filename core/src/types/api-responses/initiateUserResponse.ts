import {
  LMResponse,
  ValidateUserResponse as LMValidateUserResponse,
  InitiateUserResponse as LMInitiateUserResponse,
} from "@likeminds.community/chat-js";

export interface ValidateUserResponse
  extends LMResponse<LMValidateUserResponse> {}

export interface InitiateUserResponse
  extends LMResponse<LMInitiateUserResponse> {}
