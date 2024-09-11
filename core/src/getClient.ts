import LMChatClient from "@likeminds.community/chat-js-beta";

export function initiateLMClient() {
  const VERSION_CODE = 40;
  const PLATFORM_CODE = "rt";
  const lmChatClient = LMChatClient.setPlatformCode(PLATFORM_CODE)
    .setVersionCode(VERSION_CODE)
    .setExcludedConversationStates([0, 1, 2, 7, 10, 12])
    .build();
  return lmChatClient;
}

// ConversationState Enum
// export enum ConversationState {
//     NORMAL = 0, // Normal Message
//     FIRST_CONVERSATION = 1, // Chatroom First Message
//     MEMBER_JOINED_OPEN_CHATROOM = 2, // Member joins Open Chatroom
//     MEMBER_LEFT_OPEN_CHATROOM = 3, // Member leaves Open Chatroom
//     MEMBER_ADDED_TO_CHATROOM = 7, // Member Added in Chatroom
//     MEMBER_LEFT_SECRET_CHATROOM = 8, // Member leaves Secret Chatroom
//     MEMBER_REMOVED_FROM_CHATROOM = 9, // Member is removed from a Chatroom
//     POLL = 10, // Poll Message
//     ALL_MEMBERS_ADDED = 11, // All members are added in a chatroom
//     TOPIC_CHANGED = 12, // Chatroom Topic Changed
// }
