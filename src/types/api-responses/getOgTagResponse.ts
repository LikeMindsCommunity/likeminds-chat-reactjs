export interface OgTag {
  title: string;
  image: string;
  description: string;
  url: string;
}

export interface GetOgTagResponse {
  success: boolean;
  data: {
    og_tags: OgTag;
  };
}
