/* eslint-disable @typescript-eslint/no-explicit-any */
import { Location, NavigateFunction } from "react-router-dom";
import { ApplicationGeneralDataContext } from "../../context/LMUserProviderContext";
import { InputDataStore, InputDefaultActions } from "../../hooks/useInput";
import { MessageDefaultActions } from "../../hooks/useMessageOptions";
import { ChatroomMenuDefaultActions } from "../../hooks/useChatroomMenuOptions";

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
  onMemberTabClickFunction?: InputActionsCallback;
}

export interface MessageCustomActions {
  onReportCustom?: MessageActionsCallback;
  onDeleteCustom?: MessageActionsCallback;
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

export type CustomComponentType = React.FC;
// for input actions callback
export type InputActionsCallback = (
  inputDefaultActions: InputDefaultActions,
  applicationGeneralDataContext: ApplicationGeneralDataContext,
  inputDataStore: InputDataStore,
  router: Router,
  ...args: any[]
) => any;

// end for input action callback
// for message options
export type MessageActionsCallback = (
  messageDefaultActions: MessageDefaultActions,
  applicationGeneralDataContext: ApplicationGeneralDataContext,
  router: Router,
  ...args: any[]
) => any;
// end for message options

// for chatroomHeader

export type ChatroomHeaderActionsCallback = (
  chatroomMenuDefaultActions: ChatroomMenuDefaultActions,
  applicationGeneralDataContext: ApplicationGeneralDataContext,
  router: Router,
  ...args: any[]
) => any;

// end for chatroomHeader

export interface Router {
  location: Location;
  navigate: NavigateFunction;
}
