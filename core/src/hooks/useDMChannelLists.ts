import { useState, useContext, useRef, useEffect } from "react";
import GlobalClientProviderContext from "../context/GlobalClientProviderContext";
import UserProviderContext from "../context/UserProviderContext";
import { DMChannel } from "../types/models/ChatroomResponse";
import { OneArgVoidReturns, ZeroArgVoidReturns } from "./useInput";
import { onValue, ref } from "firebase/database";

/**
 * Custom hook for managing DM channel lists.
 * @returns An object containing the DM chatrooms, a flag indicating whether there are more chatrooms to load,
 * functions for fetching chatrooms, marking a chatroom as read, and refreshing the chatroom list.
 */
export default function useDmChannelLists(): UseDmChannelListsReturnType {
  const { lmChatclient } = useContext(GlobalClientProviderContext);
  const { currentCommunity } = useContext(UserProviderContext);

  const [dmChatrooms, setDmChatrooms] = useState<DMChannel[]>([]);
  const dmChatroomsPageCount = useRef<number>(1);
  const loadMoreDmChatrooms = useRef<boolean>(true);

  // Add any functions here that interact with dmChatrooms, such as fetching, updating, etc.
  /**
   * Fetches the list of direct message chatrooms.
   *
   * @returns {Promise<void>} A promise that resolves when the chatrooms list is fetched.
   */
  async function getDMChatroomsList() {
    try {
      const currentPageCount = dmChatroomsPageCount.current;
      const newChatroomsCall = await lmChatclient?.fetchDMFeed({
        page: currentPageCount,
      });
      const newChatrooms = newChatroomsCall?.data.dm_chatrooms;
      if (newChatrooms.length === 0) {
        loadMoreDmChatrooms.current = false;
        return;
      }
      dmChatroomsPageCount.current = currentPageCount + 1;
      setDmChatrooms((prevChatrooms) => {
        return [...prevChatrooms, ...newChatrooms];
      });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Marks a direct message chatroom as read.
   * @param id - The ID of the chatroom to mark as read.
   */
  const markReadADMChatroom = async (id: string | number) => {
    try {
      const call = await lmChatclient?.markReadChatroom({
        chatroomId: parseInt(id.toString()),
      });
      console.log(call);
      if (call.success) {
        setDmChatrooms((currentDmChatrooms) => {
          return currentDmChatrooms.map((chatroom) => {
            if (chatroom.chatroom.id.toString() === id.toString()) {
              chatroom.unseen_conversation_count = 0;
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
   * Refreshes the DM chatrooms list by moving the specified chatroom to the top.
   * If the chatroom is not found in the list, the list remains unchanged.
   *
   * @param chatroomId - The ID of the chatroom to be refreshed.
   */
  const refreshDMChatrooms = (chatroomId: string | number) => {
    setDmChatrooms((dmChatrooms) => {
      const dmChatroomsCopy = [...dmChatrooms];
      const targetChatroom = dmChatroomsCopy.find(
        (chatroom) => chatroom.chatroom.id.toString() === chatroomId.toString(),
      );
      const newDmChatroomsCopy = dmChatroomsCopy.filter(
        (chatroom) => chatroom.chatroom.id.toString() !== chatroomId.toString(),
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
  return {
    dmChatrooms,
    loadMoreDmChatrooms: loadMoreDmChatrooms.current,
    getDMChatroomsList,
    refreshDMChatrooms,
    markReadADMChatroom,
    // Return any additional functions here
  };
}
interface UseDmChannelListsReturnType {
  dmChatrooms: DMChannel[] | null;
  loadMoreDmChatrooms: boolean;
  getDMChatroomsList: ZeroArgVoidReturns;
  refreshDMChatrooms: OneArgVoidReturns<string | number>;
  markReadADMChatroom: OneArgVoidReturns<string | number>;
  // Add any additional functions here
}
