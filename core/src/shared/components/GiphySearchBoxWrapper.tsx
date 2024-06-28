import React from "react";
// import "react-giphy-searchbox/dist/react-giphy-searchbox.css";

const GiphySearchBox = React.lazy(() =>
  import("react-giphy-searchbox").then((module) => ({
    default: module.default,
  })),
);

const GiphySearchBoxWrapper: React.FC<{
  apiKey: string;
  onSelect: (item: any) => void;
}> = ({ apiKey, onSelect }) => (
  <React.Suspense fallback={<div>Loading...</div>}>
    <GiphySearchBox apiKey={apiKey} onSelect={onSelect} />
  </React.Suspense>
);

export default GiphySearchBoxWrapper;
