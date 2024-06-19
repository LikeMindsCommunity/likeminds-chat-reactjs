/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useContext, useEffect, useState } from "react";
import GlobalClientProviderContext from "../context/GlobalClientProviderContext";
import { DMChatroomResponse } from "../types/models/ChatroomResponse";
import { GetHomeFeedRequest } from "@likeminds.community/chat-js-beta/dist/pages/home-feed/types";
import {
  ChatroomData,
  GetChatroomsSyncResponse,
} from "../types/api-responses/getChatroomSync";
import { ZeroArgVoidReturns } from "./useInput";
interface ChatroomProviderInterface {
  dmChatroomList: DMChatroomResponse[] | null;
  loadMoreDmChatrooms: boolean;
  groupChatroomsList: ChatroomData[] | null;
  loadMoreGroupChatrooms: boolean;
  getChatroomsMine: ZeroArgVoidReturns;
}

export default function useChatroomList(): ChatroomProviderInterface {
  //   const { chatroomId, setChatroom } = useContext(ChatroomProviderContext);
  const { lmChatclient } = useContext(GlobalClientProviderContext);

  //   states for dm chatrooms
  const [dmChatrooms, setDmChatrooms] = useState<DMChatroomResponse[] | null>(
    null,
  );

  const [dmChatroomsPageCount, setDmChatroomsPageCount] = useState<number>(1);
  const [loadMoreDmChatrooms, setLoadMoreDmChatrooms] = useState<boolean>(true);
  //   state for groupchat chatrooms should come here
  const [groupChatrooms, setGroupChatrooms] = useState<ChatroomData[] | null>(
    null,
  );
  const [groupChatroomsPageCount, setGroupChatroomsPageCount] =
    useState<number>(1);
  const [loadMoreGroupChatrooms, setLoadMoreGroupChatrooms] =
    useState<boolean>(true);

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
      console.log(getChatroomsMineCall);
    } catch (error) {
      console.log(error);
    }
  }, [groupChatroomsPageCount, lmChatclient]);
  useEffect(() => {
    // getDmChannelList();
    getChatroomsMine();
  }, [getChatroomsMine]);
  return {
    dmChatroomList: dmChatrooms,
    loadMoreDmChatrooms,
    groupChatroomsList: groupChatrooms,
    loadMoreGroupChatrooms,
    getChatroomsMine,
  };
}
