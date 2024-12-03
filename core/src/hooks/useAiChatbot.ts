import { useCallback, useContext, useEffect, useRef, useState } from "react";

import { GetAIChatbotsResponse } from "../types/api-responses/getAIChatbotsResponse";
import LMGlobalClientProviderContext from "../context/LMGlobalClientProviderContext";

export function useAIChatbot() {
  const { lmChatClient } = useContext(LMGlobalClientProviderContext);

  const [showAnimation, setShowAnimation] = useState<boolean>(true);
  const [aiChatbotChatroomId, setAIChatbotChatroomId] = useState<string>("");
  const aiChatbotPageCount = useRef<number>(1);

  const setAIBotChatroomInLocalPref = (chatroomId: string) => {
    localStorage.setItem("chatroomIdWithAIChatbot", chatroomId);
  };

  const getAIBotChatroomFromLocalPref = (): string | null => {
    return localStorage.getItem("chatroomIdWithAIChatbot");
  };

  const getChatbots = useCallback(async () => {
    try {
      const getChatbotsCall: GetAIChatbotsResponse =
        await lmChatClient?.getAIChatbots({
          page: aiChatbotPageCount.current,
          pageSize: 10,
        });
      if (getChatbotsCall.success) {
        const chatbot = getChatbotsCall.data.users[0];
        const chatbotUUID = chatbot.sdkClientInfo?.uuid;
        const checkDMStatusCall = await lmChatClient!.checkDMStatus({
          uuid: chatbotUUID,
          requestFrom: "member_profile",
        });
        console.log("ending time");
        console.timeEnd("ai-chatbot");
        if (checkDMStatusCall.success) {
          const cta = checkDMStatusCall.data.cta;
          const ctaURL = new URL(cta);
          const hasChatroomId = ctaURL.searchParams.has("chatroom_id");
          if (hasChatroomId) {
            const chatroomId = ctaURL.searchParams.get("chatroom_id");
            setAIBotChatroomInLocalPref(chatroomId!);
            setAIChatbotChatroomId(chatroomId!);
            setShowAnimation(false);
          } else {
            const createDMChatroomCall =
              await lmChatClient!.createDMChatroomWithUuid({
                uuid: chatbotUUID!,
              });
            if (createDMChatroomCall.success) {
              const chatroomId = createDMChatroomCall.data.chatroom.id;
              console.timeEnd("ai-chatbot-with-new-user");
              console.log(chatroomId);
              setAIBotChatroomInLocalPref(chatroomId);
              setAIChatbotChatroomId(chatroomId!);
              setShowAnimation(false);
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [lmChatClient]);

  useEffect(() => {
    const chatroomId = getAIBotChatroomFromLocalPref();
    if (chatroomId) {
      setAIChatbotChatroomId(chatroomId);
      setShowAnimation(false);
    } else {
      getChatbots();
    }
  }, [getChatbots]);

  useEffect(() => {
    return () => {
      setShowAnimation(true);
    };
  }, []);

  return {
    showAnimation,
    aiChatbotChatroomId,
  };
}

export interface UseAiChatbot {
  isDialogOpen: boolean;

  showAnimation: boolean;
  aiChatbotChatroomId: string;
}
