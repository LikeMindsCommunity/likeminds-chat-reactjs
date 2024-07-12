import { useContext, useState } from "react";
import {
  OneArgVoidReturns,
  ZeroArgBooleanReturns,
  ZeroArgVoidReturns,
} from "./useInput";
import GlobalClientProviderContext from "../context/LMGlobalClientProviderContext";
import LMMessageContext from "../context/LMMessageContext";
import { PollMultipleSelectState, PollType } from "../enums/lm-poll-type";

export function usePoll(): UsePoll {
  const { lmChatclient } = useContext(GlobalClientProviderContext);
  const { message, addPollOptionLocally, updatePollOnSubmitLocally } =
    useContext(LMMessageContext);
  const [temporaryAddOptionText, setTemporaryAddOptionText] =
    useState<string>("");
  const [selectedPollOptions, setSelectedPollOptions] = useState<
    SelectedPollOption[]
  >([]);

  //   Regular functions
  const calculateSubmitButtonVisibility = () => {
    if (Date.now() > message.expiry_time) {
      return false;
    }
    const pollType = message.poll_type.toString();
    switch (pollType) {
      case PollType.INSTANT_POLL: {
        if (message.polls.some((poll) => poll.is_selected)) {
          return false;
        }
        switch (message.multiple_select_state) {
          case PollMultipleSelectState.AT_LEAST: {
            if (selectedPollOptions.length < message.multiple_select_no) {
              return false;
            }
            return true;
          }
          case PollMultipleSelectState.AT_MAX: {
            if (selectedPollOptions.length > message.multiple_select_no) {
              return false;
            }
            return true;
          }
          case PollMultipleSelectState.EXACTLY:
          case null:
          case undefined: {
            if (selectedPollOptions.length !== message.multiple_select_no) {
              return false;
            }
            return true;
          }
          default: {
            return false;
          }
        }
      }
      case PollType.DEFERRED_POLL: {
        return true;
      }
      default: {
        return true;
      }
    }
  };

  const calculateAddPollOptionButtonVisibility = () => {
    if (!message.allow_add_option) {
      return false;
    }
    const pollType = message.poll_type.toString();
    switch (pollType) {
      case PollType.INSTANT_POLL: {
        if (Date.now() > message.expiry_time) {
          return false;
        }
        if (message.polls.some((poll) => poll.is_selected)) {
          return false;
        }
        return true;
      }
      case PollType.DEFERRED_POLL: {
        if (Date.now() > message.expiry_time) {
          return false;
        }
        return true;
      }
      default: {
        return true;
      }
    }
  };

  /**
   * Displays a loader with the specified message.
   *
   * @param message - The message to be displayed in the loader.
   * @returns The message that was passed as an argument.
   */
  const showLoader = (message: string) => {
    // showLoader
    return message;
  };

  /**
   * Handles the selection or unselection of a poll option.
   * @param clickedEvent - The click event that triggered the selection.
   */
  const selectPollOption = (clickedEvent: React.MouseEvent<HTMLDivElement>) => {
    if (Date.now() > message.expiry_time) {
      showLoader("Poll has expired");
      return;
    }
    if (
      message.polls.some((poll) => poll.is_selected) &&
      message.poll_type.toString() === PollType.INSTANT_POLL
    ) {
      showLoader("Poll has already been submitted");
      return;
    }
    const pollOptionValue = clickedEvent.currentTarget.id;
    setSelectedPollOptions((currentSelectedOptions) => {
      // function to select or unselect the option
      currentSelectedOptions = [...currentSelectedOptions];
      function addOrRemoveOption(
        isOptionAlreadySelected: boolean,
        pollOptionValue: string,
      ) {
        if (isOptionAlreadySelected) {
          return currentSelectedOptions.filter(
            (selectedOption) => selectedOption.id !== pollOptionValue,
          );
        } else {
          currentSelectedOptions.push({
            id: pollOptionValue,
          });
          return currentSelectedOptions;
        }
      }

      const isOptionAlreadySelected = currentSelectedOptions.some(
        (selectedOptions) => selectedOptions.id === pollOptionValue,
      );
      switch (message?.multiple_select_state) {
        case PollMultipleSelectState.AT_MAX: {
          if (
            !isOptionAlreadySelected &&
            currentSelectedOptions.length >= message?.multiple_select_no
          ) {
            showLoader(
              `You can't select more than ${message.multiple_select_no} options`,
            );
            return currentSelectedOptions;
          }
          return addOrRemoveOption(isOptionAlreadySelected, pollOptionValue);
        }
        case PollMultipleSelectState.AT_LEAST: {
          return addOrRemoveOption(isOptionAlreadySelected, pollOptionValue);
        }
        default: {
          if (
            !isOptionAlreadySelected &&
            currentSelectedOptions.length == message?.multiple_select_no
          ) {
            showLoader(
              `You can't select more than ${message.multiple_select_no} options`,
            );
            return currentSelectedOptions;
          }
          return addOrRemoveOption(isOptionAlreadySelected, pollOptionValue);
        }
      }
    });
  };

  //   APIs
  const submitPoll = async () => {
    try {
      const call = await lmChatclient?.submitPoll({
        polls: selectedPollOptions,
        conversationId: message?.id,
      });
      setTemporaryAddOptionText("");
      updatePollOnSubmitLocally(selectedPollOptions.map((option) => option.id));
    } catch (error) {
      console.log(error);
    }
  };
  const addOptionOnPoll: ZeroArgVoidReturns = async () => {
    try {
      const call = await lmChatclient?.addPollOption({
        conversationId: message?.id,
        poll: {
          text: temporaryAddOptionText,
        },
      });
      if (call.success) {
        addPollOptionLocally(call.data.poll);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getPollUsers = async (pollId: number) => {
    try {
      const call = await lmChatclient?.getPollUsers({
        conversationId: message?.id,
        pollId: pollId,
      });
    } catch (error) {
      console.log(error);
    }
  };
  return {
    submitPoll,
    addOptionOnPoll,
    getPollUsers,
    selectPollOption,
    temporaryAddOptionText,
    setTemporaryAddOptionText,
    selectedPollOptions,
    calculateAddPollOptionButtonVisibility,
    calculateSubmitButtonVisibility,
  };
}
interface UsePoll {
  submitPoll: ZeroArgVoidReturns;
  addOptionOnPoll: ZeroArgVoidReturns;
  getPollUsers: OneArgVoidReturns<number>;
  selectPollOption: OneArgVoidReturns<React.MouseEvent<HTMLDivElement>>;
  temporaryAddOptionText: string;
  setTemporaryAddOptionText: React.Dispatch<React.SetStateAction<string>>;
  selectedPollOptions: SelectedPollOption[];
  calculateAddPollOptionButtonVisibility: ZeroArgBooleanReturns;
  calculateSubmitButtonVisibility: ZeroArgBooleanReturns;
}
export interface SelectedPollOption {
  id: string;
}
