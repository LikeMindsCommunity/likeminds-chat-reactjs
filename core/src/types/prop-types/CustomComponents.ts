export interface CustomComponents {
  message?: CustomComponentType;
  messageBubbles?: {
    microPoll?: CustomComponentType;
    normalChatBubble?: CustomComponentType;
    deletedChatBubble?: CustomComponentType;
    chatroomHeaderBubble?: CustomComponentType;
    chatroomFollowedBubble?: CustomComponentType;
  };
  header?: CustomComponentType;
  searchConversation?: CustomComponentType;
  input?: {
    chatTextArea?: CustomComponentType;
    emoji?: CustomComponentType;
    attachmentsSelector?: CustomComponentType;
    messageReplyCollapse?: CustomComponentType;
    giphySearch?: CustomComponentType;
    mediaCarousel?: CustomComponentType;
  };
  participantList?: CustomComponentType;
}

export type CustomComponentType = React.FC;
