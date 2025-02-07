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
import { ReplyDmQueries } from "../enums/lm-reply-dm-queries";
import { GetSyncConversationsResponse } from "../types/api-responses/getSyncConversationsResponse";

/**
 * Custom hook for managing DM channel lists.
 * @returns An object containing the DM chatrooms, a flag indicating whether there are more chatrooms to load,
 * functions for fetching chatrooms, marking a chatroom as read, and refreshing the chatroom list.
 */
export default function useDmChannelLists(
  currentChatroomId?: number,
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
  const [chatroomId, setChatroomId] = useState<number | undefined>(
    currentChatroomId,
  );
  const [usersData, setUsersData] = useState<Record<string, Member>>({});
  const [dmChatrooms, setDmChatrooms] = useState<Chatroom[]>([]);
  const [showDM, setShowDM] = useState<boolean>(false);
  const [showList, setShowList] = useState<number>(1);
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
        await lmChatClient.fetchDMFeed({
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
      const call = await lmChatClient.markReadChatroom({
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

  // Function to set a new Chatroom
  const selectNewChatroom = (id: number) => {
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

  /**
   * Refreshes the DM chatrooms list by moving the specified chatroom to the top.
   * If the chatroom is not found in the list, the list remains unchanged.
   *
   * @param chatroomId - The ID of the chatroom to be refreshed.
   */
  const refreshDMChatrooms = (chatroomId: string | number, conversationData?: GetSyncConversationsResponse) => {
    if (conversationData) {
      const {
        conversationsData,
        // userMeta,
        // chatroomMeta,
        convAttachmentsMeta,
      } = conversationData.data;

      const targetConversation = conversationsData[0];
      if (!targetConversation) {
        return;
      }
      setConversationsData((currentConversationsMeta) => {
        currentConversationsMeta = { ...currentConversationsMeta };
        currentConversationsMeta[targetConversation.id!] = targetConversation;
        currentConversationsMeta[targetConversation.id!].attachments =
          convAttachmentsMeta[targetConversation.id!];
        return currentConversationsMeta;
      });
    setDmChatrooms((dmChatrooms) => {
      const dmChatroomsCopy = [...dmChatrooms];
      const targetChatroom = dmChatroomsCopy.find(
        (chatroom) => chatroom.id.toString() === chatroomId.toString(),
      );
      if(targetChatroom?.lastConversationId){
        console.log(`The targeted chatroom conversation is ${targetConversation.id.toString()}`);
        targetChatroom.lastConversationId = targetConversation.id.toString();
      }
      console.log(`The targeted chatroom`);
      console.log(targetChatroom);
      
      const newDmChatroomsCopy = dmChatroomsCopy.filter(
        (chatroom) => chatroom.id.toString() !== chatroomId.toString(),
      );
      if (targetChatroom) {
        newDmChatroomsCopy.unshift(targetChatroom);
        return newDmChatroomsCopy;
      }
      return dmChatroomsCopy;
    });
  }
  }
  useEffect(() => {
    async function checkDMStatus() {
      try {
        const call = await lmChatClient.checkDMStatus({
          requestFrom: ReplyDmQueries.DM_CHANNEL,
        });
        if (call.data.showDm) {
          setShowDM(true);
        }
        const cta = call.data.cta;
        const URLSearchParams = new URL(cta).searchParams;
        const showList = URLSearchParams.get("show_list");
        if (showList) {
          setShowList(parseInt(showList));
        }
      } catch (error) {
        console.log(error);
      }
    }
    checkDMStatus();
  }, [lmChatClient]);

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
        refreshDMChatrooms(chatroomId,chatroomConversationsCall);
      }})
    
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
    currentSelectedChatroomId: chatroomId ? parseInt(chatroomId!.toString()): undefined,
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
    showDM,
    showList,
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
  selectNewChatroom: OneArgVoidReturns<number>;
  currentSelectedChatroomId?: number;
  showDM: boolean;
  showList: number;
  // Add any additional functions here
}

export interface DMChannelListDefaultActions {
  getDMChatroomsList: ZeroArgVoidReturns;
  refreshDMChatrooms: OneArgVoidReturns<string | number>;
  markReadADMChatroom: OneArgVoidReturns<string | number>;
  selectNewChatroom: OneArgVoidReturns<number>;
}

export interface DMChannelListDataStore {
  dmChatrooms: Chatroom[];
  loadMoreDmChatrooms: boolean;
  conversationsData: Record<string, Conversation>;
  usersData: Record<string, Member>;
  currentSelectedChatroomId?: number;
}
