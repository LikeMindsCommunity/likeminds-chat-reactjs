import {
  LMResponse,
  ValidateUserResponse as LMValidateUserResponse,
  InitiateUserResponse as LMInitiateUserResponse,
} from "@likeminds.community/chat-js-beta";

export interface ValidateUserResponse
  extends LMResponse<LMValidateUserResponse> {}

export interface InitiateUserResponse
  extends LMResponse<LMInitiateUserResponse> {}
