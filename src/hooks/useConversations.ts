/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  MutableRefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import GlobalClientProviderContext from "../context/GlobalClientProviderContext";
import { onValue, ref } from "firebase/database";
import { CONVERSATIONS_PAGINATE_BY } from "../constants/Constants";
import LoaderContextProvider from "../context/LoaderContextProvider";
import Conversation from "../types/models/conversations";
import UserProviderContext from "../context/UserProviderContext";
import { LMChatChatroomContext } from "../context/LMChatChatroomContext";
import { useParams } from "react-router-dom";

interface UseConversations {
  conversations: Conversation[] | null;
  setConversations: React.Dispatch<Conversation[] | null>;
  getChatroomConversationsOnTopScroll: UnknownGetConversationFunction;
  getChatroomConversationsOnBottomScroll: UnknownGetConversationFunction;
  loadMore: boolean;
  bottomReferenceDiv: MutableRefObject<HTMLDivElement | null>;
}

export default function useConversations(): UseConversations {
  // const { chatroomId } = useContext(ChatroomProviderContext);
  const { id: chatroomId } = useParams();
  // const {chatroom} = useContext(LMChatChatroomContext)
  const { lmChatclient } = useContext(GlobalClientProviderContext);
  const { setLoader } = useContext(LoaderContextProvider);
  const { currentUser } = useContext(UserProviderContext);
  const [conversations, setConversations] = useState<Conversation[] | null>([]);
  const [loadMore, setLoadMore] = useState<boolean>(true);
  const newChatroomConversationsLoaded = useRef<boolean>(false);
  const lastMessageRef = useRef<number | null>(null);
  const bottomReferenceDiv = useRef<HTMLDivElement | null>(null);
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
  }, [chatroomId, lmChatclient]);
  const getChatroomConversationsOnTopScroll = useCallback(async () =>
    // topNavigation: boolean | undefined,
    {
      try {
        const chatroomConversationsCall = await lmChatclient?.getConversation({
          chatroomID: parseInt(chatroomId!.toString()),
          paginateBy: CONVERSATIONS_PAGINATE_BY || 50,
          topNavigate: false,
          conversationID: lastMessageRef.current
            ? parseInt(lastMessageRef.current.toString())
            : undefined,
          scrollDirection: 0,
          include: false,
        });
        if (chatroomConversationsCall.success) {
          if (!chatroomConversationsCall.data.conversations.length) {
            setLoadMore(false);
          } else {
            console.log("A");
            setConversations((currentConversations) => {
              const newConversations = [
                ...chatroomConversationsCall.data.conversations,
                ...(currentConversations || []),
              ];
              if (newConversations.length) {
                lastMessageRef.current = newConversations[0].id;
              }
              return newConversations;
            });
          }
        }
        return chatroomConversationsCall.data.conversations;
      } catch (error) {
        return logError(error);
      }
    }, [chatroomId, lmChatclient]);
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
    [chatroomId, lmChatclient],
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
    lastMessageRef.current = null;
    newChatroomConversationsLoaded.current = false;
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
        newChatroomConversationsLoaded.current = true;
        // set the loader to false
        setLoader!(false);
      } catch (error) {
        // console.log the error
      }
    }
    fetchChannel();
  }, [
    chatroomId,
    getChatroomDetails,
    currentUser,
    setLoader,
    getChatroomConversationsOnTopScroll,
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
        return targetConversation;
      } catch (error) {
        return logError(error);
      }
    };
    const query = ref(db, `collabcards/${chatroomId}`);
    return onValue(query, async (snapshot) => {
      try {
        if (snapshot.exists() && newChatroomConversationsLoaded.current) {
          // uncomment to stop the scroll to bottom when new conversations come and user is on a searched conversation
          // if (sessionStorage.getItem(SEARCHED_CONVERSATION_ID) !== null) {
          //   return;
          // }
          const collabcardId = snapshot.val().collabcard.answer_id;
          getChatroomConversationsWithID(collabcardId)
            .then((targetConversation) => {
              setConversations((currentConversations) => {
                console.log("B");
                const targetConversationObject = targetConversation[0];
                console.log(
                  `the current conversations are: ${currentConversations}`,
                );
                console.log(currentConversations);
                console.log(
                  `the targetConversation is: ${targetConversationObject}`,
                );
                const alreadyHasIt = currentConversations?.some(
                  (conversationObject) => {
                    if (
                      conversationObject.id.toString() ===
                      targetConversationObject.id.toString()
                    ) {
                      return true;
                    } else {
                      return false;
                    }
                  },
                );
                console.log(`The value for alreadyHasIt is: ${alreadyHasIt}`);
                if (alreadyHasIt) {
                  return currentConversations;
                } else {
                  return [
                    ...(currentConversations || []),
                    ...(targetConversation || []),
                  ];
                }
              });
            })
            .catch(console.log);
        }
      } catch (error) {
        console.log(error);
      }
    });
  }, [chatroomId, lmChatclient]);
  useEffect(() => {
    return () => {
      resetConversations();
    };
  }, [chatroomId]);
  useEffect(() => {
    if (conversations) {
      bottomReferenceDiv.current?.scrollIntoView();
    }
  }, [conversations]);
  return {
    conversations,
    setConversations,
    getChatroomConversationsOnBottomScroll,
    getChatroomConversationsOnTopScroll,
    loadMore,
    bottomReferenceDiv,
  };
}
export type UnknownReturnFunction = (...props: unknown[]) => unknown;
export type UnknownGetConversationFunction = any;
