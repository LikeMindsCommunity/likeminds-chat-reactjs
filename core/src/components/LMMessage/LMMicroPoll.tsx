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
  } = usePoll();
  const { openDialog, dialogOpen, closeDialog } = useDialog();
  const [tabIndex, setTabIndex] = useState(0);
  // const { openVoteCountDialog, voteCountDialogOpen, closeVoteCountDialog } =
  //   useDialog();
  const { currentUser } = useContext(UserProviderContext);
  const isSender =
    message?.member?.sdkClientInfo.uuid === currentUser?.sdkClientInfo.uuid;
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
    <div className={`lm-chat-card  ${messageClass}  `}>
      {!isSender ? <div className="lmUserData">{avatarContent}</div> : null}
      <div className={`conversation lm-poll  ${messageClass}`}>
        <div className="user-profile">
          <div className="name">{message.member.name}</div>
          <div className="info">{message.poll_type_text}</div>
        </div>
        <div className="poll-header">
          <div className="poll-icon">
            <img src={pollIcon} alt="Poll Icon" />
          </div>
          <button className="ends">{`Ends ${dayjs(message.expiry_time).fromNow()}`}</button>
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

        {/* <div className="totalVotes" onClick={openDialog}> */}
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

        <div className="time">
          {message.is_edited ? (
            <>
              <div className="error-message">Edited</div>
              <div className="edited-bullet">&nbsp;</div>
            </>
          ) : null}
          {message?.created_at}
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
      <Dialog open={dialogOpen} onClose={closeDialog}>
        <div className="lm-poll-response-add-option-dialog">
          <div className="lm-poll-response-add-option-dialog-header">
            <div className="lm-poll-response-add-option-dialog-header-title">
              Poll Results
            </div>
            <div className="lm-poll-response-add-option-dialog-header-close lm-cursor-pointer">
              <span onClick={closeDialog}>
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
                <Tab>
                  <div className="lm-voter-tabs">
                    <div className="counts">10</div>
                    <div>Options</div>
                  </div>
                </Tab>
                <Tab>
                  <div className="lm-voter-tabs">
                    <div className="counts">5</div>
                    <div>Options 2</div>
                  </div>
                </Tab>
                <Tab>
                  <div className="lm-voter-tabs">
                    <div className="counts">0</div>
                    <div>Options 3</div>
                  </div>
                </Tab>
              </TabList>

              <TabPanel>
                <div className="lm-voters">
                  <div className="lm-voter-img">
                    <img src={pollIcon} />
                  </div>
                  <div className="lm-voter">
                    <div className="lm-voter-name">Rajesh K</div>
                    <div className="lm-voter-desc">
                      I am scientist with big interest in how data shapes our
                      lives.
                    </div>
                  </div>
                </div>
                <div className="lm-voters">
                  <div className="lm-voter-img">
                    <img src={pollIcon} />
                  </div>
                  <div className="lm-voter">
                    <div className="lm-voter-name">Rajesh K</div>
                    <div className="lm-voter-desc">
                      I am scientist with big interest in how data shapes our
                      lives.
                    </div>
                  </div>
                </div>
                <div className="lm-voters">
                  <div className="lm-voter-img">
                    <img src={pollIcon} />
                  </div>
                  <div className="lm-voter">
                    <div className="lm-voter-name">Rajesh K</div>
                    <div className="lm-voter-desc">
                      I am scientist with big interest in how data shapes our
                      lives.
                    </div>
                  </div>
                </div>
              </TabPanel>
              <TabPanel>
                <div className="lm-voters">
                  <div className="lm-voter-img">
                    <img src={pollIcon} />
                  </div>
                  <div className="lm-voter">
                    <div className="lm-voter-name">Rajesh K</div>
                    <div className="lm-voter-desc">
                      I am scientist with big interest in how data shapes our
                      lives.
                    </div>
                  </div>
                </div>
              </TabPanel>
              <TabPanel>
                <div className="lm-voters">
                  <div className="lm-voter-img">
                    <img src={pollIcon} />
                  </div>
                  <div className="lm-voter">
                    <div className="lm-voter-name">Rajesh K</div>
                    <div className="lm-voter-desc">
                      I am scientist with big interest in how data shapes our
                      lives.
                    </div>
                  </div>
                </div>
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
