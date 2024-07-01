import { useContext, useState } from "react";
import {
  OneArgVoidReturns,
  TwoArgVoidReturns,
  ZeroArgVoidReturns,
} from "./useInput";
import GlobalClientProviderContext from "../context/GlobalClientProviderContext";
import ConversationStates from "../enums/conversation-states";
import { useParams } from "react-router-dom";
import { LMChatChatroomContext } from "../context/LMChatChatroomContext";

export function useCreatePoll(): UseCreatePoll {
  const { id: chatroomId } = useParams();
  const { lmChatclient } = useContext(GlobalClientProviderContext);
  const { conversationToReply } = useContext(LMChatChatroomContext);
  const [pollText, setPollText] = useState<string>("");
  const [advancedPollOptions, setAdvancedPollOptions] =
    useState<AdvancedPollOptions>({
      ALLOW_ANONYMOUS_VOTING: false,
      ALLOW_VOTERS_TO_ADD_OPTIONS: false,
      MULTIPLE_SELECTION_NO: 0,
      MULTIPLE_SELECTION_STATE: 0,
      SHOW_LIVE_RESULTS: false,
    });
  const [pollOptions, setPollOptions] = useState<string[]>(["", ""]);
  const [pollExpirationDate, setPollExpirationDate] = useState<Date>(
    new Date(),
  );

  const addPollOption = () => {
    setPollOptions((currentPollOptions) => {
      currentPollOptions.push("");
      return currentPollOptions;
    });
  };
  const removePollOption = (index: number) => {
    setPollOptions((currentPollOptions) => {
      currentPollOptions.splice(index, 1);
      return currentPollOptions;
    });
  };
  const updatePollOption = (text: string, index: number) => {
    setPollOptions((currentPollOptions) => {
      currentPollOptions[index] = text;
      return currentPollOptions;
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
            text: option,
          };
        }),
        pollType: advancedPollOptions.SHOW_LIVE_RESULTS ? 1 : 0,
        multipleSelectState: advancedPollOptions.MULTIPLE_SELECTION_STATE,
        multipleSelectNo: advancedPollOptions.MULTIPLE_SELECTION_NO,
        isAnonymous: advancedPollOptions.ALLOW_ANONYMOUS_VOTING,
        allowAddOption: advancedPollOptions.ALLOW_VOTERS_TO_ADD_OPTIONS,
        expiryTime: pollExpirationDate.getMilliseconds(),
      });
      console.log(call);
    } catch (error) {
      console.log(error);
    }
  };
  const changePollText = (text: string) => {
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
    setPollExpirationDate,
    pollExpirationDate,
    advancedOptions: advancedPollOptions,
    setAdvancedOptions: setAdvancedPollOptions,
  };
}

interface UseCreatePoll {
  pollOptions: string[];
  addPollOption: ZeroArgVoidReturns;
  updatePollOption: TwoArgVoidReturns<string, number>;
  removePollOption: OneArgVoidReturns<number>;
  createPollConversation: ZeroArgVoidReturns;
  changePollText: OneArgVoidReturns<string>;
  pollText: string;
  setPollExpirationDate: OneArgVoidReturns<Date>;
  pollExpirationDate: Date;
  advancedOptions: AdvancedPollOptions;
  setAdvancedOptions: OneArgVoidReturns<AdvancedPollOptions>;
}

interface AdvancedPollOptions {
  ALLOW_VOTERS_TO_ADD_OPTIONS: boolean;
  ALLOW_ANONYMOUS_VOTING: boolean;
  SHOW_LIVE_RESULTS: boolean;
  MULTIPLE_SELECTION_STATE: number;
  MULTIPLE_SELECTION_NO: number;
}
