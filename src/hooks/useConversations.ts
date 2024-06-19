/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useContext, useEffect, useState } from "react";
import GlobalClientProviderContext from "../context/GlobalClientProviderContext";
import { onValue, ref } from "firebase/database";
import { CONVERSATIONS_PAGINATE_BY } from "../constants/Constants";
import LoaderContextProvider from "../context/LoaderContextProvider";
import useUserProvider from "./useUserProvider";
import Conversation from "../types/models/conversations";

interface UseConversations {
  conversations: Conversation[] | null;
  setConversations: React.Dispatch<Conversation[] | null>;
  getChatroomConversationsOnTopScroll: UnknownGetConversationFunction;
  getChatroomConversationsOnBottomScroll: UnknownGetConversationFunction;
}

export default function useConversations(): UseConversations {
  // const { chatroomId } = useContext(ChatroomProviderContext);
  const chatroomId = 97940;
  const { lmChatclient } = useContext(GlobalClientProviderContext);
  const { setLoader } = useContext(LoaderContextProvider);
  const { lmChatUser } = useUserProvider();

  const [conversations, setConversations] = useState<Conversation[] | null>([]);

  // const params = useParams();

  const getChatroomDetails = useCallback(async () => {
    try {
      const chatroomDetailsCall = await lmChatclient?.getChatroom({
        chatroomId,
      });
      return chatroomDetailsCall.data.chatroom;
    } catch (error) {
      return logError(error);
    }
  }, [lmChatclient]);
  const getChatroomConversationsOnTopScroll = useCallback(
    async (
      conversationId: number | string | undefined,
      topNavigation: boolean | undefined,
    ) => {
      try {
        const chatroomConversationsCall = await lmChatclient?.getConversation({
          chatroomID: parseInt(chatroomId!.toString()),
          paginateBy: CONVERSATIONS_PAGINATE_BY,
          topNavigate: topNavigation,
          // conversationID: parseInt(conversationId?.toString())
          include: false,
        });
        return chatroomConversationsCall.data.conversations;
      } catch (error) {
        return logError(error);
      }
    },
    [lmChatclient],
  );
  const getChatroomConversationsOnBottomScroll = useCallback(
    async (
      conversationId: number | string | undefined,
      topNavigation: boolean | undefined,
    ) => {
      try {
        const chatroomConversationsCall = await lmChatclient?.getConversation({
          chatroomID: parseInt(chatroomId!.toString()),
          paginateBy: CONVERSATIONS_PAGINATE_BY,
          topNavigate: topNavigation,
          // conversationID: parseInt(conversationId?.toString()),
          include: false,
        });
        return chatroomConversationsCall.data.conversations;
      } catch (error) {
        return logError(error);
      }
    },
    [lmChatclient],
  );
  const getChatroomConversationsWithID = useCallback(
    async (conversationId: number | string | undefined) => {
      try {
        const chatroomConversationsCall = await lmChatclient?.getConversation({
          chatroomID: parseInt(chatroomId!.toString()),
          paginateBy: undefined,
          topNavigate: undefined,
          conversationID: parseInt(conversationId?.toString() || ""),
          include: true,
        });
        return chatroomConversationsCall.data.conversations;
      } catch (error) {
        return logError(error);
      }
    },
    [lmChatclient],
  );

  function resetConversations() {
    setConversations(null);
  }

  function logError(error: unknown): null {
    // Check if the error is an instance of Error
    if (error instanceof Error) {
      console.error("Error:", error.message);
      console.error("Stack trace:", error.stack);
    } else {
      // If it's not an Error instance, log a generic message
      console.error("An unknown error occurred:", error);
    }

    return null;
  }

  useEffect(() => {
    async function fetchChannel() {
      try {
        // get the chatroom conversations
        const newConversations = await getChatroomConversationsOnTopScroll(
          undefined,
          false,
        );
        setConversations(newConversations);

        // set the loader to false
        setLoader!(false);
      } catch (error) {
        // console.log the error
      }
    }
    fetchChannel();
    return () => {
      resetConversations();
    };
  }, [
    chatroomId,
    getChatroomConversationsOnTopScroll,
    getChatroomDetails,
    lmChatUser,
    setLoader,
  ]);
  useEffect(() => {
    const db = lmChatclient?.fbInstance();
    if (!db) {
      return;
    }
    const query = ref(db, `collabcards/${chatroomId}`);
    return onValue(query, async (snapshot) => {
      try {
        if (snapshot.exists()) {
          // uncomment to stop the scroll to bottom when new conversations come and user is on a searched conversation
          // if (sessionStorage.getItem(SEARCHED_CONVERSATION_ID) !== null) {
          //   return;
          // }

          const collabcardId = snapshot.val().collabcard.answer_id;
          const conversations =
            await getChatroomConversationsWithID(collabcardId);
          setConversations((conversationsList) => {
            return [...(conversationsList || []), ...conversations];
          });
        }
      } catch (error) {
        console.log(error);
      }
    });
  }, [chatroomId, getChatroomConversationsWithID, lmChatclient]);

  return {
    conversations,
    setConversations,
    getChatroomConversationsOnBottomScroll,
    getChatroomConversationsOnTopScroll,
  };
}
export type UnknownReturnFunction = (...props: unknown[]) => unknown;
export type UnknownGetConversationFunction = any;
