import { useContext, useState } from "react";
import {
  OneArgVoidReturns,
  ZeroArgBooleanReturns,
  ZeroArgVoidReturns,
} from "./useInput";
import GlobalClientProviderContext from "../context/LMGlobalClientProviderContext";
import LMMessageContext from "../context/LMMessageContext";
import { PollMultipleSelectState, PollType } from "../enums/lm-poll-type";
import { CustomisationContextProvider } from "../context/LMChatCustomisationContext";
import Member from "../types/models/member";

export function usePoll(): UsePoll {
  const { lmChatClient } = useContext(GlobalClientProviderContext);
  const { message, addPollOptionLocally, updatePollOnSubmitLocally } =
    useContext(LMMessageContext);
  const { pollCustomActions = {} } = useContext(CustomisationContextProvider);
  const {
    selectPollOptionCustomCallback,
    addOptionOnPollCustomCallback,
    getPollUsersCustomCallback,
    submitPollCustomCallback,
  } = pollCustomActions;
  const [temporaryAddOptionText, setTemporaryAddOptionText] =
    useState<string>("");
  const [selectedPollOptions, setSelectedPollOptions] = useState<
    SelectedPollOption[]
  >([]);
  const [pollUsers, setPollUsers] = useState<Member[]>([]);
  //   Regular functions
  const calculateSubmitButtonVisibility = () => {
    if (Date.now() > message.expiryTime!) {
      return false;
    }
    const pollType = message?.pollType?.toString();
    switch (pollType) {
      case PollType.INSTANT_POLL: {
        if (message?.polls?.some((poll) => poll.isSelected)) {
          return false;
        }
        switch (message.multipleSelectState) {
          case PollMultipleSelectState.AT_LEAST: {
            if (selectedPollOptions.length < message.multipleSelectNo!) {
              return false;
            }
            return true;
          }
          case PollMultipleSelectState.AT_MAX: {
            if (selectedPollOptions.length > message.multipleSelectNo!) {
              return false;
            }
            return true;
          }
          case PollMultipleSelectState.EXACTLY:
          case null:
          case undefined: {
            if (selectedPollOptions.length !== message.multipleSelectNo) {
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
    if (!message.allowAddOption) {
      return false;
    }
    const pollType = message?.pollType?.toString();
    switch (pollType) {
      case PollType.INSTANT_POLL: {
        if (Date.now() > message.expiryTime!) {
          return false;
        }
        if (message.polls?.some((poll) => poll.isSelected)) {
          return false;
        }
        return true;
      }
      case PollType.DEFERRED_POLL: {
        if (Date.now() > message.expiryTime!) {
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
    if (Date.now() > message.expiryTime!) {
      showLoader("Poll has expired");
      return;
    }
    if (
      message.polls?.some((poll) => poll.isSelected) &&
      message.pollType?.toString() === PollType.INSTANT_POLL
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
      switch (message?.multipleSelectState) {
        case PollMultipleSelectState.AT_MAX: {
          if (
            !isOptionAlreadySelected &&
            currentSelectedOptions.length >= message.multipleSelectNo!
          ) {
            showLoader(
              `You can't select more than ${message.multipleSelectNo} options`,
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
            currentSelectedOptions.length == message?.multipleSelectNo
          ) {
            showLoader(
              `You can't select more than ${message.multipleSelectNo} options`,
            );
            return currentSelectedOptions;
          }
          return addOrRemoveOption(isOptionAlreadySelected, pollOptionValue);
        }
      }
    });
  };

  const submitPoll = async () => {
    try {
      await lmChatClient.submitPoll({
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
      const call = await lmChatClient.addPollOption({
        conversationId: message?.id,
        poll: {
          text: temporaryAddOptionText,
        },
      });
      if (call?.success) {
        addPollOptionLocally(call?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getPollUsers = async (pollId: number) => {
    try {
      const call = await lmChatClient!.getPollUsers({
        conversationId: message?.id,
        pollId: pollId,
      });
      setPollUsers(() => {
        return call?.data.members;
      });
    } catch (error) {
      console.log(error);
    }
  };
  const pollDataStore: PollDataStore = {
    temporaryAddOptionText,
    selectedPollOptions,
    pollUsers,
  };
  const pollDefaultActions: PollDefaultActions = {
    submitPoll,
    addOptionOnPoll,
    getPollUsers,
    selectPollOption,
    setTemporaryAddOptionText,
    calculateAddPollOptionButtonVisibility,
    calculateSubmitButtonVisibility,
  };
  return {
    submitPoll: submitPollCustomCallback
      ? submitPollCustomCallback.bind(null, pollDefaultActions, pollDataStore)
      : submitPoll,
    addOptionOnPoll: addOptionOnPollCustomCallback
      ? addOptionOnPollCustomCallback.bind(
          null,
          pollDefaultActions,
          pollDataStore,
        )
      : addOptionOnPoll,
    getPollUsers: getPollUsersCustomCallback
      ? getPollUsersCustomCallback.bind(null, pollDefaultActions, pollDataStore)
      : getPollUsers,
    selectPollOption: selectPollOptionCustomCallback
      ? selectPollOptionCustomCallback.bind(
          null,
          pollDefaultActions,
          pollDataStore,
        )
      : selectPollOption,
    temporaryAddOptionText,
    setTemporaryAddOptionText,
    selectedPollOptions,
    calculateAddPollOptionButtonVisibility,
    calculateSubmitButtonVisibility,
    pollUsers,
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
  pollUsers: Member[];
}
export interface SelectedPollOption {
  id: string;
}

export interface PollDefaultActions {
  submitPoll: ZeroArgVoidReturns;
  addOptionOnPoll: ZeroArgVoidReturns;
  getPollUsers: OneArgVoidReturns<number>;
  selectPollOption: OneArgVoidReturns<React.MouseEvent<HTMLDivElement>>;
  setTemporaryAddOptionText: React.Dispatch<React.SetStateAction<string>>;
  calculateAddPollOptionButtonVisibility: ZeroArgBooleanReturns;
  calculateSubmitButtonVisibility: ZeroArgBooleanReturns;
}

export interface PollDataStore {
  temporaryAddOptionText: string;
  pollUsers: Member[];
  selectedPollOptions: SelectedPollOption[];
}
