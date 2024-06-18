import { User } from "../models/member";
import { Reply } from "../models/replies";

interface Users {
  [key: string]: User;
}

export interface PostResponse {
  success: boolean;
  data: {
    comment: Reply;

    users: Users;
  };
}
