import React from "react";
import { ReportTag } from "../../types/models/ReportTags";
export interface ReportTagComponentProp {
  selectedTag: ReportTag | null;
  tag: ReportTag;
  setSelectedTag: React.Dispatch<ReportTag | null>;
}
const ReportTagComponent = ({
  selectedTag,
  setSelectedTag,
  tag,
}: ReportTagComponentProp) => {
  return (
    <span
      lm-feed-component-id={`lm-feed-report-tag-vwxyz`}
      className={`${selectedTag?.id === tag.id ? "active" : ""}`}
      key={tag.id}
      onClick={() => {
        setSelectedTag(tag);
      }}
    >
      {tag.name}
    </span>
  );
};

export default ReportTagComponent;
