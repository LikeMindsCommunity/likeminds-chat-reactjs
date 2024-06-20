import { TaggingMember } from "../models/taggingMember";

export interface GetTaggingListResponse {
  success: boolean;
  data: {
    members: TaggingMember[];
  };
}
