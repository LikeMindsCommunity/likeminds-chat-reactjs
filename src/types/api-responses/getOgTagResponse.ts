import { OgTag } from "../models/ogTag";

export interface GetOgTagResponse {
  success: boolean;
  data: {
    og_tags: OgTag;
  };
}
