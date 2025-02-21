/* eslint-disable @typescript-eslint/no-explicit-any */

import { ApplicationGeneralDataContext } from "../../context/LMUserProviderContext";
import { InputDataStore, InputDefaultActions } from "../../hooks/useInput";
import { MessageDefaultActions } from "../../hooks/useMessageOptions";
import { ChatroomMenuDefaultActions } from "../../hooks/useChatroomMenuOptions";
import { PollDataStore, PollDefaultActions } from "../../hooks/usePolls";
import {
  ReactionsDataStore,
  ReactionsDefaultActions,
} from "../../hooks/useReactions";
import {
  ParticipantsDataStore,
  ParticipantsDefaultActions,
} from "../../hooks/useParticipants";
import {
  ExploreFeedDataStore,
  ExploreFeedDefaultActions,
} from "../../hooks/useExploreFeed";
import {
  DMChannelListDataStore,
  DMChannelListDefaultActions,
} from "../../hooks/useDMChannelLists";
import {
  CreatePollDataStore,
  CreatePollDefaultActions,
} from "../../hooks/useCreatePoll";
import {
  ConversationSearchDataStore,
  ConversationSearchDefaultActions,
} from "../../hooks/useConversationSearch";
import {
  ChannelListDataStore,
  ChannelListDefaultActions,
} from "../../hooks/useChatroomsList";
import {
  ChatroomDataStore,
  ChatroomDefaultActions,
} from "../../hooks/useChatroom";
import {
  ChatroomSearchDataStore,
  ChatroomSearchDefaultActions,
} from "../../hooks/useChatroomSearch";
import { UserProviderDataStore, UserProviderDefaultActions }
  from "../../hooks/useUserProvider"

import { Attachment } from "../models/Attachment";

export interface CustomComponents {
  message?: CustomComponentType; //added
  messageBubbles?: {
    //added
    customWidget?: CustomComponentType;
    chatroomMessageOptionsEmojisSelector?: CustomComponentType;
    chatroolMicroPoll?: CustomComponentType;
    chatroomNormalChatBubble?: CustomComponentType;
    chatroomDeletedChatBubble?: CustomComponentType;
    chatroomHeaderBubble?: CustomComponentType;
    chatroomFollowedBubble?: CustomComponentType;
    chatroomUnFollowedBubble?: CustomComponentType;
    chatroomMembersAddedBubble?: CustomComponentType;
    chatroomDirectMessageRequestRejectedBubble?: CustomComponentType;
    chatroomDirectMessageRequestAcceptedBubble?: CustomComponentType;
    voiceNote?: CustomComponentType<{ attachment: Attachment }>;
  };
  messageList?: CustomComponentType;
  chatroomHeader?: CustomComponentType;
  searchConversation?: CustomComponentType;
  input?: {
    chatroomInputTextArea?: CustomComponentType;
    chatroomInputEmojiSelector?: CustomComponentType;
    chatroomInputAttachmentsSelector?: CustomComponentType;
    chatroomInputMessageGiphy?: CustomComponentType;
    chatroomInputMessageReplyCollapse?: CustomComponentType;
    chatroomInputMessageEditCollapse?: CustomComponentType;
    chatroomInputAttachmentsMediaCarousel?: CustomComponentType;
    chatroomInputPollCreation?: CustomComponentType;
  };
  participantList?: CustomComponentType;
  groupChatChannelList?: CustomComponentType;
  dmChannelList?: CustomComponentType;
  noChatroomSelected?: CustomComponentType;
  userNotLoadedLoaderScreen?: CustomComponentType;
  aiChatbotLoaderScreen?: CustomComponentType;
  userNotLoadedErrorScreen?: CustomComponentType;
}

export interface InputCustomActions {
  onUpdateInputText?: InputActionsCallback;
  onOnTextInputKeydownHandler?: InputActionsCallback;
  onOnTextInputKeyUpHandler?: InputActionsCallback;
  onClearTaggingList?: InputActionsCallback;
  onAddEmojiToText?: InputActionsCallback;
  onAddImagesAndVideosMedia?: InputActionsCallback;
  onAddDocumentsMedia?: InputActionsCallback;
  onPostMessage?: InputActionsCallback;
  onGetTaggingMembers?: InputActionsCallback;
  onRemoveOgTag?: InputActionsCallback;
  onSetGifMedia?: InputActionsCallback;
  onSetOpenGifCollapse?: InputActionsCallback;
  onGifSearchQuery?: InputActionsCallback;
  onFetchGifs?: InputActionsCallback;
  onHandleGifSearch?: InputActionsCallback;
  onRemoveMediaFromImageList?: InputActionsCallback;
  onRemoveMediaFromDocumentList?: InputActionsCallback;
  onSendDMRequest?: InputActionsCallback;
  onRejectDMRequest?: InputActionsCallback;
  onAprooveDMRequest?: InputActionsCallback;
  onShouldShowInputBox?: InputActionsCallback;
}

export interface MessageCustomActions {
  onReportCustom?: MessageActionsCallback;
  onDeleteCustom?: MessageActionsCallback;
  onSetTopicCustom?: MessageActionsCallback;
  onEditCustom?: MessageActionsCallback;
  onReplyCustom?: MessageActionsCallback;
  putReactionCustom?: MessageActionsCallback;
  onReplyPrivatelyCustom?: MessageActionsCallback;
}

export interface ChatroomMenuCustomActions {
  onMuteCustom?: ChatroomHeaderActionsCallback;
  onViewParticipantsCustom?: ChatroomHeaderActionsCallback;
  onLeaveChatroomCustom?: ChatroomHeaderActionsCallback;
  onBlockCustom?: ChatroomHeaderActionsCallback;
  onUnBlockCustom?: ChatroomHeaderActionsCallback;
}

// ================== Poll Custom Actions ==================
export interface PollCustomActions {
  submitPollCustomCallback?: PollCustomCallback;
  addOptionOnPollCustomCallback?: PollCustomCallback;
  getPollUsersCustomCallback?: PollCustomCallback;
  selectPollOptionCustomCallback?: PollCustomCallback;
}

export type PollCustomCallback = (
  pollDefaultActions: PollDefaultActions,
  pollDataStore: PollDataStore,
) => any;
// ================== Poll Custom Actions ==================

// ================== Reactions Custom Actions ==================
export interface ReactionsCustomActions {
  addReactionCustomCallback?: ReactionCustomCallback;
  removeReactionCustomCallback?: ReactionCustomCallback;
}

export type ReactionCustomCallback = (
  reactionsDefaultAction: ReactionsDefaultActions,
  reactionsDataStore: ReactionsDataStore,
) => any;

// ================== Reactions Custom Actions ==================

// ================== Participants Custom Actions ==================

export interface ParticipantsCustomActions {
  getMembersCustomCallback?: ParticipantsCustomCallback;
  navigateBackToChatroomCustomCallback?: ParticipantsCustomCallback;
  setSearchKeywordCustomCallback?: ParticipantsCustomCallback;
}

export type ParticipantsCustomCallback = (
  participantsDefaultActions: ParticipantsDefaultActions,
  participantsDataStore: ParticipantsDataStore,
) => any;

// ================== Participants Custom Actions ==================

// ================== ExploreFeed Custom Actions ==================

export interface ExploreFeedCustomActions {
  getMembersCustomCallback?: ExploreFeedCustomCallback;
}

export type ExploreFeedCustomCallback = (
  exploreFeedDefaultActions: ExploreFeedDefaultActions,
  exploreFeedDataStore: ExploreFeedDataStore,
) => any;

// ================== ExploreFeed Custom Actions ==================

// ================== DMChannelList Custom Actions ==================
export interface DMChannelListCustomActions {
  getDMChatroomsListCustomCallback?: DMChannelListCustomCallback;
  refreshDMChatroomsCustomCallback?: DMChannelListCustomCallback;
  markReadADMChatroomCustomCallback?: DMChannelListCustomCallback;
  selectNewChatroomCustomCallback?: DMChannelListCustomCallback;
}

export type DMChannelListCustomCallback = (
  dmChannelListDefaultActions: DMChannelListDefaultActions,
  dmChannelListDataStore: DMChannelListDataStore,
) => any;

// ================== DMChannelList Custom Actions ==================

// ================== CreatePoll Custom Actions ==================
export interface CreatePollCustomActions {
  addPollOptionCustomCallback?: CreatePollCustomCallback;
  updatePollOptionCustomCallback?: CreatePollCustomCallback;
  removePollOptionCustomCallback?: CreatePollCustomCallback;
  createPollConversationCustomCallback?: CreatePollCustomCallback;
  changePollTextCustomCallback?: CreatePollCustomCallback;
  updatePollExpirationDateCustomCallback?: CreatePollCustomCallback;
  updateAdvancedOptionsCustomCallback?: CreatePollCustomCallback;
}

export type CreatePollCustomCallback = (
  pollDefaultActions: CreatePollDefaultActions,
  pollDataStore: CreatePollDataStore,
) => any;

// ================== CreatePoll Custom Actions ==================

// ================== ConversationSearch Custom Actions ==================
export interface ConversationSearchCustomActions {
  searchConversationsCustomCallback?: ConversationSearchCustomCallback;
  resetSearchCustomCallback?: ConversationSearchCustomCallback;
  setSearchKeyCustomCallback?: ConversationSearchCustomCallback;
  onSearchedConversationClickCustomCallback?: ConversationSearchCustomCallback;
}

export type ConversationSearchCustomCallback = (
  searchConversationsDefaultActions: ConversationSearchDefaultActions,
  searchConversationsDataStore: ConversationSearchDataStore,
) => any;

// ================== ConversationSearch Custom Actions ==================

// ================== ChannelList Custom Actions ==================

export interface ChannelListCustomActions {
  getChatroomsMineCustomCallback?: ChannelListCustomCallback;
  getExploreGroupChatroomsCustomCallback?: ChannelListCustomCallback;
  joinAChatroomCustomCallback?: ChannelListCustomCallback;
  onLeaveChatroomCustomCallback?: ChannelListCustomCallback;
  markReadAChatroomCustomCallback?: ChannelListCustomCallback;
  checkForDmTabCustomCallback?: ChannelListCustomCallback;
  approveDMRequestCustomCallback?: ChannelListCustomCallback;
  rejectDMRequestCustomCallback?: ChannelListCustomCallback;
  selectNewChatroomCustomCallback?: ChannelListCustomCallback;
}

export type ChannelListCustomCallback = (
  channelListDefaultActions: ChannelListDefaultActions,
  channelListDataStore: ChannelListDataStore,
) => any;

// ================== ChannelList Custom Actions ==================

// ================== Chatroom Custom Actions ==================
export interface ChatroomCustomActions {
  setChatroomCustomCallback?: ChatroomCustomCallback;
  setConversationToReplyCustomCallback?: ChatroomCustomCallback;
  setConversationToEditCustomCallback?: ChatroomCustomCallback;
  setSearchedConversationIdCustomCallback?: ChatroomCustomCallback;
}

export type ChatroomCustomCallback = (
  chatroomDefaultActions: ChatroomDefaultActions,
  chatroomDataStore: ChatroomDataStore,
) => any;

// ================== Chatroom Custom Actions ==================

// ================== ChatroomSearch Custom Actions ==================
export interface ChatroomSearchCustomActions {
  searchChatroomsCustomCallback?: ChatroomSearchCustomCallback;
  onSearchChatroomClickCustomCallback?: ChatroomSearchCustomCallback;
  setSearchKeyCustomCallback?: ChatroomSearchCustomCallback;
  resetSearchCustomCallback?: ChatroomSearchCustomCallback;
}

export interface UserProviderCustomActions {
  logOutCustomCallback?: UserProviderActionsCallback
}

export type ChatroomSearchCustomCallback = (
  chatroomSearchDefaultActions: ChatroomSearchDefaultActions,
  chatroomSearchDataStore: ChatroomSearchDataStore,
) => any;

// ================== ChatroomSearch Custom Actions ==================

export type CustomComponentType<T = unknown> = React.FC<T>;
// for input actions callback
export type InputActionsCallback = (
  inputDefaultActions: InputDefaultActions,
  applicationGeneralDataContext: ApplicationGeneralDataContext,
  inputDataStore: InputDataStore,
) => any;

// end for input action callback
// for message options
export type MessageActionsCallback = (
  messageDefaultActions: MessageDefaultActions,
  applicationGeneralDataContext: ApplicationGeneralDataContext,
) => any;
// end for message options

// for chatroomHeader

export type ChatroomHeaderActionsCallback = (
  chatroomMenuDefaultActions: ChatroomMenuDefaultActions,
  applicationGeneralDataContext: ApplicationGeneralDataContext,
) => any;

// end for chatroomHeader

export interface Router {
  location: Location;
}


// custom action type for UserProvider custom actions
export type UserProviderActionsCallback = (defaultActions: UserProviderDefaultActions, userProviderDataStore: UserProviderDataStore) => any