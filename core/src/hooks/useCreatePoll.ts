import React, { useContext, useState } from "react";
import {
  OneArgVoidReturns,
  TwoArgVoidReturns,
  ZeroArgVoidReturns,
} from "./useInput";
import GlobalClientProviderContext from "../context/GlobalClientProviderContext";
import ConversationStates from "../enums/conversation-states";
import { useParams } from "react-router-dom";
import { LMChatChatroomContext } from "../context/LMChatChatroomContext";
import { SelectChangeEvent } from "@mui/material";

export function useCreatePoll(closeDialog?: ZeroArgVoidReturns): UseCreatePoll {
  const { id: chatroomId } = useParams();
  const { lmChatclient } = useContext(GlobalClientProviderContext);
  const { conversationToReply } = useContext(LMChatChatroomContext);
  const [pollText, setPollText] = useState<string>("");
  const [advancedPollOptions, setAdvancedPollOptions] =
    useState<AdvancedPollOptions>({
      ALLOW_ANONYMOUS_VOTING: false,
      ALLOW_VOTERS_TO_ADD_OPTIONS: false,
      MULTIPLE_SELECTION_NO: 1,
      MULTIPLE_SELECTION_STATE: 0,
      SHOW_LIVE_RESULTS: false,
    });
  const [pollOptions, setPollOptions] = useState<PollOption[]>([
    {
      text: "",
    },
    {
      text: "",
    },
  ]);
  const [pollExpirationDate, setPollExpirationDate] = useState<number | null>(
    null,
  );
  const updatePollExpirationDate = (
    expiryDateInMilliseconds: number | null,
  ) => {
    setPollExpirationDate(expiryDateInMilliseconds);
  };
  const addPollOption = () => {
    setPollOptions((currentPollOptions) => {
      currentPollOptions = [...currentPollOptions];
      console.log("clicked");
      currentPollOptions.push({
        text: "",
      });
      console.log(currentPollOptions);
      return currentPollOptions;
    });
  };
  const removePollOption = (index: number) => {
    setPollOptions((currentPollOptions) => {
      currentPollOptions = [...currentPollOptions];
      currentPollOptions.splice(index, 1);
      return currentPollOptions;
    });
  };
  const updatePollOption = (text: string, index: number) => {
    setPollOptions((currentPollOptions) => {
      currentPollOptions = [...currentPollOptions];
      currentPollOptions[index].text = text;
      return currentPollOptions;
    });
  };
  const updateAdvancedOptions = (
    clickedEvent:
      | React.ChangeEvent<HTMLInputElement>
      | SelectChangeEvent<number>,
  ) => {
    setAdvancedPollOptions((currentOptions) => {
      const option = clickedEvent.currentTarget
        ? clickedEvent.target.name
        : clickedEvent.target.name;
      switch (option) {
        case "ALLOW_VOTERS_TO_ADD_OPTIONS":
          return {
            ...currentOptions,
            ALLOW_VOTERS_TO_ADD_OPTIONS:
              !currentOptions.ALLOW_VOTERS_TO_ADD_OPTIONS,
          };
        case "ALLOW_ANONYMOUS_VOTING":
          return {
            ...currentOptions,
            ALLOW_ANONYMOUS_VOTING: !currentOptions.ALLOW_ANONYMOUS_VOTING,
          };
        case "SHOW_LIVE_RESULTS":
          return {
            ...currentOptions,
            SHOW_LIVE_RESULTS: !currentOptions.SHOW_LIVE_RESULTS,
          };
        case "MULTIPLE_SELECTION_STATE":
          return {
            ...currentOptions,
            MULTIPLE_SELECTION_STATE: parseInt(
              clickedEvent.target.value.toString(),
            ),
          };
        case "MULTIPLE_SELECTION_NO":
          return {
            ...currentOptions,
            MULTIPLE_SELECTION_NO: parseInt(
              clickedEvent.target.value.toString(),
            ),
          };
        default:
          return currentOptions;
      }
    });
  };
  const createPollConversation = async () => {
    // createPollConversation
    try {
      const call = await lmChatclient?.postPollConversation({
        chatroomId: parseInt(chatroomId!),
        state: ConversationStates.MICRO_POLL,
        text: pollText,
        repliedConversationId: conversationToReply
          ? conversationToReply.id
          : undefined,
        polls: pollOptions.map((option) => {
          return {
            text: option.text,
          };
        }),
        pollType: advancedPollOptions.SHOW_LIVE_RESULTS ? 1 : 0,
        multipleSelectState: advancedPollOptions.MULTIPLE_SELECTION_STATE,
        multipleSelectNo: advancedPollOptions.MULTIPLE_SELECTION_NO,
        isAnonymous: advancedPollOptions.ALLOW_ANONYMOUS_VOTING,
        allowAddOption: advancedPollOptions.ALLOW_VOTERS_TO_ADD_OPTIONS,
        expiryTime: pollExpirationDate,
      });
      if (closeDialog) {
        closeDialog();
      }
      console.log(call);
    } catch (error) {
      console.log(error);
    }
  };
  const changePollText = (
    changeEvent: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const text = changeEvent.target.value;
    setPollText(text);
  };
  return {
    pollOptions,
    addPollOption,
    removePollOption,
    updatePollOption,
    createPollConversation,
    changePollText,
    pollText,
    updatePollExpirationDate,
    pollExpirationDate,
    advancedOptions: advancedPollOptions,
    updateAdvancedOptions,
  };
}

export interface UseCreatePoll {
  pollOptions: PollOption[];
  addPollOption: ZeroArgVoidReturns;
  updatePollOption: TwoArgVoidReturns<string, number>;
  removePollOption: OneArgVoidReturns<number>;
  createPollConversation: ZeroArgVoidReturns;
  changePollText: OneArgVoidReturns<React.ChangeEvent<HTMLTextAreaElement>>;
  pollText: string;
  updatePollExpirationDate: OneArgVoidReturns<number | null>;
  pollExpirationDate: number | null;
  advancedOptions: AdvancedPollOptions;
  updateAdvancedOptions: OneArgVoidReturns<
    React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<number>
  >;
}

export interface AdvancedPollOptions {
  ALLOW_VOTERS_TO_ADD_OPTIONS: boolean;
  ALLOW_ANONYMOUS_VOTING: boolean;
  SHOW_LIVE_RESULTS: boolean;
  MULTIPLE_SELECTION_STATE: number;
  MULTIPLE_SELECTION_NO: number;
}

interface PollOption {
  text: string;
}
