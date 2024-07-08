import { useContext, useRef, useState } from "react";
import { SearchedChatroom } from "../types/models/SearchedChatroom";
import GlobalClientProviderContext from "../context/GlobalClientProviderContext";
import { ZeroArgVoidReturns } from "./useInput";

export function useChatroomSearch(): UseChatroomSearch {
  const { lmChatclient } = useContext(GlobalClientProviderContext);
  const [searchList, setSearchList] = useState<SearchedChatroom[]>([]);
  const [searchKey, setSearchKey] = useState<string>("");
  const [loadMoreChatrooms, setLoadMoreChatrooms] = useState<boolean>(false);
  const pageCount = useRef<number>(1);
  const followStatus = useRef<boolean>(true);
  const searchChatroom = async () => {
    try {
      const PAGE_SIZE = 20;
      const call = await lmChatclient?.searchChatroom({
        search: searchKey,
        page: pageCount.current,
        pageSize: PAGE_SIZE,
        followStatus: followStatus.current,
        searchType: "header",
      });
      if (call.data.chatrooms.length === 0 && followStatus.current === true) {
        followStatus.current = false;
        pageCount.current = 1;
        searchChatroom();
        return;
      }
      if (call.data.chatrooms.length === 0 && followStatus.current === false) {
        setLoadMoreChatrooms(false);
      }
      if (call.data.chatrooms.length > 0) {
        setSearchList((currentList) => {
          const newList = [...currentList, ...call.data.chatrooms];
          return newList;
        });
        pageCount.current = pageCount.current + 1;
      }
      console.log(call);
    } catch (error) {
      console.log(error);
    }
  };
  const resetSearch = () => {
    setSearchList(() => {
      return [];
    });
    setSearchKey("");
    pageCount.current = 1;
    followStatus.current = true;
    setLoadMoreChatrooms(true);
  };

  return { searchList, searchChatroom, resetSearch, loadMoreChatrooms };
}

interface UseChatroomSearch {
  searchList: SearchedChatroom[];
  resetSearch: ZeroArgVoidReturns;
  searchChatroom: ZeroArgVoidReturns;
  loadMoreChatrooms: boolean;
}
