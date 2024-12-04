// import { TaggingMember } from "../models/taggingMember";

import {
  GetTaggingListResponse as LMGetTaggingListResponse,
  LMResponse,
} from "@likeminds.community/chat-js-beta";

export interface GetTaggingListResponse
  extends LMResponse<LMGetTaggingListResponse> {}
