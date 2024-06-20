import React, { useContext, useEffect, useState } from "react";
import GlobalClientProviderContext from "../../context/GlobalClientProviderContext";
import {
  GetReportTagsChatResponse,
  ReportTagMessage,
} from "../../types/api-responses/getReportTagsResponseChatResponse";
import { OneArgVoidReturns } from "../../hooks/useInput";

const ReportTagsDialog = ({
  reportCallback,
}: {
  reportCallback: OneArgVoidReturns<{
    id: string | number;
    reason: string | null;
  }>;
}) => {
  const { lmChatclient } = useContext(GlobalClientProviderContext);
  const [reportTags, setReportTags] = useState<ReportTagMessage[]>([]);

  useEffect(() => {
    async function getTags() {
      try {
        const call: GetReportTagsChatResponse =
          await lmChatclient?.getReportTags({
            type: 0,
          });
        if (call.success) {
          setReportTags(() => call?.data?.report_tags || []);
        }
      } catch (error) {
        console.log(error);
      }
    }
    getTags();
  }, [lmChatclient]);
  return (
    <div>
      {reportTags.map((tag) => {
        return (
          <div
            key={tag.id}
            onClick={() => {
              reportCallback({
                id: tag.id,
                reason: tag.name,
              });
            }}
            className=""
          >
            {tag.name}
          </div>
        );
      })}
    </div>
  );
};

export default ReportTagsDialog;
