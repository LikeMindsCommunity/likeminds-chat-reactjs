/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  SyncChatroomResponse,
  LMResponse,
} from "@likeminds.community/chat-js-beta";

export interface GetChatroomsSyncResponse
  extends LMResponse<SyncChatroomResponse> {}
