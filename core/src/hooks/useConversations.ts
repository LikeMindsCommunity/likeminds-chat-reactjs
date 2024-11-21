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
import GlobalClientProviderContext from "../context/LMGlobalClientProviderContext";
import { onValue, ref } from "firebase/database";
import { CONVERSATIONS_PAGINATE_BY } from "../constants/LMConstants";
import LoaderContextProvider from "../context/LMLoaderContextProvider";
import { Conversation } from "../types/models/conversations";
import UserProviderContext from "../context/LMUserProviderContext";
import { LMChatChatroomContext } from "../context/LMChatChatroomContext";
import { useParams } from "react-router-dom";
import { CustomActions } from "../customActions";
import { ZeroArgVoidReturns } from "./useInput";
import { ChatroomAction } from "../enums/lm-chatroom-actions";
import { ChatroomCollabcard } from "../types/api-responses/getChatroomResponse";
import { GetSyncConversationsResponse } from "../types/api-responses/getSyncConversationsResponse";
import ConversationStates from "../enums/lm-conversation-states";

interface UseConversations {
  conversations: Conversation[] | null;
  setChatroomTopic: React.Dispatch<Conversation | null>;
  chatroomTopic: Conversation | null;
  setConversations: React.Dispatch<Conversation[] | null>;
  getChatroomConversationsOnTopScroll: UnknownGetConversationFunction;
  getChatroomConversationsOnBottomScroll: UnknownGetConversationFunction;
  loadMore: boolean;
  showLoader: MutableRefObject<boolean>;
  // showLoader: boolean;
  bottomReferenceDiv: MutableRefObject<HTMLDivElement | null>;
  messageListContainerRef: MutableRefObject<HTMLDivElement | null>;
  unBlockUserInDM: ZeroArgVoidReturns;
  searchedConversationRef: MutableRefObject<HTMLDivElement | null>;
  loadMoreBottomConversation: boolean;
}

export default function useConversations(): UseConversations {
  const { id: chatroomId } = useParams();
  const { lmChatclient } = useContext(GlobalClientProviderContext);
  const { setLoader } = useContext(LoaderContextProvider);
  const { currentUser } = useContext(UserProviderContext);
  const {
    chatroom,
    setNewChatroom,
    searchedConversationId,
    setSearchedConversationId,
  } = useContext(LMChatChatroomContext);
  const [conversations, setConversations] = useState<Conversation[] | null>([]);
  const [loadMore, setLoadMore] = useState<boolean>(true);
  const [chatroomTopic, setChatroomTopic] = useState<Conversation | null>(null);
  const [loadMoreBottomConversation, setLoadMoreBottomConversation] =
    useState<boolean>(false);
  const newChatroomConversationsLoaded = useRef<boolean>(false);
  const lastMessageRef = useRef<number | null>(null);
  const bottomReferenceDiv = useRef<HTMLDivElement | null>(null);
  const messageListContainerRef = useRef<HTMLDivElement | null>(null);
  const searchedConversationRef = useRef<HTMLDivElement | null>(null);
  const currentChatroomMaxTimeStamp = useRef<number>(Date.now());
  const currentChatroomTopPageCount = useRef<number>(1);
  const stopAdditionalCalls = useRef<boolean>(false);
  // id of conversation retrieved from bottomScrollGetconversation
  const bottomConversationId = useRef<number | null>(null);
  // const [showLoader, setShowLoader] = useState<boolean>(false);
  const showLoader = useRef<boolean>(true);
  // const params = useParams();
  const transformConversations = (
    currentConversations: Conversation[],
    chatroomConversationsCall: GetSyncConversationsResponse,
    appendAtEnd?: boolean,
  ) => {
    const {
      convAttachmentsMeta,
      convPollsMeta,
      convReactionsMeta,
      conversationsData,
      conversationMeta,
      userMeta,
      widgets,
    } = chatroomConversationsCall.data;
    currentConversations = [...(currentConversations || [])];
    const newConversations = conversationsData
      .map((conversation) => {
        const newConversation = {
          ...conversation,
        } as unknown as Conversation;

        if (conversation.attachmentCount) {
          newConversation.attachments = convAttachmentsMeta[conversation.id!];
        } else {
          newConversation.attachments = [];
        }

        if (conversation.hasReactions) {
          newConversation.reactions = convReactionsMeta[
            conversation.id!.toString()
          ]?.map((reaction) => {
            return {
              member: userMeta[reaction.userId!.toString()] as any,
              ...reaction,
            };
          });
        } else {
          newConversation.reactions = [];
        }
        if (conversation.userId) {
          console.log(userMeta);
          newConversation.member = userMeta[
            conversation.userId!.toString()
          ] as any;
        }
        // if (conversation?.topic_id) {
        //   newConversation.topic = conversations_data[
        //     conversation?.topic_id
        //   ] as any;
        // }
        if (conversation.state === ConversationStates.MICRO_POLL) {
          newConversation.polls = convPollsMeta[
            conversation?.id!.toString()
          ]?.map((poll) => {
            return {
              ...poll,
              member: userMeta[poll.userId!.toString()] as any,
            };
          });
        }
        if (conversation.replyId) {
          const newRepliedConversation = conversationMeta[
            conversation.replyId
          ] as any;
          if (newRepliedConversation.attachment_count) {
            newRepliedConversation.attachments =
              convAttachmentsMeta[newConversation.replyId!.toString()];
          }
          const repliedConversationUser = userMeta[
            newRepliedConversation.user_id.toString()
          ] as any;
          newRepliedConversation.member = repliedConversationUser;
          newConversation.replyConversationObject = newRepliedConversation;
        }
        if (conversation?.widgetId?.length) {
          newConversation.widget = widgets[conversation.widgetId];
        }
        return newConversation;
      })
      .reverse();
    if (appendAtEnd) {
      const newConversationsList = [
        ...currentConversations,
        ...newConversations,
      ];
      return newConversationsList;
    } else {
      const newConversationsList = [
        ...newConversations,
        ...currentConversations,
      ];
      return newConversationsList;
    }
  };
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
  const getChatroomConversationsOnTopScroll = useCallback(async () => {
    try {
      if (stopAdditionalCalls.current) {
        return;
      }

      const chatroomConversationsCall: GetSyncConversationsResponse =
        await lmChatclient?.getConversations({
          chatroomId: parseInt(chatroomId!.toString()),
          pageSize: CONVERSATIONS_PAGINATE_BY || 50,
          maxTimestamp: currentChatroomMaxTimeStamp.current,
          minTimestamp: 0,
          isLocalDb: false,
          page: currentChatroomTopPageCount.current,
        });
      if (chatroomConversationsCall.success) {
        const { conversationsData } = chatroomConversationsCall.data;
        if (!conversationsData.length) {
          setLoadMore(false);
        } else {
          setConversations((currentConversations) => {
            const newConversationsList = transformConversations(
              currentConversations || [],
              chatroomConversationsCall,
            );
            return newConversationsList;
          });
          currentChatroomTopPageCount.current =
            currentChatroomTopPageCount.current + 1;
        }
      }

      return;
    } catch (error) {
      return logError(error);
    }
  }, [lmChatclient, chatroomId]);
  const getChatroomConversationsOnBottomScroll = useCallback(async () => {
    try {
      if (stopAdditionalCalls.current) {
        return;
      }
      const chatroomConversationsCall = await lmChatclient?.getConversation({
        chatroomID: parseInt(chatroomId?.toString() || ""),
        paginateBy: CONVERSATIONS_PAGINATE_BY,
        conversationID: bottomConversationId.current || 0,
        include: false,
        scrollDirection: 1,
        topNavigate: false,
      });
      if (chatroomConversationsCall.success) {
        if (chatroomConversationsCall.data.conversations.length) {
          setConversations((currentConversations) => {
            if (!currentConversations) {
              return currentConversations;
            }

            const newConversations = [
              ...currentConversations,
              ...chatroomConversationsCall.data.conversations,
            ];
            bottomConversationId.current =
              newConversations[newConversations.length - 1].id;
            return newConversations;
          });
        } else {
          setLoadMoreBottomConversation(() => false);
        }
      }
      return;
    } catch (error) {
      logError(error);
      return;
    }
  }, [chatroomId, lmChatclient]);

  const searchConversation = useCallback(async () => {
    try {
      stopAdditionalCalls.current = true;
      // conversations before the searched conversation
      const preConversationCall = await lmChatclient?.getConversation({
        chatroomID: parseInt(chatroomId?.toString() || ""),
        paginateBy: CONVERSATIONS_PAGINATE_BY,
        conversationID: parseInt(searchedConversationId?.toString() || ""),
        include: true,
        scrollDirection: 0,
        topNavigate: false,
      });
      // conversation after the searched conversation
      const postConversationCall = await lmChatclient?.getConversation({
        chatroomID: parseInt(chatroomId?.toString() || ""),
        paginateBy: CONVERSATIONS_PAGINATE_BY,
        conversationID: parseInt(searchedConversationId?.toString() || ""),
        include: false,
        scrollDirection: 1,
        topNavigate: false,
      });
      setLoadMoreBottomConversation(() => true);
      setConversations((currentConversations) => {
        const newConversations = [
          ...(preConversationCall.data.conversations || []),
          ...(postConversationCall.data.conversations || []),
        ];
        if (newConversations.length) {
          currentChatroomMaxTimeStamp.current =
            newConversations[0].created_epoch;
          currentChatroomTopPageCount.current = 1;
          bottomConversationId.current =
            newConversations[newConversations.length - 1].id;
        }
        return newConversations;
      });
    } catch (error) {
      console.log(error);
    } finally {
      stopAdditionalCalls.current = false;
    }
  }, [chatroomId, lmChatclient, searchedConversationId]);
  const unBlockUserInDM = useCallback(async () => {
    // add login for showing input field
    try {
      const call = await lmChatclient?.blockMember({
        chatroomId: parseInt(chatroomId!),
        status: 1,
      });
      if (call.success) {
        const newChatroom = { ...chatroom };
        if (!(newChatroom && newChatroom.chatroom)) {
          return;
        }
        newChatroom.chatroom.chatRequestState = 1;
        if (
          newChatroom?.chatroomActions?.some(
            (option) => option.id === ChatroomAction.ACTION_UNBLOCK_CHATROOM,
          )
        ) {
          newChatroom!.chatroomActions = newChatroom.chatroomActions?.map(
            (options) => {
              if (options.id === ChatroomAction.ACTION_UNBLOCK_CHATROOM) {
                return { id: 27, title: "Block" };
              } else {
                return options;
              }
            },
          );
        } else {
          newChatroom!.chatroomActions = newChatroom.chatroomActions?.map(
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

  const resetConversations = useCallback(() => {
    setConversations(() => null);
    lastMessageRef.current = null;
    newChatroomConversationsLoaded.current = false;
    currentChatroomTopPageCount.current = 1;
    setSearchedConversationId(null);
  }, [setSearchedConversationId]);

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
        if (!currentConversations) {
          return currentConversations;
        }
        currentConversations = [...currentConversations];
        currentConversations.push(conversation);
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
        const chatroomConversationsCall: GetSyncConversationsResponse =
          await lmChatclient?.getConversations({
            chatroomId: parseInt(chatroomId!.toString()),
            page: 1,
            pageSize: 1,
            conversationId: parseInt(conversationId?.toString() || ""),
            minTimestamp: 0,
            maxTimestamp: Date.now(),
            isLocalDb: false,
          });

        return chatroomConversationsCall;
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
            .then((targetConversation: GetSyncConversationsResponse | null) => {
              if (!targetConversation) return;
              if (targetConversation.data.conversationsData.length === 0)
                return;
              setConversations((currentConversations) => {
                const targetConversationObject =
                  targetConversation?.data?.conversationsData[0];
                if (!currentConversations) {
                  return currentConversations;
                }
                // utilising for loop with reverse indexing to make checks faster
                let alreadyHasIt = false;
                const currentConversationsLength = currentConversations?.length;
                for (
                  let index = currentConversationsLength - 1;
                  index >= 0;
                  index--
                ) {
                  const conversationObject = currentConversations[index];
                  if (
                    conversationObject?.id!.toString() ===
                    targetConversationObject?.id!.toString()
                  ) {
                    alreadyHasIt = true;
                    break;
                  }
                }

                if (alreadyHasIt) {
                  return currentConversations;
                } else {
                  const newConversationsList = transformConversations(
                    currentConversations || [],
                    targetConversation,
                    true,
                  );
                  return newConversationsList;
                }
              });
              setTimeout(() => {
                bottomReferenceDiv.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "end",
                  inline: "nearest",
                });
              }, 100);
            })
            .catch(console.log);
        }
      } catch (error) {
        console.log(error);
      }
    });
  }, [chatroomId, lmChatclient]);

  useEffect(() => {
    document.addEventListener(
      CustomActions.DM_CHAT_REQUEST_STATUS_CHANGED,
      (eventObject) => {
        const detail = (eventObject as CustomEvent).detail;
        handleDMUserActionsConversations(detail);
      },
    );
    return () => {
      document.removeEventListener(
        CustomActions.DM_CHAT_REQUEST_STATUS_CHANGED,
        (eventObject) => {
          const detail = (eventObject as CustomEvent).detail;
          handleDMUserActionsConversations(detail);
        },
      );
    };
  }, [handleDMUserActionsConversations]);
  useEffect(() => {
    if (searchedConversationId) {
      searchConversation();
    }
  }, [searchConversation, searchedConversationId]);
  useEffect(() => {
    return () => {
      showLoader.current = true;
      resetConversations();
    };
  }, [chatroomId, resetConversations]);
  useEffect(() => {
    if (
      conversations?.length &&
      searchedConversationId &&
      messageListContainerRef &&
      messageListContainerRef.current &&
      searchedConversationRef &&
      searchedConversationRef.current
    ) {
      setTimeout(() => {
        searchedConversationRef?.current?.scrollIntoView({
          behavior: "auto",
          inline: "center",
          block: "nearest",
        });
      }, 40);

      searchedConversationRef.current.firstElementChild?.classList.add(
        "message-highlight",
      );
      return () => {
        setSearchedConversationId(null);
      };
    }
  }, [conversations, searchedConversationId, setSearchedConversationId]);

  useEffect(() => {
    const chatroomTopic = chatroom?.chatroom?.topic;
    if (chatroomTopic) {
      setChatroomTopic(chatroomTopic);
    }
  }, [chatroom]);

  return {
    conversations,
    loadMore,
    showLoader,
    bottomReferenceDiv,
    messageListContainerRef,
    searchedConversationRef,
    loadMoreBottomConversation,
    chatroomTopic,
    // Functions
    setConversations,
    getChatroomConversationsOnBottomScroll,
    getChatroomConversationsOnTopScroll,
    unBlockUserInDM,
    setChatroomTopic,
  };
}
export type UnknownReturnFunction = (...props: unknown[]) => unknown;
export type UnknownGetConversationFunction = any;
