import { User } from "../models/member";
import { Post } from "../models/post";
import { Topic } from "../models/topic";

export interface AddPostResponse {
  success: boolean;
  data: {
    post: Post;

    topics: Record<string, Topic>;

    users: Record<string, User>;
  };
}
export interface EditPostResponse {
  success: boolean;
  data: {
    post: Post;

    topics: Record<string, Topic>;

    users: Record<string, User>;
  };
}
