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
}

export type CustomComponentType = React.FC;
