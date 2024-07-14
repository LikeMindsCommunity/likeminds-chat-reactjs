import { Location, NavigateFunction } from "react-router-dom";
import { ApplicationGeneralDataContext } from "../../context/LMUserProviderContext";
import { InputDataStore, InputDefaultActions } from "../../hooks/useInput";

export interface CustomComponents {
  message?: CustomComponentType; //added
  messageBubbles?: {
    //added
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
  header?: CustomComponentType;
  searchConversation?: CustomComponentType;
  input?: {
    chatroomInputTextArea?: CustomComponentType;
    chatroomInputEmojiSelector?: CustomComponentType;
    chatroomInputAttachmentsSelector?: CustomComponentType;
    chatroomInputMessageReplyCollapse?: CustomComponentType;
    chatroomInputMessageEditCollapse?: CustomComponentType;
    chatroomInputMessageGiphy?: CustomComponentType;
    chatroomInputAttachmentsMediaCarousel?: CustomComponentType;
    chatroomInputPollCreation?: CustomComponentType;
  };
  participantList?: CustomComponentType;
  groupChatChannelList?: CustomComponentType;
  dmChannelList?: CustomComponentType;
  groupChatChannelListjoinedChatroomTile?: CustomComponentType;
  groupChatChannelListExploreChatroomTile?: CustomComponentType;
  dmChannelListChatroomTile?: CustomComponentType;
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
}

export type CustomComponentType = React.FC;

export type InputActionsCallback = (
  inputDefaultActions: InputDefaultActions,
  applicationGeneralDataContext: ApplicationGeneralDataContext,
  inputDataStore: InputDataStore,
  router: Router,
) => void;

export interface Router {
  location: Location;
  navigate: NavigateFunction;
}
