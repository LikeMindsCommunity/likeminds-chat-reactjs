/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import GlobalClientProviderContext from "../context/LMGlobalClientProviderContext";
import { GetHomeFeedRequest } from "@likeminds.community/chat-js/dist/pages/home-feed/types";
import { OneArgVoidReturns, ZeroArgVoidReturns } from "./useInput";

import UserProviderContext from "../context/LMUserProviderContext";
import { onValue, ref } from "firebase/database";
import { CustomActions } from "../customActions";
import { GetSyncConversationsResponse } from "../types/api-responses/getSyncConversationsResponse";
import { Chatroom } from "../types/models/Chatroom";
import { Conversation } from "../types/models/conversations";
import Member from "../types/models/member";
import { CustomisationContextProvider } from "../context/LMChatCustomisationContext";
import { ChatroomTypes } from "../enums/lm-chatroom-types";

interface ChannelListInterface {
  groupChatroomsList: Chatroom[] | null;
  groupChatroomConversationsMeta: Record<string, Conversation>;
  groupChatroomMember: Record<string, Member>;
  getChatroomsMine: ZeroArgVoidReturns;
  getExploreGroupChatrooms: ZeroArgVoidReturns;
  exploreGroupChatrooms: Chatroom[];
  loadMoreExploreGroupChatrooms: boolean;
  loadMoreGroupChatrooms: boolean;
  joinAChatroom: OneArgVoidReturns<number>;
  markReadAChatroom: OneArgVoidReturns<number>;
  onLeaveChatroom: OneArgVoidReturns<number>;
  checkForDmTab: () => Promise<HideDMTabInfo | null>;
  approveDMRequest: OneArgVoidReturns<string>;
  rejectDMRequest: OneArgVoidReturns<string>;
  currentSelectedChatroomId: number | undefined;
  selectNewChatroom: OneArgVoidReturns<number>;
}

export interface ChannelListDefaultActions {
  getChatroomsMine: ZeroArgVoidReturns;
  getExploreGroupChatrooms: ZeroArgVoidReturns;
  joinAChatroom: OneArgVoidReturns<number>;
  onLeaveChatroom: OneArgVoidReturns<number>;
  markReadAChatroom: OneArgVoidReturns<number>;
  checkForDmTab: () => Promise<HideDMTabInfo | null>;
  approveDMRequest: OneArgVoidReturns<string>;
  rejectDMRequest: OneArgVoidReturns<string>;
  selectNewChatroom: OneArgVoidReturns<number>;
}

export interface ChannelListDataStore {
  groupChatroomsList: Chatroom[];
  groupChatroomConversationsMeta: Record<string, Conversation>;
  groupChatroomMember: Record<string, Member>;
  exploreGroupChatrooms: Chatroom[];
  loadMoreExploreGroupChatrooms: boolean;
  loadMoreGroupChatrooms: boolean;
  currentSelectedChatroomId: number | undefined;
}

export default function useChatroomList(
  currentChatroomId?: number,
): ChannelListInterface {
  const [chatroomId, setChatroomId] = useState<number | undefined>(
    currentChatroomId,
  );
  const { channelListCustomActions = {} } = useContext(
    CustomisationContextProvider,
  );
  const {
    checkForDmTabCustomCallback,
    approveDMRequestCustomCallback,
    rejectDMRequestCustomCallback,
    selectNewChatroomCustomCallback,
    markReadAChatroomCustomCallback,
    onLeaveChatroomCustomCallback,
    joinAChatroomCustomCallback,
    getChatroomsMineCustomCallback,
    getExploreGroupChatroomsCustomCallback,
  } = channelListCustomActions;
  const { lmChatClient } = useContext(GlobalClientProviderContext);
  const { currentUser, currentCommunity } = useContext(UserProviderContext);

  //   state for groupchat chatrooms should come here
  const [groupChatrooms, setGroupChatrooms] = useState<Chatroom[]>([]);
  const [groupChatroomConversationsMeta, setGroupChatroomConversationsMeta] =
    useState<Record<string, Conversation>>({});
  const [groupChatroomMember, setgroupChatroomMember] = useState<
    Record<string, Member>
  >({});
  const groupChatroomsPageCount = useRef<number>(1);
  const loadMoreGroupChatrooms = useRef<boolean>(true);

  //   state for explore group chatrooms should come here
  const [exploreGroupChatrooms, setExploreGroupChatrooms] = useState<
    Chatroom[]
  >([]);
  const exploreGroupChatroomsPageCount = useRef<number>(1);
  const loadMoreExploreGroupChatrooms = useRef<boolean>(true);

  const chatroolLeaveActionListener = useCallback((eventObject: Event) => {
    setGroupChatrooms((currentGroupChatroom) => {
      const chatroomId = (eventObject as CustomEvent).detail;
      const groupChatroomsCopy = [...currentGroupChatroom].filter(
        (chatroom) => chatroom.id.toString() !== chatroomId.toString(),
      );
      return groupChatroomsCopy;
    });
    setExploreGroupChatrooms((currentExploreChatrooms) => {
      const chatroomId = (eventObject as CustomEvent).detail;
      const exploreChatroomsCopy = [...currentExploreChatrooms].map(
        (chatroom) => {
          if (chatroom.id.toString() === chatroomId.toString()) {
            chatroom.followStatus = false;
          }
          return chatroom;
        },
      );
      return exploreChatroomsCopy;
    });
  }, []);
  const markReadAChatroom = async (id: number) => {
    try {
      const call = await lmChatClient.markReadChatroom({
        chatroomId: parseInt(id.toString()),
      });
      setChatroomId(id);
      if (call.success) {
        setGroupChatrooms((currentGroupChatrooms) => {
          return currentGroupChatrooms.map((chatroom) => {
            if (chatroom.id.toString() === id.toString()) {
              chatroom.unseenCount = 0;
            }
            return chatroom;
          });
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Selects a new chatroom by marking it as read, setting it as the active chatroom,
   * and dispatching a custom event to notify listeners of the selection.
   *
   * @param {string} id - The unique identifier of the chatroom to select.
   * @returns {void} This function does not return any value.
   */
  const selectNewChatroom = (id: number) => {
    markReadAChatroom(id);
    setChatroomId(id);
    const NEW_CHATROOM_SELECTED = new CustomEvent(
      CustomActions.NEW_CHATROOM_SELECTED,
      {
        detail: {
          chatroomId: id,
        },
      },
    );
    document.dispatchEvent(NEW_CHATROOM_SELECTED);
  };

  const onLeaveChatroom = async (chatroomID: number) => {
    try {
      const call = await lmChatClient.followChatroom({
        collabcardId: chatroomID,
        memberId: parseInt(currentUser?.id.toString() || "0"),
        value: false,
      });
      if (call.success) {
        dispatchEvent(
          new CustomEvent(CustomActions.CHATROOM_LEAVE_ACTION_COMPLETED, {
            detail: chatroomID,
          }),
        );
        setGroupChatrooms((currentGroupChatrooms) => {
          const currentGroupChatroomsCopy = [...currentGroupChatrooms];
          const targetChatroom = currentGroupChatroomsCopy.findIndex(
            (chatroom) => chatroom.id.toString() === chatroomID.toString(),
          );
          if (targetChatroom) {
            if (targetChatroom >= 0) {
              currentGroupChatroomsCopy.splice(targetChatroom, 1);
            }
          }

          return currentGroupChatroomsCopy;
        });
        setExploreGroupChatrooms((currentExpolreChatrooms) => {
          return [...currentExpolreChatrooms].map((chatroom) => {
            if (chatroom.id.toString() === chatroomID?.toString()) {
              chatroom.participantsCount = (parseInt(chatroom.participantsCount!.toString()) - 1).toString();
              chatroom.followStatus = false;
            }
            return chatroom;
          });
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const joinAChatroom = async (collabcardId: number) => {
    try {
      const joinCall = await lmChatClient.followChatroom({
        collabcardId: collabcardId,
        memberId: currentUser?.id,
        value: true,
      });
      selectNewChatroom(collabcardId);
      setExploreGroupChatrooms((currentExpolreChatrooms) => {
        setGroupChatrooms((currentGroupChatrooms) => {
          const currentGroupChatroomsCopy = [...currentGroupChatrooms];
          const chatroomFromExploreChatrooms = currentExpolreChatrooms.find(
            (chatroom) => chatroom.id.toString() === collabcardId.toString(),
          );
          
          if (chatroomFromExploreChatrooms) {
            const targetChatroom = {...chatroomFromExploreChatrooms}
            targetChatroom.participantsCount = targetChatroom.participantsCount! + 1;
            currentGroupChatroomsCopy.unshift(targetChatroom);
          }
          return currentGroupChatroomsCopy;
        });
        return [...currentExpolreChatrooms].map((chatroom) => {
          if (chatroom.id.toString() === collabcardId?.toString()) {
            chatroom.participantsCount = chatroom.participantsCount! + 1;
            chatroom.followStatus = true;
          }
          return chatroom;
        });
      });

      //
    } catch (error) {
      console.log(error);
    }
  };
  const refreshGroupChatrooms = useCallback(
    (
      chatroomId: string | number,
      conversationData?: GetSyncConversationsResponse,
    ) => {
      if (conversationData) {
        const {
          conversationsData,
          userMeta,
          chatroomMeta,
          convAttachmentsMeta,
        } = conversationData.data;

        const targetConversation = conversationsData[0];
        if (!targetConversation) {
          return;
        }

        setGroupChatroomConversationsMeta((currentConversationsMeta) => {
          currentConversationsMeta = { ...currentConversationsMeta };
          currentConversationsMeta[targetConversation.id!] = targetConversation;
          currentConversationsMeta[targetConversation.id!].attachments =
            convAttachmentsMeta[targetConversation.id!];
          return currentConversationsMeta;
        });
        setgroupChatroomMember((currentMembersMeta) => {
          currentMembersMeta = { ...currentMembersMeta };
          currentMembersMeta[targetConversation.userId!] = userMeta[
            targetConversation.userId!
          ] as any;
          return currentMembersMeta;
        });
        setGroupChatrooms((currentGroupChatrooms) => {
          const groupChatroomsCopy = [...currentGroupChatrooms];
          const targetChatroom = groupChatroomsCopy.find((chatroom) => {
            return chatroom.id.toString() === chatroomId.toString();
          });
          const targetUpdatedChatroom = {
            ...targetChatroom,
            ...chatroomMeta[chatroomId?.toString()],
          };
          targetUpdatedChatroom.lastConversationId =
            targetConversation.id.toString();
          const newGroupChatroomsCopy = groupChatroomsCopy.filter(
            (chatroom) => {
              return chatroom.id.toString() !== chatroomId.toString();
            },
          );
          if (
            targetUpdatedChatroom.followStatus &&
            targetUpdatedChatroom?.type !==
              ChatroomTypes.DIRECT_MESSAGE_CHATROOM
          ) {
            newGroupChatroomsCopy.unshift(
              targetUpdatedChatroom as unknown as any,
            );
            return newGroupChatroomsCopy;
          }
          return groupChatroomsCopy;
        });
      }
    },

    [],
  );
  const getExploreGroupChatrooms = useCallback(async () => {
    try {
      const call = await lmChatClient.getExploreFeed({
        page: exploreGroupChatroomsPageCount.current,
        orderType: 0,
      });
      if (call?.success) {
        if (call?.data.chatrooms.length) {
          exploreGroupChatroomsPageCount.current += 1;
          setExploreGroupChatrooms((currentChatrooms) => {
            return [...currentChatrooms, ...call.data.chatrooms];
          });
        } else {
          loadMoreExploreGroupChatrooms.current = false;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [lmChatClient]);

  async function approveDMRequest(id: string) {
    try {
      const call = await lmChatClient.inviteAction({
        channelId: id,
        inviteStatus: 1,
      });
    } catch (error) {
      console.log(error);
    }
  }
  async function rejectDMRequest(id: string) {
    try {
      const call = await lmChatClient.inviteAction({
        channelId: id,
        inviteStatus: 2,
      });
    } catch (error) {
      console.log(error);
    }
  }
  const getChatroomsMine = useCallback(async () => {
    try {
      const getChatroomsMineCall = await lmChatClient.getHomeFeed({
        page: groupChatroomsPageCount.current,
        pageSize: 10,
        chatroomTypes: [0, 7] as unknown,
        maxTimestamp: Date.now(),
        minTimestamp: 0,
      } as GetHomeFeedRequest);
      if (getChatroomsMineCall?.success) {
        if (!getChatroomsMineCall?.data.chatroomsData.length) {
          loadMoreGroupChatrooms.current = false;
          return;
        } else {
          groupChatroomsPageCount.current += 1;
        }
        setGroupChatrooms((currentChatrooms) => {
          return [
            ...(currentChatrooms || []),
            ...getChatroomsMineCall.data.chatroomsData,
          ];
        });
        setGroupChatroomConversationsMeta((currentConversationsMeta) => {
          return {
            ...currentConversationsMeta,
            ...getChatroomsMineCall?.data.conversationMeta,
          };
        });
        setgroupChatroomMember((currentConversationsMeta) => {
          return {
            ...currentConversationsMeta,
            ...getChatroomsMineCall?.data.userMeta,
          };
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [lmChatClient]);
  const checkForDmTab: () => Promise<HideDMTabInfo | null> = async () => {
    try {
      const call = await lmChatClient.checkDMTab();
      if (call.success) {
        return call.data as HideDMTabInfo;
      }
      return null;
    } catch (error) {
      return null;
    }
  };
  useEffect(() => {
    getChatroomsMine();
    getExploreGroupChatrooms();
  }, [getChatroomsMine, getExploreGroupChatrooms]);
  useEffect(() => {
    if (!lmChatClient) {
      return;
    }

    const fb = lmChatClient.fbInstance();

    const query = ref(fb, `community/${currentCommunity.id}`);

    return onValue(query, async (snapshot) => {
      if (snapshot.exists()) {
        const chatroomId = snapshot.val().chatroom_id;
        const conversationId = snapshot.val().conversation_id;
        const chatroomConversationsCall: GetSyncConversationsResponse =
          await lmChatClient.getConversations({
            chatroomId: parseInt(chatroomId!.toString()),
            page: 1,
            pageSize: 1,
            conversationId: parseInt(conversationId?.toString() || ""),
            minTimestamp: 0,
            maxTimestamp: Date.now(),
            isLocalDb: false,
          });
        refreshGroupChatrooms(chatroomId, chatroomConversationsCall);
      }
    });
  }, [currentCommunity, lmChatClient, refreshGroupChatrooms]);

  // Effect for local handling of chatroom leave action
  useEffect(() => {
    document.addEventListener(
      CustomActions.CHATROOM_LEAVE_ACTION_COMPLETED,
      chatroolLeaveActionListener,
    );

    return () => {
      document.removeEventListener(
        CustomActions.CHATROOM_LEAVE_ACTION_COMPLETED,
        chatroolLeaveActionListener,
      );
    };
  }, [chatroolLeaveActionListener]);

  // Effect for local handling of delete conversation handler
  useEffect(() => {
    function deleteConversationHandler(eventObject: Event) {
      const conversation: Conversation = (eventObject as CustomEvent).detail
        .conversation;

      const { id } = conversation;
      const metaConversation = {
        ...groupChatroomConversationsMeta,
      };
      let deletedConversationFromMetaConversations = metaConversation[id];

      if (deletedConversationFromMetaConversations) {
        deletedConversationFromMetaConversations = {
          ...deletedConversationFromMetaConversations,
          ...conversation,
        };
        deletedConversationFromMetaConversations.deletedByUserId =
          currentUser.sdkClientInfo?.uuid;
      }

      metaConversation[id] = deletedConversationFromMetaConversations;
      setGroupChatroomConversationsMeta(metaConversation);
    }
    document.addEventListener(
      CustomActions.CONVERSATION_DELETED,
      deleteConversationHandler,
    );

    return () => {
      document.removeEventListener(
        CustomActions.CONVERSATION_DELETED,
        deleteConversationHandler,
      );
    };
  });
  const channelListDefaultActions: ChannelListDefaultActions = {
    getChatroomsMine,
    getExploreGroupChatrooms,
    joinAChatroom,
    onLeaveChatroom,
    markReadAChatroom,
    checkForDmTab,
    approveDMRequest,
    rejectDMRequest,
    selectNewChatroom,
  };
  const channelListDataStore: ChannelListDataStore = {
    groupChatroomsList: groupChatrooms,
    groupChatroomConversationsMeta,
    groupChatroomMember,
    exploreGroupChatrooms,
    loadMoreExploreGroupChatrooms: loadMoreExploreGroupChatrooms.current,
    loadMoreGroupChatrooms: loadMoreGroupChatrooms.current,
    currentSelectedChatroomId: chatroomId,
  };
  return {
    groupChatroomsList: groupChatrooms,
    getChatroomsMine: getChatroomsMineCustomCallback
      ? getChatroomsMineCustomCallback.bind(
          null,
          channelListDefaultActions,
          channelListDataStore,
        )
      : getChatroomsMine,
    getExploreGroupChatrooms: getExploreGroupChatroomsCustomCallback
      ? getExploreGroupChatroomsCustomCallback.bind(
          null,
          channelListDefaultActions,
          channelListDataStore,
        )
      : getExploreGroupChatrooms,
    exploreGroupChatrooms,
    loadMoreExploreGroupChatrooms: loadMoreExploreGroupChatrooms.current,
    loadMoreGroupChatrooms: loadMoreGroupChatrooms.current,
    joinAChatroom: joinAChatroomCustomCallback
      ? joinAChatroomCustomCallback.bind(
          null,
          channelListDefaultActions,
          channelListDataStore,
        )
      : joinAChatroom,
    onLeaveChatroom: onLeaveChatroomCustomCallback
      ? onLeaveChatroomCustomCallback.bind(
          null,
          channelListDefaultActions,
          channelListDataStore,
        )
      : onLeaveChatroom,
    groupChatroomConversationsMeta,
    groupChatroomMember,
    markReadAChatroom: markReadAChatroomCustomCallback
      ? markReadAChatroomCustomCallback.bind(
          null,
          channelListDefaultActions,
          channelListDataStore,
        )
      : markReadAChatroom,
    checkForDmTab: checkForDmTabCustomCallback
      ? checkForDmTabCustomCallback.bind(
          null,
          channelListDefaultActions,
          channelListDataStore,
        )
      : checkForDmTab,
    approveDMRequest: approveDMRequestCustomCallback
      ? approveDMRequestCustomCallback.bind(
          null,
          channelListDefaultActions,
          channelListDataStore,
        )
      : approveDMRequest,
    rejectDMRequest: rejectDMRequestCustomCallback
      ? rejectDMRequestCustomCallback.bind(
          null,
          channelListDefaultActions,
          channelListDataStore,
        )
      : rejectDMRequest,
    currentSelectedChatroomId: chatroomId,
    selectNewChatroom: selectNewChatroomCustomCallback
      ? selectNewChatroomCustomCallback.bind(
          null,
          channelListDefaultActions,
          channelListDataStore,
        )
      : selectNewChatroom,
  };
}

export interface HideDMTabInfo {
  hideDmTab: boolean;
  isCm: boolean;
  unreadDmCount: number;
  hideDmText: string | undefined;
}
