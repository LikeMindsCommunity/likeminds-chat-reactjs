/* eslint-disable @typescript-eslint/no-explicit-any */
import { SyncChatroomResponse, LMResponse } from "@likeminds.community/chat-js";

export interface GetChatroomsSyncResponse
  extends LMResponse<SyncChatroomResponse> {}
