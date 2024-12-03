import React, { useContext, useEffect, useState } from "react";
import GlobalClientProviderContext from "../../context/LMGlobalClientProviderContext";
import { GetReportTagsChatResponse } from "../../types/api-responses/getReportTagsResponseChatResponse";
import { ReportTag } from "../../types/models/ReportTags";
import { OneArgVoidReturns, ZeroArgVoidReturns } from "../../hooks/useInput";
import ReportTagComponent from "./LMReportTagComponent";

import canceIcon from "../../assets/img/cancel-icon.svg";

const ReportTagsDialog = ({
  reportCallback,
  closeDialog,
}: {
  reportCallback: OneArgVoidReturns<{
    id: string | number;
    reason: string | null;
  }>;
  closeDialog: ZeroArgVoidReturns;
}) => {
  const { lmChatClient } = useContext(GlobalClientProviderContext);
  const [reportTags, setReportTags] = useState<ReportTag[]>([]);
  const [selectedTag, setSelectedTag] = useState<ReportTag | null>(null);
  const [newReasonTagText, setNewReasonTagText] = useState<string>("");
  useEffect(() => {
    async function getTags() {
      try {
        const call: GetReportTagsChatResponse =
          await lmChatClient?.getReportTags({
            type: 0,
          });
        if (call.success) {
          setReportTags(() => call?.data?.reportTags || []);
        }
      } catch (error) {
        console.log(error);
      }
    }
    getTags();
  }, [lmChatClient]);
  return (
    <div>
      <div className="lmReportPostWrapper">
        <div className="lmReportPostWrapper__header">
          Report Message
          <div className="lmReportPostWrapper__header__closeIcon">
            <img src={canceIcon} alt="canceIcon" onClick={closeDialog} />
          </div>
        </div>

        <div className="lmReportPostWrapper__body">
          <div className="lmReportPostWrapper__body__content">
            <div className="lmReportPostWrapper__body__content--texted">
              <span>Please specify the problem to continue </span> <br />
              You would be able to report this Post after selecting a problem.
            </div>
            <div className="lmReportPostWrapper__body__content__types">
              {reportTags.map((tag) => {
                return (
                  <ReportTagComponent
                    selectedTag={selectedTag}
                    setSelectedTag={setSelectedTag}
                    tag={tag}
                  />
                );
              })}
            </div>

            <div className="lmReportPostWrapper__body__content__actions">
              {selectedTag?.id === 11 ? (
                <input
                  value={newReasonTagText}
                  onChange={(e) => {
                    setNewReasonTagText(e.target.value);
                  }}
                  placeholder="Enter the reason here..."
                  type="text"
                  lm-feed-component-id={`lm-feed-report-input-fghij`}
                  className="lmReportPostWrapper__body__content__actions--input"
                />
              ) : null}
              <button
                onClick={() => {
                  if (selectedTag?.id === 11) {
                    reportCallback({
                      id: selectedTag.id,
                      reason: newReasonTagText,
                    });
                  } else {
                    reportCallback({
                      id: selectedTag!.id,
                      reason: selectedTag!.name,
                    });
                  }
                  closeDialog();
                }}
                disabled={!selectedTag}
                className="lmReportPostWrapper__body__content__actions--btnReport"
                lm-feed-component-id={`lm-feed-report-submit-klmno`}
              >
                Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportTagsDialog;
