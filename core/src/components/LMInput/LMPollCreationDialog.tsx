import React from "react";
import { useCreatePoll } from "../../hooks/useCreatePoll";
import removePollOptionIcon from "../../assets/img/remove-poll-option.png";
import pollOptionAddMoreIcon from "../../assets/img/poll-option-add-more.png";
const LMPollCreationDialog = () => {
  const {
    pollText,
    changePollText,
    pollOptions,
    updatePollOption,
    removePollOption,
  } = useCreatePoll();
  return (
    <div className="lm-poll-wrapper">
      <p className="lm-poll-heading">New Poll</p>
      <div className="lm-poll-creation-body">
        <textarea
          name="poll-creation-textarea"
          id="poll-creation-textarea"
          className="poll-creation-textarea"
          value={pollText}
          onChange={changePollText}
          placeholder="Ask a question*"
        ></textarea>
        <div className="poll-options-container">
          <p className="poll-options-head-text">POLL OPTIONS *</p>
          {pollOptions.map((pollOption, index) => {
            return (
              <div className="poll-option-wrapper" key={index}>
                <input
                  type="text"
                  value={pollOption}
                  onChange={(e) => updatePollOption(e.target.value, index)}
                  placeholder={`Option ${index + 1}`}
                  className="poll-option-text-input"
                />
                <span
                  className="poll-option-remove"
                  onClick={() => removePollOption(index)}
                >
                  <img src={removePollOptionIcon} alt="remove" />
                </span>
              </div>
            );
          })}
          <div className="poll-option-add-more">
            <div className="poll-option-add-more-icon">
              <img src={pollOptionAddMoreIcon} alt="addMore" />
              <span className="add-more-text">Add an option</span>
            </div>
          </div>
          <p className="poll-expires-heading">POLL EXPIRES ON*</p>
        </div>
      </div>
    </div>
  );
};

export default LMPollCreationDialog;
