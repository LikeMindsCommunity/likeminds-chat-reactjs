import React from "react";
import { ReportTagMessage } from "../../types/api-responses/getReportTagsResponseChatResponse";

export interface ReportTagComponentProp {
  selectedTag: ReportTagMessage | null;
  tag: ReportTagMessage;
  setSelectedTag: React.Dispatch<ReportTagMessage | null>;
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
