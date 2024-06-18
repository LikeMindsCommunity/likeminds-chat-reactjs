import { User } from "../models/member";
import { Reply } from "../models/replies";

export interface PostCommentResponse {
  success: boolean;
  data: {
    comment: Reply;
    users: Record<string, User>;
  };
}
export interface EditCommentResponse {
  success: boolean;
  data: {
    comment: Reply;
    users: Record<string, User>;
  };
}

export interface PostReplyResponse {
  success: boolean;
  data: {
    comment: Reply;
    users: Record<string, User>;
  };
}
