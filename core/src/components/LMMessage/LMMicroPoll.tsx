import React, { useContext } from "react";
import MessageContext from "../../context/MessageContext";
import pollIcon from "../../assets/img/poll-icon.svg";
import { usePoll } from "../../hooks/usePolls";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useDialog } from "../../hooks/useDialog";
import { Dialog } from "@mui/material";
dayjs.extend(relativeTime);
const LMMicroPoll = () => {
  const { message } = useContext(MessageContext);
  const {
    selectPollOption,
    selectedPollOptions,
    temporaryAddOptionText,
    setTemporaryAddOptionText,
    addOptionOnPoll,
    submitPoll,
    calculateAddPollOptionButtonVisibility,
    calculateSubmitButtonVisibility,
  } = usePoll();
  const { openDialog, dialogOpen, closeDialog } = useDialog();

  return (
    <div className="conversation reciever">
      <div className="lm-poll">
        <div className="user-profile">
          <div className="name">{message.member.name}</div>
          <div className="info">{message.poll_type_text}</div>
        </div>
        <div className="poll-header">
          <div className="poll-icon">
            <img src={pollIcon} alt="Poll Icon" />
          </div>
          <button className="ends">{`Ends in ${dayjs(message.expiry_time).fromNow()}`}</button>
        </div>
        <div className="poll-title">{message.answer}</div>
        {message.polls.map((poll) => {
          return (
            <div className={`pollOptions lm-cursor-pointer`} key={poll.id}>
              <div
                onClick={(e) => {
                  selectPollOption(e);
                }}
                id={poll.id.toString()}
                className={`pollOption  ${selectedPollOptions.some((selectedOption) => selectedOption.id.toString() === poll.id.toString()) ? "pollOptionSelected" : ""}
                 ${poll.is_selected ? "pollOptionSubmitted" : ""}`}
              >
                {poll.text}
              </div>
              <div className="votes">{`${poll.no_votes} votes`}</div>
            </div>
          );
        })}

        {calculateAddPollOptionButtonVisibility() && (
          <div className="add-option-to-poll" onClick={openDialog}>
            <div className="option">Add Option</div>
          </div>
        )}

        <div className="totalVotes">{message.poll_answer_text}</div>
        {calculateSubmitButtonVisibility() && (
          <div className="lm-poll-submit">
            <button
              onClick={submitPoll}
              className={`lm-poll-submit-button lm-cursor-pointer lm-poll-submit-button-active`}
            >
              Submit
            </button>
          </div>
        )}
      </div>
      <Dialog open={dialogOpen} onClose={closeDialog}>
        <div className="lm-poll-response-add-option-dialog">
          <div className="lm-poll-response-add-option-dialog-header">
            <div className="lm-poll-response-add-option-dialog-header-title">
              Add new poll option
            </div>

            <div className="lm-poll-response-add-option-dialog-header-close lm-cursor-pointer">
              <span onClick={closeDialog}>X</span>
            </div>
          </div>
          <div className="lm-poll-response-add-option-dialog-body">
            <div className="lm-poll-response-add-option-dialog-body-text">
              Enter an option that you think is missing in this poll. This can
              not be undone.
            </div>
            <input
              className="lm-poll-response-add-option-input"
              type="text"
              placeholder="Type your option"
              value={temporaryAddOptionText}
              onChange={(e) => {
                setTemporaryAddOptionText(e.target.value);
              }}
            />
            <button
              onClick={() => {
                addOptionOnPoll();
                closeDialog();
              }}
              className="lm-poll-response-add-option-submit "
            >
              SUBMIT
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default LMMicroPoll;
