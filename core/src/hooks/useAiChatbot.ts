import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { LMGlobalClientProviderContext } from "../main_index";
import { GetAIChatbotsResponse } from "../types/api-responses/getAIChatbotsResponse";

export function useAiChatbot() {
  const { lmChatclient } = useContext(LMGlobalClientProviderContext);
  const [isAiBotOpen, setIsAiBotOpen] = useState<boolean>(false);
  const [showAnimation, setShowAnimation] = useState<boolean>(false);
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
            // Set ChatroomId
            setShowAnimation(false);
          } else {
            const createDMChatroomCall =
              await lmChatclient!.createDMChatroomWithUuid({
                uuid: chatbotUUID!,
              });
            if (createDMChatroomCall.success) {
              const chatroomId = createDMChatroomCall.data.chatroomId;
              setAIBotChatroomInLocalPref(chatroomId);
              // Set ChatroomId
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
  return { isAiBotOpen, openAiBot, closeAiBot, showAnimation };
}

export interface UseAiChatbot {
  isDialogOpen: boolean;
  openAiBot: () => void;
  closeAiBot: () => void;
  showAnimation: boolean;
}
