import { User } from "../models/member";
import { Post } from "../models/post";
import { Topic } from "../models/topic";

export interface GetPostDetailsResponse {
  success: boolean;
  data: {
    post: Post;
    // repostedPosts: Record<string, any>; // Replace 'Record<string, any>' with actual type if known
    topics: Record<string, Topic>; // Replace 'Record<string, any>' with actual type if known
    users: Record<string, User>; // Replace 'Record<string, User>' with actual type if known
    // widgets: Record<string, any>; // Replace 'Record<string, any>' with actual type if known
  };
  errorMessage?: string;
}
