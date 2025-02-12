import {
    LMResponse,
  } from "@likeminds.community/chat-js";
import { ChatroomDetails } from "./getChatroomResponse";
  
  interface SearchChatroomResponse {
    chatrooms: ChatroomDetails[]
  }

  export interface GetChatroomSearch
    extends LMResponse<SearchChatroomResponse> {}
  