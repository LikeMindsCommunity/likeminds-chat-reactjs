import { createContext } from "react";
import {
  ChannelListCustomActions,
  ChatroomCustomActions,
  ChatroomMenuCustomActions,
  ChatroomSearchCustomActions,
  ConversationSearchCustomActions,
  CreatePollCustomActions,
  DMChannelListCustomActions,
  ExploreFeedCustomActions,
  InputCustomActions,
  MessageCustomActions,
  ParticipantsCustomActions,
  PollCustomActions,
  ReactionsCustomActions,
} from "../types/prop-types/CustomComponents";
import { LMInputAttachments } from "../enums/lm-input-attachment-options";

export interface LMCustomisationContextInterface {
  chatroomMenuCustomActions?: ChatroomMenuCustomActions;
  messageMenuCustomActions?: MessageCustomActions;
  inputCustomActions?: InputCustomActions;
  pollCustomActions?: PollCustomActions;
  reactionCustomActions?: ReactionsCustomActions;
  participantsCustomActions?: ParticipantsCustomActions;
  exploreFeedCustomActions?: ExploreFeedCustomActions;
  dmChannelListCustomActions?: DMChannelListCustomActions;
  createPollCustomActions?: CreatePollCustomActions;
  conversationSearchCustomActions?: ConversationSearchCustomActions;
  channelListCustomActions?: ChannelListCustomActions;
  chatroomCustomActions?: ChatroomCustomActions;
  chatroomSearchCustomActions?: ChatroomSearchCustomActions;
  attachmentOptions?: LMInputAttachments[];
}

export const CustomisationContextProvider =
  createContext<LMCustomisationContextInterface>(
    {} as LMCustomisationContextInterface,
  );

export interface LMChatCustomActions extends LMCustomisationContextInterface {}
