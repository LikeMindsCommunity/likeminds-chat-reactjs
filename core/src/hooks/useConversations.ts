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
import { LMChatroomContext } from "../context/LMChatChatroomContext";
import { CustomActions } from "../customActions";
import { ZeroArgVoidReturns } from "./useInput";
import { ChatroomAction } from "../enums/lm-chatroom-actions";
import { ChatroomDetails } from "../types/api-responses/getChatroomResponse";
import { GetSyncConversationsResponse } from "../types/api-responses/getSyncConversationsResponse";
import ConversationStates from "../enums/lm-conversation-states";
import { Utils } from "../utils/helpers";
import { MemberRole } from "@likeminds.community/chat-js";
import { CustomisationContextProvider } from "../context/LMChatCustomisationContext";
import Member from "../types/models/member";

interface UseConversations {
  conversations: Conversation[] | null;
  setChatroomTopic: React.Dispatch<Conversation | null>;
  chatroomTopic: Conversation | null;
  setConversations: React.Dispatch<Conversation[] | null>;
  getChatroomConversationsOnTopScroll: UnknownGetConversationFunction;
  getChatroomConversationsOnBottomScroll: UnknownGetConversationFunction;
  loadMore: boolean;
  showLoader: MutableRefObject<boolean>;
  showSkeletonResponse: boolean;
  bottomReferenceDiv: MutableRefObject<HTMLDivElement | null>;
  messageListContainerRef: MutableRefObject<HTMLDivElement | null>;
  unBlockUserInDM: ZeroArgVoidReturns;
  searchedConversationRef: MutableRefObject<HTMLDivElement | null>;
  loadMoreBottomConversation: boolean;
  shouldScrollToBottom: MutableRefObject<boolean>;
}

export default function useConversations(): UseConversations {
  const {
    chatroomDetails: {
      chatroom: { id: chatroomId },
    },
  } = useContext(LMChatroomContext);
  const { lmChatClient } = useContext(GlobalClientProviderContext);
  const { setLoader } = useContext(LoaderContextProvider);
  const { currentUser } = useContext(UserProviderContext);
  const {
    chatroomDetails,
    setNewChatroom,
    searchedConversationId,
    setSearchedConversationId,
  } = useContext(LMChatroomContext);
  const [conversations, setConversations] = useState<Conversation[] | null>([]);
  const [loadMore, setLoadMore] = useState<boolean>(true);
  const [chatroomTopic, setChatroomTopic] = useState<Conversation | null>(null);
  const [loadMoreBottomConversation, setLoadMoreBottomConversation] =
    useState<boolean>(false);
  const [showSkeletonResponse, setShowSkeletonResponse] =
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
  const showLoader = useRef<boolean>(true);
  const localConversationIds = useRef<Set<number>>(new Set());
  const shouldScrollToBottom = useRef<boolean>(true);

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
    const newConversationsIdMap = new Map<number, Conversation>();
    const newConversationRemovedMap = new Map<number, Conversation>();
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
          newConversation.member = userMeta[
            conversation.userId!.toString()
          ] as any;
          newConversation.member.roles?.includes(MemberRole.Chatbot) &&
            setShowSkeletonResponse(false);
        }

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
            newRepliedConversation.userId.toString()
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
    newConversations.forEach((conversation) => {
      const tempId = conversation.temporaryId;
      if (tempId) {
        newConversationsIdMap.set(parseInt(tempId), conversation);
      }
    });

    const newCurrentConversations = currentConversations.map((conversation) => {
      if (
        conversation.state === ConversationStates.LOCAL_CONVERSATION_STATE &&
        localConversationIds.current.has(
          parseInt(conversation?.temporaryId?.toString() || ""),
        )
      ) {
        const updatedConversation = newConversationsIdMap.get(
          parseInt(conversation?.temporaryId?.toString() || ""),
        );
        if (updatedConversation) {
          const updatedConversationCopy = { ...updatedConversation };
          newConversationRemovedMap.set(
            updatedConversationCopy.id,
            conversation,
          );
          return updatedConversationCopy;
        } else {
          return conversation;
        }
      } else {
        return conversation;
      }
    });

    if (appendAtEnd) {
      const newConversationsList = [
        ...newCurrentConversations,
        ...newConversations.filter(
          (conversation) => !newConversationRemovedMap.has(conversation.id),
        ),
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
      const chatroomDetailsCall = await lmChatClient?.getChatroom({
        chatroomId,
      });
      return chatroomDetailsCall.data.chatroom;
    } catch (error) {
      return logError(error);
    }
  }, [chatroomId, lmChatClient]);
  const getChatroomConversationsOnTopScroll = useCallback(async (newTimeStamp?: number) => {
    try {
      if (stopAdditionalCalls.current) {
        return;
      }

      const chatroomConversationsCall: GetSyncConversationsResponse =
        await lmChatClient?.getConversations({
          chatroomId: parseInt(chatroomId!.toString()),
          pageSize: CONVERSATIONS_PAGINATE_BY || 50,
          maxTimestamp: newTimeStamp ? newTimeStamp :currentChatroomMaxTimeStamp.current,
          minTimestamp: 0,
          isLocalDb: false,
          page: currentChatroomTopPageCount.current,
        });
      if (chatroomConversationsCall.success) {
        shouldScrollToBottom.current = false;
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
  }, [lmChatClient, chatroomId]);
  const getChatroomConversationsOnBottomScroll = useCallback(async () => {
    try {
      if (stopAdditionalCalls.current) {
        return;
      }
      const chatroomConversationsCall = await lmChatClient?.getConversation({
        chatroomID: parseInt(chatroomId?.toString() || ""),
        paginateBy: CONVERSATIONS_PAGINATE_BY,
        conversationID: bottomConversationId.current || 0,
        include: false,
        scrollDirection: 1,
        topNavigate: false,
      });
      if (chatroomConversationsCall.success) {
        shouldScrollToBottom.current = false;
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
  }, [chatroomId, lmChatClient]);

  const searchConversation = useCallback(async () => {
    try {
      stopAdditionalCalls.current = true;
      // conversations before the searched conversation
      const preConversationCall = await lmChatClient?.getConversation({
        chatroomID: parseInt(chatroomId?.toString() || ""),
        paginateBy: CONVERSATIONS_PAGINATE_BY,
        conversationID: parseInt(searchedConversationId?.toString() || ""),
        include: true,
        scrollDirection: 0,
        topNavigate: false,
      });
      // conversation after the searched conversation
      const postConversationCall = await lmChatClient?.getConversation({
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
        console.log(newConversations)
        shouldScrollToBottom.current = false;
        if (newConversations.length) {
          currentChatroomMaxTimeStamp.current =
            newConversations[0].createdEpoch;
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
  }, [chatroomId, lmChatClient, searchedConversationId]);
  const unBlockUserInDM = useCallback(async () => {
    try {
      const call = await lmChatClient?.blockMember({
        chatroomId: parseInt(chatroomId.toString()),
        status: 1,
      });
      if (call.success) {
        const newChatroom = { ...chatroomDetails };
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
        setNewChatroom(newChatroom as ChatroomDetails);
        document.dispatchEvent(
          new CustomEvent(CustomActions.DM_CHAT_REQUEST_STATUS_CHANGED, {
            detail: call.data.conversation,
          }),
        );
      }
    } catch (error) {
      console.log(error);
    }
  }, [chatroomDetails, chatroomId, lmChatClient, setNewChatroom]);

  const blockUserInDM = useCallback(async () => {
    // add login for hiding input field
    try {
      const call = await lmChatClient?.blockMember({
        chatroomId: parseInt(chatroomId.toString()),
        status: 0,
      });
    } catch (error) {
      console.log(error);
    }
  }, [chatroomId, lmChatClient]);

  const resetConversations = useCallback(() => {
    setConversations(() => null);
    lastMessageRef.current = null;
    newChatroomConversationsLoaded.current = false;
    currentChatroomTopPageCount.current = 1;
    shouldScrollToBottom.current = true;
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
        const newTimeStamp = Date.now()
        await getChatroomConversationsOnTopScroll(newTimeStamp);
        newChatroomConversationsLoaded.current = true;
        showLoader.current = false;
      } catch (error) {
        console.log(error);
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
    const db = lmChatClient?.fbInstance();
    if (!db) {
      return;
    }
    const getChatroomConversationsWithID = async (
      conversationId: number | string | undefined,
    ) => {
      try {
        const chatroomConversationsCall: GetSyncConversationsResponse =
          await lmChatClient?.getConversations({
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
          const collabcardId = snapshot.val().collabcard.answer_id;
          getChatroomConversationsWithID(collabcardId).then(
            (targetConversation: GetSyncConversationsResponse | null) => {
              if (!targetConversation) return;
              if (targetConversation.data.conversationsData.length === 0)
                return;
              setConversations((currentConversationsArray) => {
                if (!currentConversationsArray)
                  return currentConversationsArray;
                const currentConversations = [...currentConversationsArray];
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
            },
          );
        }
      } catch (error) {
        console.log(error);
      }
    });
  }, [chatroomId, lmChatClient]);

  /**
   * Sets up an event listener to handle when a conversation is posted on an AI chatbot.
   * If the current chatroom is identified as an AI chatbot, it triggers a skeleton response display.
   *
   * @returns {void} This effect does not return any value.
   *
   * @dependencies [chatroomDetails.chatroom, currentUser]
   * The effect depends on `chatroomDetails.chatroom` and `currentUser` to determine
   * if the listener should be added or removed.
   */
  useEffect(() => {
    if (Utils.isOtherUserAIChatbot(chatroomDetails.chatroom, currentUser)) {
      const handleConversationPostedOnAIChatbot = () => {
        setShowSkeletonResponse(true);
      };
      document.addEventListener(
        CustomActions.CONVERSATION_POSTED_ON_AI_CHATBOT,
        handleConversationPostedOnAIChatbot,
      );
      return () => {
        document.removeEventListener(
          CustomActions.CONVERSATION_POSTED_ON_AI_CHATBOT,
          handleConversationPostedOnAIChatbot,
        );
      };
    }
  }, [chatroomDetails.chatroom, currentUser]);

  useEffect(()=>{
    function failedConversationEventListener(event: Event){
      const failedConversation: Conversation = (event as CustomEvent).detail.conversation;
      setConversations((currentConversations) => {
       if(currentConversations){
        const newConversationList = currentConversations?.filter((conversation) => {
          if(conversation.temporaryId !== failedConversation.temporaryId){
            return conversation
          }
          
        })
        return newConversationList
       }else{
          return currentConversations
       }
      })
    } 
    document.addEventListener(CustomActions.CONVERSATION_FAILED_TO_SEND, failedConversationEventListener)
    return () => {
      document.removeEventListener(CustomActions.CONVERSATION_FAILED_TO_SEND, failedConversationEventListener)
    }
  })

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
    const handleNewConversationPosted = (eventObject: Event) => {
      const conversation: Conversation = (eventObject as CustomEvent).detail
        .conversation;
      if (conversation) {
        setConversations((currentConversation) => {
          if (!currentConversation) {
            return currentConversation;
          }
          localConversationIds.current.add(
            parseInt(conversation?.temporaryId!.toString()),
          );
          const newConversations = [
            ...currentConversation,
            { ...conversation },
          ];
          return newConversations;
        });
      }
    };
    document.addEventListener(
      CustomActions.NEW_CONVERSATION_POSTED,
      handleNewConversationPosted,
    );
    return () => {
      document.removeEventListener(
        CustomActions.NEW_CONVERSATION_POSTED,
        handleNewConversationPosted,
      );
    };
  }, []);
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
      searchedConversationRef.current.firstElementChild?.classList.add(
        "message-highlight",
      );
      return () => {
        setSearchedConversationId(null);
      };
    }
  }, [conversations, searchedConversationId, setSearchedConversationId]);

  useEffect(() => {
    const chatroomTopic = chatroomDetails?.chatroom?.topic;
    if (chatroomTopic) {
      setChatroomTopic(chatroomTopic);
    }
  }, [chatroomDetails]);

  return {
    conversations,
    loadMore,
    showSkeletonResponse,
    showLoader,
    bottomReferenceDiv,
    messageListContainerRef,
    searchedConversationRef,
    loadMoreBottomConversation,
    chatroomTopic,
    shouldScrollToBottom,
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
