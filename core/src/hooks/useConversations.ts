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
import { CustomActions } from "../customActions";
import { ZeroArgVoidReturns } from "./useInput";
import { ChatroomAction } from "../enums/chatroom-actions";
import { ChatroomCollabcard } from "../types/api-responses/getChatroomResponse";

interface UseConversations {
  conversations: Conversation[] | null;
  setConversations: React.Dispatch<Conversation[] | null>;
  getChatroomConversationsOnTopScroll: UnknownGetConversationFunction;
  getChatroomConversationsOnBottomScroll: UnknownGetConversationFunction;
  loadMore: boolean;
  showLoader: MutableRefObject<boolean>;
  // showLoader: boolean;
  bottomReferenceDiv: MutableRefObject<HTMLDivElement | null>;
  messageListContainerRef: MutableRefObject<HTMLDivElement | null>;
  unBlockUserInDM: ZeroArgVoidReturns;
}

export default function useConversations(): UseConversations {
  // const { chatroomId } = useContext(ChatroomProviderContext);
  const { id: chatroomId } = useParams();
  // const {chatroom} = useContext(LMChatChatroomContext)
  const { lmChatclient } = useContext(GlobalClientProviderContext);
  const { setLoader } = useContext(LoaderContextProvider);
  const { currentUser } = useContext(UserProviderContext);
  const { chatroom, setNewChatroom } = useContext(LMChatChatroomContext);
  const [conversations, setConversations] = useState<Conversation[] | null>([]);
  const [loadMore, setLoadMore] = useState<boolean>(true);
  const newChatroomConversationsLoaded = useRef<boolean>(false);
  const lastMessageRef = useRef<number | null>(null);
  const bottomReferenceDiv = useRef<HTMLDivElement | null>(null);
  const messageListContainerRef = useRef<HTMLDivElement | null>(null);
  // const [showLoader, setShowLoader] = useState<boolean>(false);
  const showLoader = useRef<boolean>(true);
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
    [chatroomId, lmChatclient],
  );

  const unBlockUserInDM = useCallback(async () => {
    // add login for showing input field
    try {
      const call = await lmChatclient?.blockMember({
        chatroomId: parseInt(chatroomId!),
        status: 1,
      });
      if (call.success) {
        const newChatroom = { ...chatroom };
        console.log(newChatroom);
        if (!(newChatroom && newChatroom.chatroom)) {
          console.log("No chatroom found");
          return;
        }
        newChatroom.chatroom.chat_request_state = 1;
        if (
          newChatroom?.chatroom_actions?.some(
            (option) => option.id === ChatroomAction.ACTION_UNBLOCK_CHATROOM,
          )
        ) {
          newChatroom!.chatroom_actions = newChatroom.chatroom_actions?.map(
            (options) => {
              if (options.id === ChatroomAction.ACTION_UNBLOCK_CHATROOM) {
                return { id: 27, title: "Block" };
              } else {
                return options;
              }
            },
          );
        } else {
          newChatroom!.chatroom_actions = newChatroom.chatroom_actions?.map(
            (options) => {
              if (options.id === ChatroomAction.ACTION_BLOCK_CHATROOM) {
                return { id: 28, title: "Unblock" };
              } else {
                return options;
              }
            },
          );
        }
        setNewChatroom(newChatroom as ChatroomCollabcard);
        document.dispatchEvent(
          new CustomEvent(CustomActions.DM_CHAT_REQUEST_STATUS_CHANGED, {
            detail: call.data.conversation,
          }),
        );
      }
    } catch (error) {
      console.log(error);
    }
  }, [chatroom, chatroomId, lmChatclient, setNewChatroom]);

  const blockUserInDM = useCallback(async () => {
    // add login for hiding input field
    try {
      const call = await lmChatclient?.blockMember({
        chatroomId: parseInt(chatroomId!),
        status: 0,
      });
    } catch (error) {
      console.log(error);
    }
  }, [chatroomId, lmChatclient]);

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
  const handleDMUserActionsConversations = useCallback(
    (conversation: Conversation) => {
      setConversations((currentConversations) => {
        console.log(currentConversations);
        console.log(conversation);
        if (!currentConversations) {
          console.log("Executing with no conversations");
          return currentConversations;
        }
        currentConversations = [...currentConversations];
        currentConversations.push(conversation);
        console.log(currentConversations);
        return currentConversations;
      });
    },
    [],
  );

  useEffect(() => {
    async function fetchChannel() {
      try {
        await getChatroomConversationsOnTopScroll();
        newChatroomConversationsLoaded.current = true;
        // set the loader to false
        // setShowLoader(() => false);
        showLoader.current = false;
        // setLoader!(false);
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
                const targetConversationObject = targetConversation[0];

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
                if (alreadyHasIt) {
                  return currentConversations;
                } else {
                  return [
                    ...(currentConversations || []),
                    ...(targetConversation || []),
                  ];
                }
              });
              setTimeout(() => {
                bottomReferenceDiv.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "end",
                  inline: "nearest",
                });
              }, 500);
            })
            .catch(console.log);
        }
      } catch (error) {
        console.log(error);
      }
    });
  }, [chatroomId, lmChatclient]);
  useEffect(() => {
    console.log("\x1b[36m%s\x1b[0m", "Executing hook");

    document.addEventListener(
      CustomActions.DM_CHAT_REQUEST_STATUS_CHANGED,
      (eventObject) => {
        console.log("We reached here");
        const detail = (eventObject as CustomEvent).detail;
        handleDMUserActionsConversations(detail);
      },
    );
    return () => {
      document.removeEventListener(
        CustomActions.DM_CHAT_REQUEST_STATUS_CHANGED,
        (eventObject) => {
          console.log("We reached here");
          const detail = (eventObject as CustomEvent).detail;
          handleDMUserActionsConversations(detail);
        },
      );
    };
  }, []);
  useEffect(() => {
    return () => {
      showLoader.current = true;
      resetConversations();
    };
  }, [chatroomId]);

  return {
    conversations,
    setConversations,
    getChatroomConversationsOnBottomScroll,
    getChatroomConversationsOnTopScroll,
    loadMore,
    showLoader,
    bottomReferenceDiv,
    messageListContainerRef,
    unBlockUserInDM,
  };
}
export type UnknownReturnFunction = (...props: unknown[]) => unknown;
export type UnknownGetConversationFunction = any;
