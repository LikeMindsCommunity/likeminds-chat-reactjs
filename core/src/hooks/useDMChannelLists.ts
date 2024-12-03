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
import { CustomActions } from "../customActions";
import { CustomisationContextProvider } from "../context/LMChatCustomisationContext";

/**
 * Custom hook for managing DM channel lists.
 * @returns An object containing the DM chatrooms, a flag indicating whether there are more chatrooms to load,
 * functions for fetching chatrooms, marking a chatroom as read, and refreshing the chatroom list.
 */
export default function useDmChannelLists(
  currentChatroomId: string,
): UseDmChannelLists {
  const { lmChatClient } = useContext(GlobalClientProviderContext);
  const { dmChannelListCustomActions = {} } = useContext(
    CustomisationContextProvider,
  );
  const {
    getDMChatroomsListCustomCallback,
    refreshDMChatroomsCustomCallback,
    markReadADMChatroomCustomCallback,
    selectNewChatroomCustomCallback,
  } = dmChannelListCustomActions;
  const { currentCommunity } = useContext(UserProviderContext);
  const [conversationsData, setConversationsData] = useState<
    Record<string, Conversation>
  >({});
  const [chatroomId, setChatroomId] = useState<string | null>(
    currentChatroomId,
  );
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
        await lmChatClient?.fetchDMFeed({
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
  }, [lmChatClient]);

  /**
   * Marks a direct message chatroom as read.
   * @param id - The ID of the chatroom to mark as read.
   */
  const markReadADMChatroom = async (id: string | number) => {
    try {
      const call = await lmChatClient?.markReadChatroom({
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
  const selectNewChatroom = (id: string) => {
    markReadADMChatroom(id);
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
  const onClickNewDMChatroom = async (memberId: string | number) => {
    try {
      const checkDMLimitCall = await lmChatClient?.checkDMLimitWithUuid({
        uuid: memberId,
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
          const createDMChatroomCall =
            await lmChatClient?.createDMChatroomWithUuid({
              uuid: memberId,
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
    if (!lmChatClient) {
      return;
    }
    const fb = lmChatClient?.fbInstance();
    const query = ref(fb, `community/${currentCommunity.id}`);
    return onValue(query, (snapshot) => {
      if (snapshot.exists()) {
        const chatroomId = snapshot.val().chatroom_id;
        refreshDMChatrooms(chatroomId);
      }
    });
  }, [currentCommunity.id, lmChatClient]);
  useEffect(() => {
    getDMChatroomsList();
  }, [getDMChatroomsList]);
  const dmChannelListDefaultActions: DMChannelListDefaultActions = {
    getDMChatroomsList,
    refreshDMChatrooms,
    markReadADMChatroom,
    selectNewChatroom,
  };
  const dmChannelListDataStore: DMChannelListDataStore = {
    dmChatrooms,
    loadMoreDmChatrooms: loadMoreDmChatrooms.current,
    conversationsData,
    usersData,
    currentSelectedChatroomId: chatroomId,
  };
  return {
    dmChatrooms,
    loadMoreDmChatrooms: loadMoreDmChatrooms.current,
    getDMChatroomsList: getDMChatroomsListCustomCallback
      ? getDMChatroomsListCustomCallback.bind(
          null,
          dmChannelListDefaultActions,
          dmChannelListDataStore,
        )
      : getDMChatroomsList,
    refreshDMChatrooms: refreshDMChatroomsCustomCallback
      ? refreshDMChatroomsCustomCallback.bind(
          null,
          dmChannelListDefaultActions,
          dmChannelListDataStore,
        )
      : refreshDMChatrooms,
    markReadADMChatroom: markReadADMChatroomCustomCallback
      ? markReadADMChatroomCustomCallback.bind(
          null,
          dmChannelListDefaultActions,
          dmChannelListDataStore,
        )
      : markReadADMChatroom,
    usersData,
    conversationsData,
    selectNewChatroom: selectNewChatroomCustomCallback
      ? selectNewChatroomCustomCallback.bind(
          null,
          dmChannelListDefaultActions,
          dmChannelListDataStore,
        )
      : selectNewChatroom,
    currentSelectedChatroomId: chatroomId,
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
  selectNewChatroom: OneArgVoidReturns<string>;
  currentSelectedChatroomId: string | null;
  // Add any additional functions here
}

export interface DMChannelListDefaultActions {
  getDMChatroomsList: ZeroArgVoidReturns;
  refreshDMChatrooms: OneArgVoidReturns<string | number>;
  markReadADMChatroom: OneArgVoidReturns<string | number>;
  selectNewChatroom: OneArgVoidReturns<string>;
}

export interface DMChannelListDataStore {
  dmChatrooms: Chatroom[];
  loadMoreDmChatrooms: boolean;
  conversationsData: Record<string, Conversation>;
  usersData: Record<string, Member>;
  currentSelectedChatroomId: string | null;
}
