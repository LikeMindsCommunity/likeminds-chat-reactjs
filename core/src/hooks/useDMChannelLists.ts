/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useContext, useRef, useEffect, useCallback } from "react";
import GlobalClientProviderContext from "../context/LMGlobalClientProviderContext";
import UserProviderContext from "../context/LMUserProviderContext";
import { OneArgVoidReturns, ZeroArgVoidReturns } from "./useInput";
import { onValue, ref } from "firebase/database";
import { GetChatroomsSyncResponse } from "../types/api-responses/getChatroomSync";
import { Conversation } from "../types/models/conversations";
import { Chatroom } from "../types/models/Chatroom";
import Member from "../types/models/member";

/**
 * Custom hook for managing DM channel lists.
 * @returns An object containing the DM chatrooms, a flag indicating whether there are more chatrooms to load,
 * functions for fetching chatrooms, marking a chatroom as read, and refreshing the chatroom list.
 */
export default function useDmChannelLists(): UseDmChannelLists {
  const { lmChatclient } = useContext(GlobalClientProviderContext);
  const { currentCommunity } = useContext(UserProviderContext);
  const [conversationsData, setConversationsData] = useState<
    Record<string, Conversation>
  >({});
  const [usersData, setUsersData] = useState<Record<string, Member>>({});
  const [dmChatrooms, setDmChatrooms] = useState<Chatroom[]>([]);
  const dmChatroomsPageCount = useRef<number>(1);
  const loadMoreDmChatrooms = useRef<boolean>(true);

  // Add any functions here that interact with dmChatrooms, such as fetching, updating, etc.
  /**
   * Fetches the list of direct message chatrooms.
   *
   * @returns {Promise<void>} A promise that resolves when the chatrooms list is fetched.
   */
  const getDMChatroomsList = useCallback(async () => {
    try {
      const currentPageCount = dmChatroomsPageCount.current;
      const newChatroomsCall: GetChatroomsSyncResponse =
        await lmChatclient?.fetchDMFeed({
          page: currentPageCount,
          chatroomTypes: [10],
          pageSize: 50,
          maxTimestamp: Date.now(),
          minTimestamp: 0,
        });
      if (newChatroomsCall.success) {
        const newChatrooms = newChatroomsCall?.data.chatroomsData;
        if (newChatrooms.length === 0) {
          loadMoreDmChatrooms.current = false;
          return;
        }
        const newConversationsData = newChatroomsCall?.data.conversationMeta;
        const newUsersData = newChatroomsCall?.data.userMeta;
        setConversationsData((prevConversationsData) => {
          return { ...prevConversationsData, ...newConversationsData };
        });
        setUsersData((prevUsersData) => {
          return { ...prevUsersData, ...newUsersData };
        });

        dmChatroomsPageCount.current = currentPageCount + 1;
        setDmChatrooms((prevChatrooms) => {
          return [...prevChatrooms, ...newChatrooms];
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [lmChatclient]);

  /**
   * Marks a direct message chatroom as read.
   * @param id - The ID of the chatroom to mark as read.
   */
  const markReadADMChatroom = async (id: string | number) => {
    try {
      const call = await lmChatclient?.markReadChatroom({
        chatroomId: parseInt(id.toString()),
      });
      if (call.success) {
        setDmChatrooms((currentDmChatrooms) => {
          return currentDmChatrooms.map((chatroom) => {
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
  const onClickNewDMChatroom = async (memberId: string | number) => {
    try {
      const checkDMLimitCall = await lmChatclient?.checkDMLimit({
        memberId: parseInt(memberId.toString()),
      });
      if (checkDMLimitCall.success) {
        const chatroom_id = checkDMLimitCall.data.chatroom_id;
        if (chatroom_id) {
          // navigate to the chatroom
          return;
        }
        const is_request_dm_limit_exceeded =
          checkDMLimitCall.data.is_request_dm_limit_exceeded;
        if (!is_request_dm_limit_exceeded) {
          const createDMChatroomCall = await lmChatclient?.createDMChatroom({
            memberId: parseInt(memberId.toString()),
          });
          if (createDMChatroomCall.success) {
            // navigate to the chatroom
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Refreshes the DM chatrooms list by moving the specified chatroom to the top.
   * If the chatroom is not found in the list, the list remains unchanged.
   *
   * @param chatroomId - The ID of the chatroom to be refreshed.
   */
  const refreshDMChatrooms = (chatroomId: string | number) => {
    setDmChatrooms((dmChatrooms) => {
      const dmChatroomsCopy = [...dmChatrooms];
      const targetChatroom = dmChatroomsCopy.find(
        (chatroom) => chatroom.id.toString() === chatroomId.toString(),
      );
      const newDmChatroomsCopy = dmChatroomsCopy.filter(
        (chatroom) => chatroom.id.toString() !== chatroomId.toString(),
      );
      if (targetChatroom) {
        newDmChatroomsCopy.unshift(targetChatroom);
        return newDmChatroomsCopy;
      }
      return dmChatroomsCopy;
    });
  };
  //   TODO TBD
  //   const handleLastConversation = ()=>{}
  useEffect(() => {
    if (!lmChatclient) {
      return;
    }
    const fb = lmChatclient?.fbInstance();
    const query = ref(fb, `community/${currentCommunity.id}`);
    return onValue(query, (snapshot) => {
      if (snapshot.exists()) {
        const chatroomId = snapshot.val().chatroom_id;
        refreshDMChatrooms(chatroomId);
      }
    });
  }, [currentCommunity.id, lmChatclient]);
  useEffect(() => {
    getDMChatroomsList();
  }, [getDMChatroomsList]);
  return {
    dmChatrooms,
    loadMoreDmChatrooms: loadMoreDmChatrooms.current,
    getDMChatroomsList,
    refreshDMChatrooms,
    markReadADMChatroom,
    usersData,
    conversationsData,
    // Return any additional functions here
  };
}
export interface UseDmChannelLists {
  dmChatrooms: Chatroom[];
  loadMoreDmChatrooms: boolean;
  conversationsData: Record<string, Conversation>;
  usersData: Record<string, Member>;
  getDMChatroomsList: ZeroArgVoidReturns;
  refreshDMChatrooms: OneArgVoidReturns<string | number>;
  markReadADMChatroom: OneArgVoidReturns<string | number>;
  // Add any additional functions here
}
