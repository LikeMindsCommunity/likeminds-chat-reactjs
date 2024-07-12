import React, { useState } from "react";
import { useCreatePoll } from "../../hooks/useCreatePoll";
import removePollOptionIcon from "../../assets/img/remove-poll-option.png";
import pollOptionAddMoreIcon from "../../assets/img/poll-option-add-more.png";
import { DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import createPollTick from "../../assets/img/create-poll-tick.png";
import cancelIcon from "../../assets/img/cancel-icon.svg";
import dayjs from "dayjs";
import {
  Collapse,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Switch,
} from "@mui/material";
interface LMPollCreationDialogProps {
  closeDialog?: () => void;
}
const LMPollCreationDialog = ({ closeDialog }: LMPollCreationDialogProps) => {
  const {
    pollText,
    changePollText,
    pollOptions,
    updatePollOption,
    removePollOption,
    advancedOptions,
    updateAdvancedOptions,
    createPollConversation,
    addPollOption,
    updatePollExpirationDate,
    pollExpirationDate,
  } = useCreatePoll(closeDialog);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const toggleAdvancedOptions = () => {
    setIsAdvancedOpen((current) => !current);
  };
  return (
    <div className="lm-poll-wrapper">
      <div className="lm-poll-heading">
        New Poll
        <img
          src={cancelIcon}
          alt="close"
          className="close-icon"
          onClick={closeDialog}
        />
      </div>
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
                  value={pollOption.text}
                  onChange={(e) => updatePollOption(e.target.value, index)}
                  placeholder={`Option ${index + 1}`}
                  className="poll-option-text-input"
                />
                <span
                  className="poll-option-remove lm-cursor-pointer"
                  onClick={() => removePollOption(index)}
                >
                  <img src={removePollOptionIcon} alt="remove" />
                </span>
              </div>
            );
          })}
          <div className="poll-option-add-more" onClick={addPollOption}>
            <div className="poll-option-add-more-icon">
              <img src={pollOptionAddMoreIcon} alt="addMore" />
              <span className="add-more-text">Add an option</span>
            </div>
          </div>
          <p className="poll-expires-heading">POLL EXPIRES ON*</p>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              className="poll-expiry-field"
              disablePast
              value={pollExpirationDate ? dayjs(pollExpirationDate) : null}
              onChange={(day) => {
                if (day) {
                  updatePollExpirationDate(day?.toDate()?.getTime());
                }
              }}
            />
          </LocalizationProvider>
          <Collapse in={isAdvancedOpen}>
            <div className="poll-advanced-options-container">
              {/* Option for Allowing voters to add options */}
              <div className="poll-advanced-switch-option">
                <span className="poll-advanced-option-text">
                  Allow voters to add options{" "}
                </span>
                <Switch
                  name={"ALLOW_VOTERS_TO_ADD_OPTIONS"}
                  checked={advancedOptions.ALLOW_VOTERS_TO_ADD_OPTIONS}
                  onChange={updateAdvancedOptions}
                />
              </div>
              {/* Option for Allowing Anonymous Poll */}
              <div className="poll-advanced-switch-option">
                <span className="poll-advanced-option-text">
                  Anonymous poll{" "}
                </span>
                <Switch
                  name={"ALLOW_ANONYMOUS_VOTING"}
                  checked={advancedOptions.ALLOW_ANONYMOUS_VOTING}
                  onChange={updateAdvancedOptions}
                />
              </div>
              {/* Option for not showing live reults */}
              <div className="poll-advanced-switch-option">
                <span className="poll-advanced-option-text">
                  Don't show live results{" "}
                </span>
                <Switch
                  name={"SHOW_LIVE_RESULTS"}
                  checked={advancedOptions.SHOW_LIVE_RESULTS}
                  onChange={updateAdvancedOptions}
                />
              </div>
              <div className="poll-advanced-select-option">
                <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel id="poll-advanced-option-select-multiple-select-state">
                    User can vote for
                  </InputLabel>
                  <Select
                    labelId="poll-advanced-option-select-multiple-select-state"
                    id="poll-advanced-option-select-multiple-select-state"
                    value={advancedOptions.MULTIPLE_SELECTION_STATE}
                    onChange={updateAdvancedOptions}
                    name="MULTIPLE_SELECTION_STATE"
                  >
                    <MenuItem value={0}>Exactly</MenuItem>
                    <MenuItem value={1}>At max</MenuItem>
                    <MenuItem value={2}>At Least</MenuItem>
                  </Select>
                </FormControl>
                {"="}
                <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                  <Select
                    id="poll-advanced-option-select-multiple-select-no"
                    value={advancedOptions.MULTIPLE_SELECTION_NO}
                    onChange={updateAdvancedOptions}
                    defaultValue={1}
                    name="MULTIPLE_SELECTION_NO"
                  >
                    {pollOptions.map((option, index) => {
                      return (
                        <MenuItem key={index + option.text} value={index + 1}>
                          {`${index + 1} option`}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </div>
            </div>
          </Collapse>
          <p
            className="poll-advanced-option-toggle"
            onClick={toggleAdvancedOptions}
          >
            ADVANCED{" "}
          </p>
        </div>
      </div>
      <IconButton
        className="poll-create-button"
        onClick={createPollConversation}
      >
        <img src={createPollTick} alt="Create Poll" />
      </IconButton>
    </div>
  );
};

export default LMPollCreationDialog;
