import { useContext, useEffect, useState } from "react";
import GlobalClientProviderContext from "../context/GlobalClientProviderContext";
import { DMChatroomResponse } from "../types/models/ChatroomResponse";
interface ChatroomProviderInterface {
  dmChatroomList: DMChatroomResponse[] | null;
  loadMoreDmChatrooms: boolean;
}

export default function useChatroomProvider(): ChatroomProviderInterface {
  //   const { chatroomId, setChatroom } = useContext(ChatroomProviderContext);
  const { lmChatclient } = useContext(GlobalClientProviderContext);

  //   states for dm chatrooms
  const [dmChatrooms, setDmChatrooms] = useState<DMChatroomResponse[] | null>(
    null
  );
  const [dmChatroomsPageCount, setDmChatroomsPageCount] = useState<number>(1);
  const [loadMoreDmChatrooms, setLoadMoreDmChatrooms] = useState<boolean>(true);
  //   state for groupchat chatrooms should come here

  useEffect(() => {
    getDmChannelList();
  });
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

  return {
    dmChatroomList: dmChatrooms,
    loadMoreDmChatrooms,
  };
}
