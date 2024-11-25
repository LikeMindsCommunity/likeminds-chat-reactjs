/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import GlobalClientProviderContext from "../context/LMGlobalClientProviderContext";
import { GetHomeFeedRequest } from "@likeminds.community/chat-js/dist/pages/home-feed/types";
import { OneArgVoidReturns, ZeroArgVoidReturns } from "./useInput";
import { useNavigate } from "react-router-dom";
import UserProviderContext from "../context/LMUserProviderContext";
import { onValue, ref } from "firebase/database";
import { CustomActions } from "../customActions";
import { GetSyncConversationsResponse } from "../types/api-responses/getSyncConversationsResponse";
import { Chatroom } from "../types/models/Chatroom";
import { Conversation } from "../types/models/conversations";
import Member from "../types/models/member";

interface ChatroomProviderInterface {
  groupChatroomsList: Chatroom[] | null;
  groupChatroomConversationsMeta: Record<string, Conversation>;
  groupChatroomMember: Record<string, Member>;
  getChatroomsMine: ZeroArgVoidReturns;
  getExploreGroupChatrooms: ZeroArgVoidReturns;
  exploreGroupChatrooms: Chatroom[];
  loadMoreExploreGroupChatrooms: boolean;
  loadMoreGroupChatrooms: boolean;
  joinAChatroom: OneArgVoidReturns<string>;
  markReadAChatroom: OneArgVoidReturns<string | number>;
  onLeaveChatroom: OneArgVoidReturns<string>;
  checkForDmTab: () => Promise<HideDMTabInfo | null>;
  approveDMRequest: OneArgVoidReturns<string>;
  rejectDMRequest: OneArgVoidReturns<string>;
  currentSelectedChatroomId: string | null;
  selectNewChatroom: OneArgVoidReturns<string>;
}

export default function useChatroomList(
  currentChatroomId: string,
): ChatroomProviderInterface {
  const navigate = useNavigate();
  const [chatroomId, setChatroomId] = useState<string | null>(
    currentChatroomId,
  );
  const { lmChatclient, routes } = useContext(GlobalClientProviderContext);
  const { currentUser, currentCommunity } = useContext(UserProviderContext);

  //   state for groupchat chatrooms should come here
  const [groupChatrooms, setGroupChatrooms] = useState<Chatroom[]>([]);
  const [groupChatroomConversationsMeta, setgroupChatroomConversationsMeta] =
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
        (chatroom) => chatroom.id.toString() !== chatroomId,
      );
      return groupChatroomsCopy;
    });
    setExploreGroupChatrooms((currentExploreChatrooms) => {
      const chatroomId = (eventObject as CustomEvent).detail;
      const exploreChatroomsCopy = [...currentExploreChatrooms].map(
        (chatroom) => {
          if (chatroom.id.toString() === chatroomId) {
            chatroom.followStatus = false;
          }
          return chatroom;
        },
      );
      return exploreChatroomsCopy;
    });
  }, []);
  const markReadAChatroom = async (id: string | number) => {
    try {
      const call = await lmChatclient?.markReadChatroom({
        chatroomId: parseInt(id.toString()),
      });
      setChatroomId(id.toString());
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
  const selectNewChatroom = (id: string) => {
    markReadAChatroom(id);
    setChatroomId(id);
    console.log("Chatroom selected", id);
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
  const onLeaveChatroom = async (chatroomID: string) => {
    try {
      const call = await lmChatclient?.followChatroom({
        collabcardId: parseInt(chatroomID),
        memberId: parseInt(currentUser?.id.toString() || "0"),
        value: false,
      });
      if (call.success) {
        dispatchEvent(
          new CustomEvent(CustomActions.CHATROOM_LEAVE_ACTION_COMPLETED, {
            detail: chatroomId,
          }),
        );
        if (chatroomID.toString() === chatroomId?.toString()) {
          navigate(`${routes?.getRootPath()}`);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const joinAChatroom = async (collabcardId: string) => {
    try {
      const joinCall = await lmChatclient?.followChatroom({
        collabcardId: parseInt(collabcardId),
        memberId: parseInt(currentUser?.id?.toString() || "0"),
        value: true,
      });
      setExploreGroupChatrooms((currentExpolreChatrooms) => {
        setGroupChatrooms((currentGroupChatrooms) => {
          const currentGroupChatroomsCopy = [...currentGroupChatrooms];
          const targetChatroom = currentExpolreChatrooms.find(
            (chatroom) => chatroom.id.toString() === collabcardId,
          );
          if (targetChatroom) {
            currentGroupChatroomsCopy.unshift(targetChatroom);
          }
          return currentGroupChatroomsCopy;
        });
        return [...currentExpolreChatrooms].map((chatroom) => {
          if (chatroom.id.toString() === collabcardId?.toString()) {
            chatroom.followStatus = true;
          }
          return chatroom;
        });
      });

      navigate(`/${routes?.getChannelPath()}/${collabcardId}`);
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
        const { conversationsData, userMeta, chatroomMeta } =
          conversationData.data;
        const targetConversation = conversationsData[0];
        if (!targetConversation) {
          return;
        }
        setgroupChatroomConversationsMeta((currentConversationsMeta) => {
          currentConversationsMeta = { ...currentConversationsMeta };
          currentConversationsMeta[targetConversation.id!] = targetConversation;
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
          if (targetUpdatedChatroom) {
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
      const call = await lmChatclient?.getExploreFeed({
        page: exploreGroupChatroomsPageCount.current,
        orderType: 0,
      });
      if (call?.success) {
        if (call.data.chatrooms.length) {
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
  }, [lmChatclient]);

  async function approveDMRequest(id: string) {
    try {
      const call = await lmChatclient?.inviteAction({
        channelId: id,
        inviteStatus: 1,
      });
    } catch (error) {
      console.log(error);
    }
  }
  async function rejectDMRequest(id: string) {
    try {
      const call = await lmChatclient?.inviteAction({
        channelId: id,
        inviteStatus: 2,
      });
    } catch (error) {
      console.log(error);
    }
  }
  const getChatroomsMine = useCallback(async () => {
    try {
      const getChatroomsMineCall = await lmChatclient?.getHomeFeed({
        page: groupChatroomsPageCount.current,
        pageSize: 10,
        chatroomTypes: [0, 7] as unknown,
        maxTimestamp: Date.now(),
        minTimestamp: 0,
      } as GetHomeFeedRequest);
      if (getChatroomsMineCall?.success) {
        if (!getChatroomsMineCall.data.chatroomsData.length) {
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
        setgroupChatroomConversationsMeta((currentConversationsMeta) => {
          return {
            ...currentConversationsMeta,
            ...getChatroomsMineCall.data.conversationMeta,
          };
        });
        setgroupChatroomMember((currentConversationsMeta) => {
          return {
            ...currentConversationsMeta,
            ...getChatroomsMineCall.data.userMeta,
          };
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [lmChatclient]);
  const checkForDmTab: () => Promise<HideDMTabInfo | null> = async () => {
    try {
      const call = await lmChatclient?.checkDMTab();
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
    if (!lmChatclient) {
      return;
    }

    const fb = lmChatclient?.fbInstance();

    const query = ref(fb, `community/${currentCommunity.id}`);

    return onValue(query, async (snapshot) => {
      if (snapshot.exists()) {
        const chatroomId = snapshot.val().chatroom_id;
        const conversationId = snapshot.val().conversation_id;
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
        refreshGroupChatrooms(chatroomId, chatroomConversationsCall);
      }
    });
  }, [currentCommunity, lmChatclient, refreshGroupChatrooms]);
  useEffect(() => {
    addEventListener(
      CustomActions.CHATROOM_LEAVE_ACTION_COMPLETED,
      chatroolLeaveActionListener,
    );
    return () => {
      removeEventListener(
        CustomActions.CHATROOM_LEAVE_ACTION_COMPLETED,
        chatroolLeaveActionListener,
      );
    };
  }, [chatroolLeaveActionListener]);
  return {
    groupChatroomsList: groupChatrooms,
    getChatroomsMine,
    getExploreGroupChatrooms,
    exploreGroupChatrooms,
    loadMoreExploreGroupChatrooms: loadMoreExploreGroupChatrooms.current,
    loadMoreGroupChatrooms: loadMoreGroupChatrooms.current,
    joinAChatroom,
    onLeaveChatroom,
    groupChatroomConversationsMeta,
    groupChatroomMember,
    markReadAChatroom,
    checkForDmTab,
    approveDMRequest,
    rejectDMRequest,
    currentSelectedChatroomId: chatroomId,
    selectNewChatroom,
  };
}

export interface HideDMTabInfo {
  hide_dm_tab: boolean;
  is_cm: boolean;
  unread_dm_count: number;
  hide_dm_text: string | undefined;
}
