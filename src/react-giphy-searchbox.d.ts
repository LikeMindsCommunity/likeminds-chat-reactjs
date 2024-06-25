/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "react-giphy-searchbox" {
  import { ComponentType } from "react";

  interface GiphySearchboxProps {
    apiKey: string;
    // Define other props here as needed
    onSelect?: (item: any) => void;
    masonryConfig?: Array<{
      columns: number;
      imageWidth: number;
      gutter: number;
    }>;
    gifPerPage?: number;
    rating?: string;
    searchPlaceholder?: string;
  }

  const GiphySearchbox: ComponentType<GiphySearchboxProps>;
  export default GiphySearchbox;
}
