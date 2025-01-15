import React, { useContext, useState } from "react";
import MessageContext from "../../context/LMMessageContext";
import { usePoll } from "../../hooks/usePolls";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useDialog } from "../../hooks/useDialog";
import { Dialog } from "@mui/material";

import { Tab, Tabs, TabList, TabPanel } from "react-tabs"; // Assuming you are using react-tabs

import "react-tabs/style/react-tabs.css";
import modalCancelIcon from "../../assets/img/cancel-icon.svg";
import pollIcon from "../../assets/img/poll-icon.svg";
import UserProviderContext from "../../context/LMUserProviderContext";
import { getAvatar } from "../../shared/components/LMUserMedia";
import LMGlobalClientProviderContext from "../../context/LMGlobalClientProviderContext";

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
    getPollUsers,
    pollUsers,
  } = usePoll();
  const { openDialog, dialogOpen, closeDialog } = useDialog();
  const {
    openDialog: dialogOpenpollUsers,
    dialogOpen: pollUsersDialogOpen,
    closeDialog: closePollUsersDialog,
  } = useDialog();
  const [tabIndex, setTabIndex] = useState(0);

  const { currentUser } = useContext(UserProviderContext);
  const isSender = message?.member?.uuid === currentUser?.uuid;
  const messageClass = isSender ? "sender" : "receiver";
  const imageUrl = message?.member.imageUrl;
  const name = message?.member.name;
  const avatarContent = getAvatar({ imageUrl, name });
  const { customComponents } = useContext(LMGlobalClientProviderContext);

  // Custom component
  if (customComponents?.input?.chatroomInputPollCreation) {
    return <customComponents.input.chatroomInputPollCreation />;
  }
  // Default component

  return (
    <div
      className={`lm-chat-card  ${messageClass}`}
      id={`lm-chat-message-${message.id}-${message.temporaryId}-${message.state}`}
    >
      {!isSender ? <div className="lmUserData">{avatarContent}</div> : null}
      <div className={`conversation lm-poll  ${messageClass}`}>
        <div className="user-profile">
          <div className="name">{message.member.name}</div>
          <div className="info">{message.pollTypeText}</div>
        </div>
        <div className="poll-header">
          <div className="poll-icon">
            <img src={pollIcon} alt="Poll Icon" />
          </div>
          <button className="ends">{`Ends ${dayjs(message.expiryTime).fromNow()}`}</button>
        </div>
        <div className="poll-title">{message.answer}</div>
        {message?.polls?.map((poll) => {
          return (
            <div className={`pollOptions lm-cursor-pointer`} key={poll.id}>
              <div
                onClick={(e) => {
                  selectPollOption(e);
                }}
                id={poll.id.toString()}
                className={`pollOption  ${selectedPollOptions.some((selectedOption) => selectedOption.id.toString() === poll.id.toString()) ? "pollOptionSelected" : ""}
                 ${poll.isSelected ? "pollOptionSubmitted" : ""}`}
              >
                {poll.text}
              </div>
              <div
                className="votes"
                onClick={() => {
                  dialogOpenpollUsers();
                  getPollUsers(parseInt(poll.id.toString()));
                }}
              >
                {`${poll.noVotes} votes`}
              </div>
            </div>
          );
        })}

        {calculateAddPollOptionButtonVisibility() && (
          <div className="add-option-to-poll" onClick={openDialog}>
            <div className="option">Add Option</div>
          </div>
        )}

        {/* <div className="totalVotes" onClick={openDialog}> */}
        <div className="totalVotes">{message.pollAnswerText}</div>
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

        <div className="time">
          {message.isEdited ? (
            <>
              <div className="error-message">Edited</div>
              <div className="edited-bullet">&nbsp;</div>
            </>
          ) : null}
          {message?.createdAt}
        </div>
      </div>

      <Dialog open={dialogOpen} onClose={closeDialog}>
        <div className="lm-poll-response-add-option-dialog">
          <div className="lm-poll-response-add-option-dialog-header">
            <div className="lm-poll-response-add-option-dialog-header-title">
              Add new poll option
            </div>

            <div className="lm-poll-response-add-option-dialog-header-close lm-cursor-pointer">
              <span onClick={closeDialog}>
                <img src={modalCancelIcon} alt="Close" />
              </span>
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
              className="lm-poll-response-add-option-submit"
            >
              SUBMIT
            </button>
          </div>
        </div>
      </Dialog>

      {/* Total Vote counts */}
      <Dialog open={pollUsersDialogOpen} onClose={closePollUsersDialog}>
        <div className="lm-poll-response-add-option-dialog">
          <div className="lm-poll-response-add-option-dialog-header">
            <div className="lm-poll-response-add-option-dialog-header-title">
              Poll Results
            </div>
            <div className="lm-poll-response-add-option-dialog-header-close lm-cursor-pointer">
              <span onClick={closePollUsersDialog}>
                <img src={modalCancelIcon} alt="Close" />
              </span>
            </div>
          </div>
          <div className="">
            <Tabs
              selectedIndex={tabIndex}
              onSelect={(index) => setTabIndex(index)}
            >
              <TabList>
                {message.polls?.map((poll) => {
                  return (
                    <Tab
                      key={poll.id}
                      onClick={() => {
                        setTabIndex(parseInt(poll.id.toString()));
                        getPollUsers(parseInt(poll.id.toString()));
                      }}
                    >
                      <div className="lm-voter-tabs" key={poll.id}>
                        <div className="counts">{poll.noVotes}</div>
                        <div>{poll.text}</div>
                      </div>
                    </Tab>
                  );
                })}
              </TabList>

              <TabPanel tabIndex={tabIndex}>
                {pollUsers.map((pollUser) => {
                  const avatar = getAvatar({
                    imageUrl: pollUser.imageUrl,
                    name: pollUser.name,
                  });
                  return (
                    <div className="lm-voters">
                      <div className="lm-voter-img">{avatar}</div>
                      <div className="lm-voter">
                        <div className="lm-voter-name">{pollUser.name}</div>
                      </div>
                    </div>
                  );
                })}
              </TabPanel>
            </Tabs>
          </div>
        </div>
      </Dialog>
      {/* Total Vote counts */}
    </div>
  );
};

export default LMMicroPoll;
