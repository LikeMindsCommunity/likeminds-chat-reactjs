// import { TaggingMember } from "../models/taggingMember";

import Member from "../models/member";

export interface GetTaggingListResponse {
  success: boolean;
  data: {
    members?: Member[];
    community_members?: Member[];
  };
}
