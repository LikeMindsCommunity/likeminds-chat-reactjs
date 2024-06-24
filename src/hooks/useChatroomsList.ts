/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useContext, useEffect, useState } from "react";
import GlobalClientProviderContext from "../context/GlobalClientProviderContext";
import { DMChatroomResponse } from "../types/models/ChatroomResponse";
import { GetHomeFeedRequest } from "@likeminds.community/chat-js-beta/dist/pages/home-feed/types";
import {
  ChatroomData,
  GetChatroomsSyncResponse,
} from "../types/api-responses/getChatroomSync";
import { OneArgVoidReturns, ZeroArgVoidReturns } from "./useInput";
import {
  ExploreChatroom,
  GetExploreChatroomsResponse,
} from "../types/api-responses/getExploreChatroomsResponse";
import { useNavigate } from "react-router-dom";
import UserProviderContext from "../context/UserProviderContext";
import { onValue, ref } from "firebase/database";
interface ChatroomProviderInterface {
  dmChatroomList: DMChatroomResponse[] | null;
  loadMoreDmChatrooms: boolean;
  groupChatroomsList: ChatroomData[] | null;
  loadMoreGroupChatrooms: boolean;
  getChatroomsMine: ZeroArgVoidReturns;
  getExploreGroupChatrooms: ZeroArgVoidReturns;
  exploreGroupChatrooms: ExploreChatroom[];
  loadMoreExploreGroupChatrooms: boolean;
  joinAChatroom: OneArgVoidReturns<string>;
}

export default function useChatroomList(): ChatroomProviderInterface {
  const navigate = useNavigate();
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

  const joinAChatroom = async (collabcardId: string) => {
    try {
      const joinCall = await lmChatclient?.followChatroom({
        collabcardId: parseInt(collabcardId),
        memberId: parseInt(currentUser?.id?.toString() || "0"),
        value: true,
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
    console.log(currentCommunity);
    const fb = lmChatclient?.fbInstance();

    const query = ref(fb, `community/${currentCommunity.id}`);
    return onValue(query, (snapshot) => {
      if (snapshot.exists()) {
        // log("the firebase val is");
        // log(snapshot.val());
        const chatroomId = snapshot.val().chatroom_id;
        // if (chatroomId != id) refreshHomeFeed();
        refreshGroupChatrooms(chatroomId);
        console.log(chatroomId);
      }
    });
  }, [currentCommunity, lmChatclient, refreshGroupChatrooms]);
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
  };
}
