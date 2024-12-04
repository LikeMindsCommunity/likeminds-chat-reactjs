import { useCallback, useContext, useEffect, useRef, useState } from "react";

import { GetAIChatbotsResponse } from "../types/api-responses/getAIChatbotsResponse";
import LMGlobalClientProviderContext from "../context/LMGlobalClientProviderContext";

export function useAIChatbot() {
  const { lmChatClient } = useContext(LMGlobalClientProviderContext);

  const [showAnimation, setShowAnimation] = useState<boolean>(true);
  const [aiChatbotChatroomId, setAIChatbotChatroomId] = useState<
    number | undefined
  >(undefined);
  const aiChatbotPageCount = useRef<number>(1);

  /**
   * Stores the chatroom ID of the AI chatbot in the browser's localStorage.
   *
   * @param {string} chatroomId - The unique identifier of the chatroom to be stored.
   * @returns {void} This function does not return any value.
   */
  const setAIBotChatroomInLocalPref = (chatroomId: string) => {
    localStorage.setItem("chatroomIdWithAIChatbot", chatroomId);
  };

  /**
   * Retrieves the chatroom ID of the AI chatbot stored in localStorage.
   *
   * @returns {string | null} The chatroom ID stored in localStorage, or null if not found.
   */
  const getAIBotChatroomFromLocalPref = (): string | null => {
    return localStorage.getItem("chatroomIdWithAIChatbot");
  };

  const getChatbots = useCallback(async () => {
    try {
      const getChatbotsCall: GetAIChatbotsResponse =
        await lmChatClient.getAIChatbots({
          page: aiChatbotPageCount.current,
          pageSize: 10,
        });
      if (getChatbotsCall.success) {
        const chatbot = getChatbotsCall?.data.users[0];
        const chatbotUUID = chatbot.sdkClientInfo?.uuid;
        const checkDMStatusCall = await lmChatClient!.checkDMStatus({
          uuid: chatbotUUID,
          requestFrom: "member_profile",
        });
        if (checkDMStatusCall.success) {
          const cta = checkDMStatusCall?.data.cta;
          const ctaURL = new URL(cta);
          const hasChatroomId = ctaURL.searchParams.has("chatroom_id");
          const chatroomId = ctaURL.searchParams.get("chatroom_id");
          if (hasChatroomId && chatroomId) {
            setAIBotChatroomInLocalPref(chatroomId!);
            setAIChatbotChatroomId(parseInt(chatroomId));
            setShowAnimation(false);
          } else {
            const createDMChatroomCall =
              await lmChatClient!.createDMChatroomWithUuid({
                uuid: chatbotUUID!,
              });
            if (createDMChatroomCall.success) {
              const chatroomId = createDMChatroomCall?.data.chatroom.id;
              setAIBotChatroomInLocalPref(chatroomId.toString());
              setAIChatbotChatroomId(chatroomId);
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
      setAIChatbotChatroomId(parseInt(chatroomId));
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

export interface UseAIChatbot {
  isDialogOpen: boolean;
  showAnimation: boolean;
  aiChatbotChatroomId: string;
}
