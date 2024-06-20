/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useContext, useEffect, useState } from "react";
import GlobalClientProviderContext from "../context/GlobalClientProviderContext";
import { onValue, ref } from "firebase/database";
import { CONVERSATIONS_PAGINATE_BY } from "../constants/Constants";
import LoaderContextProvider from "../context/LoaderContextProvider";
import Conversation from "../types/models/conversations";
import UserProviderContext from "../context/UserProviderContext";

interface UseConversations {
  conversations: Conversation[] | null;
  setConversations: React.Dispatch<Conversation[] | null>;
  getChatroomConversationsOnTopScroll: UnknownGetConversationFunction;
  getChatroomConversationsOnBottomScroll: UnknownGetConversationFunction;
  loadMore: boolean;
}

export default function useConversations(): UseConversations {
  // const { chatroomId } = useContext(ChatroomProviderContext);
  const chatroomId = 97940;
  const { lmChatclient } = useContext(GlobalClientProviderContext);
  const { setLoader } = useContext(LoaderContextProvider);
  const { currentUser } = useContext(UserProviderContext);

  const [conversations, setConversations] = useState<Conversation[] | null>([]);
  const [loadMore, setLoadMore] = useState<boolean>(true);
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
  const getChatroomConversationsOnTopScroll = useCallback(async () =>
    // topNavigation: boolean | undefined,
    {
      try {
        const chatroomConversationsCall = await lmChatclient?.getConversation({
          chatroomID: parseInt(chatroomId!.toString()),
          paginateBy: CONVERSATIONS_PAGINATE_BY || 50,
          topNavigate: false,
          conversationID: conversations?.length
            ? conversations[0].id
            : undefined,
          scrollDirection: 0,
          include: false,
        });
        if (chatroomConversationsCall.success) {
          if (!chatroomConversationsCall.data.conversations.length) {
            setLoadMore(false);
          } else {
            setConversations((currentConversations) => {
              const newConversations = [
                ...chatroomConversationsCall.data.conversations,
                ...(currentConversations || []),
              ];
              console.log(newConversations);
              return newConversations;
            });
          }
        }
        return chatroomConversationsCall.data.conversations;
      } catch (error) {
        return logError(error);
      }
    }, [conversations, lmChatclient]);
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
        setConversations((conversationsList) => {
          console.log(`The current conversations are: ${conversationsList}`);
          console.log(
            `The new list is : ${chatroomConversationsCall.data.conversations}`,
          );
          const targetConversation =
            chatroomConversationsCall.data.conversations;
          if (
            !conversationsList?.some((conversation) => {
              if (conversation.id === targetConversation[0].id) {
                return true;
              } else {
                return false;
              }
            })
          ) {
            return [...(conversationsList || []), ...targetConversation];
          } else {
            return conversationsList;
          }
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
        await getChatroomConversationsOnTopScroll();

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
    // getChatroomConversationsOnTopScroll,
    getChatroomDetails,
    currentUser,
    setLoader,
  ]);
  useEffect(() => {
    const db = lmChatclient?.fbInstance();
    if (!db) {
      return;
    }
    const getChatroomConversationsWithID = async (
      conversationId: number | string | undefined,
    ) => {
      try {
        const chatroomConversationsCall = await lmChatclient?.getConversation({
          chatroomID: parseInt(chatroomId!.toString()),
          paginateBy: undefined,
          topNavigate: undefined,
          conversationID: parseInt(conversationId?.toString() || ""),
          include: true,
        });
        const targetConversation = chatroomConversationsCall.data.conversations;
        if (
          !conversations?.some((conversation) => {
            if (conversation.id === targetConversation[0].id) {
              return true;
            } else {
              return false;
            }
          })
        ) {
          return [...(conversations || []), ...targetConversation];
        } else {
          return conversations;
        }
      } catch (error) {
        return logError(error);
      }
    };
    const query = ref(db, `collabcards/${chatroomId}`);
    return onValue(query, async (snapshot) => {
      try {
        if (snapshot.exists()) {
          // uncomment to stop the scroll to bottom when new conversations come and user is on a searched conversation
          // if (sessionStorage.getItem(SEARCHED_CONVERSATION_ID) !== null) {
          //   return;
          // }

          const collabcardId = snapshot.val().collabcard.answer_id;
          // const conversations =
          await getChatroomConversationsWithID(collabcardId);
        }
      } catch (error) {
        console.log(error);
      }
    });
  }, [chatroomId, lmChatclient]);

  return {
    conversations,
    setConversations,
    getChatroomConversationsOnBottomScroll,
    getChatroomConversationsOnTopScroll,
    loadMore,
  };
}
export type UnknownReturnFunction = (...props: unknown[]) => unknown;
export type UnknownGetConversationFunction = any;
