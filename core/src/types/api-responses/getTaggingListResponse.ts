// import { TaggingMember } from "../models/taggingMember";

import {
  GetTaggingListResponse as LMGetTaggingListResponse,
  LMResponse,
} from "@likeminds.community/chat-js";

export interface GetTaggingListResponse
  extends LMResponse<LMGetTaggingListResponse> {}
