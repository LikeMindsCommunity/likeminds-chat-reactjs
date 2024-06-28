import { Topic } from "../models/topic";
export interface GetTopicsResponse {
  success: boolean;
  data: {
    topics: Topic[];
  };
}
