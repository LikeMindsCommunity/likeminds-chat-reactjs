import LMChatClient from "@likeminds.community/chat-js";

export function initiateLMClient(excludedConversationStates?: number[]) {
  const VERSION_CODE = 41;
  const PLATFORM_CODE = "rt";
  const EXCLUDED_CONVERSATION_STATES = excludedConversationStates;
  const lmChatClient = LMChatClient.setPlatformCode(PLATFORM_CODE)
    .setVersionCode(VERSION_CODE)
    .setExcludedConversationStates(EXCLUDED_CONVERSATION_STATES)
    .build();
  return lmChatClient;
}
