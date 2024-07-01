import { useContext, useState } from "react";
import { OneArgVoidReturns, ZeroArgVoidReturns } from "./useInput";
import GlobalClientProviderContext from "../context/GlobalClientProviderContext";
import LMMessageContext from "../context/MessageContext";
import { PollMultipleSelectState } from "../enums/poll-type";

export function usePoll(): UsePoll {
  const { lmChatclient } = useContext(GlobalClientProviderContext);
  const { message } = useContext(LMMessageContext);

  const [selectedPollOptions, setSelectedPollOptions] = useState<
    SelectedPollOption[]
  >([]);

  //   Regular functions

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
  const selectPollOption = (clickedEvent: React.MouseEvent) => {
    setSelectedPollOptions((currentSelectedOptions) => {
      // function to select or unselect the option
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
      const pollOptionValue = clickedEvent.currentTarget.id;
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
            currentSelectedOptions.length > message?.multiple_select_no
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
      console.log(call);
    } catch (error) {
      console.log(error);
    }
  };
  const addOptionOnPoll: OneArgVoidReturns<string> = async (pollOption) => {
    try {
      const call = await lmChatclient?.addPollOption({
        conversationId: message?.id,
        poll: {
          text: pollOption,
        },
      });
      console.log(call);
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
      console.log(call);
    } catch (error) {
      console.log(error);
    }
  };
  return {
    submitPoll,
    addOptionOnPoll,
    getPollUsers,
    selectPollOption,
  };
}
interface UsePoll {
  submitPoll: ZeroArgVoidReturns;
  addOptionOnPoll: OneArgVoidReturns<string>;
  getPollUsers: OneArgVoidReturns<number>;
  selectPollOption: OneArgVoidReturns<React.MouseEvent>;
}
interface SelectedPollOption {
  id: string;
}
