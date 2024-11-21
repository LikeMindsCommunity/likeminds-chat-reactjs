import React from "react";
// import { ReportTagObject } from "../../types/api-responses/getReportTagsResponseChatResponse";
import { ReportTagObject } from "../../types/models/ReportTags";
export interface ReportTagComponentProp {
  selectedTag: ReportTagObject | null;
  tag: ReportTagObject;
  setSelectedTag: React.Dispatch<ReportTagObject | null>;
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
