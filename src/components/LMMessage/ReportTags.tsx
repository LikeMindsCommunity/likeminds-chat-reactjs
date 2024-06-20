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
      <div className="lmReportPostWrapper">
        <div className="lmReportPostWrapper__header">Report Post</div>
        {/* <img
          src={closeIcon}
          className="lmReportPostWrapper__header__closeIcon"
          alt="close-icon"
          onClick={closeReportDialog}
        /> */}
        <div className="lmReportPostWrapper__body">
          <div className="lmReportPostWrapper__body__content">
            <div className="lmReportPostWrapper__body__content--texted">
              <span>Please specify the problem to continue </span> <br />
              You would be able to report this Post after selecting a problem.
            </div>
            <div className="lmReportPostWrapper__body__content__types">
              {reportTags.map((tag) => {
                return (
                  <span
                    lm-feed-component-id={`lm-feed-report-tag-vwxyz`}
                    // className={`${selectedTag?.id === tag.id ? "active" : ""}`}
                    key={tag.id}
                    onClick={() => {
                      reportCallback({
                        id: tag.id,
                        reason: tag.name,
                      });
                    }}
                  >
                    {tag.name}
                  </span>
                );
              })}
            </div>

            {/* <div className="lmReportPostWrapper__body__content__actions">
              {selectedTag?.id === 11 ? (
                <input
                  value={otherReason}
                  onChange={(e) => {
                    setOtherReasons(e.target.value);
                  }}
                  placeholder="Enter the reason here..."
                  type="text"
                  lm-feed-component-id={`lm-feed-report-input-fghij`}
                  className="lmReportPostWrapper__body__content__actions--input"
                />
              ) : null}
              <button
                onClick={report}
                disabled={!selectedTag}
                className="lmReportPostWrapper__body__content__actions--btnReport"
                lm-feed-component-id={`lm-feed-report-submit-klmno`}
              >
                Report
              </button>
            </div> */}
          </div>
        </div>
      </div>

      {/* {reportTags.map((tag) => {
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
      })} */}
    </div>
  );
};

export default ReportTagsDialog;
