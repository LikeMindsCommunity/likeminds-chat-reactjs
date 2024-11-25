import { useCallback, useContext, useEffect, useRef, useState } from "react";

import { GetAIChatbotsResponse } from "../types/api-responses/getAIChatbotsResponse";
import LMGlobalClientProviderContext from "../context/LMGlobalClientProviderContext";

export function useAiChatbot() {
  const { lmChatclient } = useContext(LMGlobalClientProviderContext);
  const [isAiBotOpen, setIsAiBotOpen] = useState<boolean>(false);
  const [showAnimation, setShowAnimation] = useState<boolean>(false);
  const [aiChatbotChatroomId, setAiChatbotChatroomId] = useState<string>("");
  const aiChatbotPageCount = useRef<number>(1);

  const openAiBot = () => {
    setShowAnimation(true);
    setIsAiBotOpen(true);
  };

  const closeAiBot = () => {
    setIsAiBotOpen(false);
  };
  const setAIBotChatroomInLocalPref = (chatroomId: string) => {
    localStorage.setItem("chatroomIdWithAIChatbot", chatroomId);
  };
  const getChatbots = useCallback(async () => {
    try {
      const getChatbotsCall: GetAIChatbotsResponse =
        await lmChatclient?.getAIChatbots({
          page: aiChatbotPageCount.current,
          pageSize: 10,
        });
      if (getChatbotsCall.success) {
        const chatbot = getChatbotsCall.data.users[0];
        const chatbotUUID = chatbot.sdkClientInfo?.uuid;
        const checkDMStatusCall = await lmChatclient!.checkDMStatus({
          uuid: chatbotUUID,
          requestFrom: "member_profile",
        });
        if (checkDMStatusCall.success) {
          const cta = checkDMStatusCall.data.cta;
          const ctaURL = new URL(cta);
          const hasChatroomId = ctaURL.searchParams.has("chatroom_id");
          if (hasChatroomId) {
            const chatroomId = ctaURL.searchParams.get("chatroom_id");
            setAIBotChatroomInLocalPref(chatroomId!);
            setAiChatbotChatroomId(chatroomId!);
            setShowAnimation(false);
          } else {
            const createDMChatroomCall =
              await lmChatclient!.createDMChatroomWithUuid({
                uuid: chatbotUUID!,
              });
            if (createDMChatroomCall.success) {
              const chatroomId = createDMChatroomCall.data.id;
              setAIBotChatroomInLocalPref(chatroomId);
              setAiChatbotChatroomId(chatroomId!);
              setShowAnimation(false);
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [lmChatclient]);
  useEffect(() => {
    if (isAiBotOpen) {
      getChatbots();
    }
  }, [getChatbots, isAiBotOpen]);
  return {
    isAiBotOpen,
    openAiBot,
    closeAiBot,
    showAnimation,
    aiChatbotChatroomId,
  };
}

export interface UseAiChatbot {
  isDialogOpen: boolean;
  openAiBot: () => void;
  closeAiBot: () => void;
  showAnimation: boolean;
  aiChatbotChatroomId: string;
}
