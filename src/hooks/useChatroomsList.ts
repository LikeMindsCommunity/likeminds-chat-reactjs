/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useContext, useEffect, useState } from "react";
import GlobalClientProviderContext from "../context/GlobalClientProviderContext";
import { DMChatroomResponse } from "../types/models/ChatroomResponse";
import { GetHomeFeedRequest } from "@likeminds.community/chat-js-beta/dist/pages/home-feed/types";
import {
  ChatroomData,
  ConversationMeta,
  GetChatroomsSyncResponse,
} from "../types/api-responses/getChatroomSync";
import { OneArgVoidReturns, ZeroArgVoidReturns } from "./useInput";
import {
  ExploreChatroom,
  GetExploreChatroomsResponse,
} from "../types/api-responses/getExploreChatroomsResponse";
import { useNavigate, useParams } from "react-router-dom";
import UserProviderContext from "../context/UserProviderContext";
import { onValue, ref } from "firebase/database";
import { CustomActions } from "../customActions";
interface ChatroomProviderInterface {
  dmChatroomList: DMChatroomResponse[] | null;
  loadMoreDmChatrooms: boolean;
  groupChatroomsList: ChatroomData[] | null;
  groupChatroomConversationsMeta: Record<string, ConversationMeta>;
  loadMoreGroupChatrooms: boolean;
  getChatroomsMine: ZeroArgVoidReturns;
  getExploreGroupChatrooms: ZeroArgVoidReturns;
  exploreGroupChatrooms: ExploreChatroom[];
  loadMoreExploreGroupChatrooms: boolean;
  joinAChatroom: OneArgVoidReturns<string>;
}

export default function useChatroomList(): ChatroomProviderInterface {
  const navigate = useNavigate();
  const { id: chatroomId } = useParams();
  //   const { chatroomId, setChatroom } = useContext(ChatroomProviderContext);
  const { lmChatclient } = useContext(GlobalClientProviderContext);
  const { currentUser, currentCommunity } = useContext(UserProviderContext);
  //   states for dm chatrooms
  const [dmChatrooms, setDmChatrooms] = useState<DMChatroomResponse[] | null>(
    null,
  );

  const [dmChatroomsPageCount, setDmChatroomsPageCount] = useState<number>(1);
  const [loadMoreDmChatrooms, setLoadMoreDmChatrooms] = useState<boolean>(true);
  //   state for groupchat chatrooms should come here
  const [groupChatrooms, setGroupChatrooms] = useState<ChatroomData[]>([]);
  const [groupChatroomConversationsMeta, setgroupChatroomConversationsMeta] =
    useState<Record<string, ConversationMeta>>({});
  const [groupChatroomsPageCount, setGroupChatroomsPageCount] =
    useState<number>(1);
  const [loadMoreGroupChatrooms, setLoadMoreGroupChatrooms] =
    useState<boolean>(true);

  //   state for explore group chatrooms should come here
  const [exploreGroupChatrooms, setExploreGroupChatrooms] = useState<
    ExploreChatroom[]
  >([]);
  const [exploreGroupChatroomsPageCount, setExploreGroupChatroomsPageCount] =
    useState<number>(1);
  const [loadMoreExploreGroupChatrooms, setLoadMoreExploreGroupChatrooms] =
    useState<boolean>(true);
  const chatroolLeaveActionListener = useCallback(() => {
    setGroupChatrooms((currentGroupChatroom) => {
      const groupChatroomsCopy = [...currentGroupChatroom].filter(
        (chatroom) => chatroom.id.toString() !== chatroomId,
      );
      return groupChatroomsCopy;
    });
    setExploreGroupChatrooms((currentExploreChatrooms) => {
      const exploreChatroomsCopy = [...currentExploreChatrooms].map(
        (chatroom) => {
          if (chatroom.id.toString() === chatroomId) {
            chatroom.follow_status = false;
          }
          return chatroom;
        },
      );
      return exploreChatroomsCopy;
    });
  }, [chatroomId]);
  const joinAChatroom = async (collabcardId: string) => {
    try {
      const joinCall = await lmChatclient?.followChatroom({
        collabcardId: parseInt(collabcardId),
        memberId: parseInt(currentUser?.id?.toString() || "0"),
        value: true,
      });
      setExploreGroupChatrooms((currentExpolreChatrooms) => {
        return [...currentExpolreChatrooms].map((chatroom) => {
          if (chatroom.id.toString() === chatroomId) {
            chatroom.follow_status = true;
          }
          setGroupChatrooms((currentGroupChatrooms) => {
            const currentGroupChatroomsCopy = [...currentGroupChatrooms];
            const targetChatroom = currentExpolreChatrooms.find(
              (chatroom) => chatroom.id.toString() === collabcardId,
            );
            if (targetChatroom) {
              currentGroupChatroomsCopy.unshift(
                targetChatroom as unknown as ChatroomData,
              );
            }
            return currentGroupChatroomsCopy;
          });
          return chatroom;
        });
      });

      navigate(`/chat/${collabcardId}`);
      console.log(joinCall);
    } catch (error) {
      console.log(error);
    }
  };
  const refreshGroupChatrooms = useCallback((chatroomId: string | number) => {
    setGroupChatrooms((groupChatrooms) => {
      const groupChatroomsCopy = [...groupChatrooms];
      const targetChatroom = groupChatroomsCopy.find((chatroom) => {
        return chatroom.id.toString() === chatroomId.toString();
      });
      const newGroupChatroomsCopy = groupChatroomsCopy.filter((chatroom) => {
        return chatroom.id.toString() !== chatroomId.toString();
      });
      if (targetChatroom) {
        newGroupChatroomsCopy.unshift(targetChatroom);
        return newGroupChatroomsCopy;
      }
      return groupChatroomsCopy;
    });
  }, []);
  const getExploreGroupChatrooms = async () => {
    try {
      const call: GetExploreChatroomsResponse =
        await lmChatclient?.getExploreFeed({
          page: exploreGroupChatroomsPageCount,
          orderType: 0,
        });
      if (call.success) {
        if (call.data.chatrooms.length) {
          setExploreGroupChatroomsPageCount((currentPage) => currentPage + 1);
          setExploreGroupChatrooms((currentChatrooms) => {
            return [...currentChatrooms, ...call.data.chatrooms];
          });
        } else {
          setLoadMoreExploreGroupChatrooms(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  async function getDmChannelList() {
    try {
      //
      const dmChatroomList = await getDMChatroomsList();
      setDmChatroomsPageCount(dmChatroomsPageCount + 1);
      if (dmChatroomList.length === 0) {
        setLoadMoreDmChatrooms(false);
      }
      const newDmChatroomsList = [...dmChatrooms!, ...dmChatroomList];
      setDmChatrooms(newDmChatroomsList);
    } catch (error) {
      //
    }
  }
  async function getDMChatroomsList() {
    try {
      const newChatrooms = await lmChatclient?.fetchDMFeed({
        page: dmChatroomsPageCount,
      });
      console.log(newChatrooms);
      return newChatrooms.data.dm_chatrooms;
    } catch (error) {
      console.log(error);
    }
  }
  const getChatroomsMine = useCallback(async () => {
    try {
      const getChatroomsMineCall: GetChatroomsSyncResponse =
        await lmChatclient?.getHomeFeed({
          page: groupChatroomsPageCount,
          pageSize: 10,
          chatroomTypes: [0, 7] as unknown,
          maxTimestamp: Date.now(),
          minTimestamp: 0,
        } as GetHomeFeedRequest);
      if (getChatroomsMineCall.success) {
        if (!getChatroomsMineCall.data.chatrooms_data.length) {
          setLoadMoreGroupChatrooms(false);
          return;
        } else {
          setGroupChatroomsPageCount((currentCount) => currentCount + 1);
        }
        setGroupChatrooms((currentChatrooms) => {
          return [
            ...(currentChatrooms || []),
            ...getChatroomsMineCall.data.chatrooms_data,
          ];
        });
        setgroupChatroomConversationsMeta((currentConversationsMeta) => {
          return {
            ...currentConversationsMeta,
            ...getChatroomsMineCall.data.conversation_meta,
          };
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [groupChatroomsPageCount, lmChatclient]);
  useEffect(() => {
    // getDmChannelList();
    getChatroomsMine();
    getExploreGroupChatrooms();
  }, []);
  useEffect(() => {
    if (!lmChatclient) {
      return;
    }

    const fb = lmChatclient?.fbInstance();

    const query = ref(fb, `community/${currentCommunity.id}`);
    return onValue(query, (snapshot) => {
      if (snapshot.exists()) {
        // log("the firebase val is");
        // log(snapshot.val());
        const chatroomId = snapshot.val().chatroom_id;
        // if (chatroomId != id) refreshHomeFeed();
        refreshGroupChatrooms(chatroomId);
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
    dmChatroomList: dmChatrooms,
    loadMoreDmChatrooms,
    groupChatroomsList: groupChatrooms,
    loadMoreGroupChatrooms,
    getChatroomsMine,
    getExploreGroupChatrooms,
    exploreGroupChatrooms,
    loadMoreExploreGroupChatrooms,
    joinAChatroom,
    groupChatroomConversationsMeta,
  };
}
