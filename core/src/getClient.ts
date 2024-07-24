import LMChatClient from "@likeminds.community/chat-js-beta";

export function initiateLMClient() {
  const VERSION_CODE = 40;
  const PLATFORM_CODE = "rt";
  const lmChatClient = LMChatClient.setPlatformCode(PLATFORM_CODE)
    .setVersionCode(VERSION_CODE)
    .build();
  return lmChatClient;
}
