enum ConversationStates {
  UNKNOWN = -1,
  NORMAL = 0, // normal conversation
  CHAT_ROOM_HEADER = 1, // conversationHeader
  CHAT_ROOM_FOLLOWED = 2, // conversationFollow
  CHAT_ROOM_UNFOLLOWED = 3, // conversationUnfollow
  CHAT_ROOM_CREATER = 4, // conversationCreator
  CHAT_ROOM_EDITED = 5, // conversationCommunityEdit
  CHAT_ROOM_JOINED = 6, // conversationGuest
  CHAT_ROOM_ADD_PARTICIPANTS = 7, // conversationAddParticipant
  CHAT_ROOM_LEAVE_SEPERATOR = 8, // leaveConversation
  CHAT_ROOM_REMOVE_SEPERATOR = 9, // removedFromConversation
  MICRO_POLL = 10, // pollConversation
  ADD_ALL_MEMBERS = 11, // addAllMembers
  CHAT_ROOM_CURRENT_TOPIC = 12, // set up topic of chatroom
  DIRECT_MESSAGE_MEMBER_REMOVED_OR_LEFT = 13,
  DIRECT_MESSAGE_CM_REMOVED = 14,
  DIRECT_MESSAGE_MEMBER_BECOMES_CM_DISABLE_CHAT = 15,
  DIRECT_MESSAGE_CM_BECOMES_MEMBER_ENABLE_CHAT = 16,
  DIRECT_MESSAGE_MEMBER_BECOMES_CM_ENABLE_CHAT = 17,
  DIRECT_MESSAGE_MEMBER_REQUEST_REJECTED = 19,
  DIRECT_MESSAGE_MEMBER_REQUEST_APPROVED = 20,
  LOCAL_CONVERSATION_STATE = 100,
}

export default ConversationStates;
