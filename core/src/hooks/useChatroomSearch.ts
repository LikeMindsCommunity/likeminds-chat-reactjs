import {
  Dispatch,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
// import { SearchedChatroom } from "../types/models/SearchedChatroom";
import GlobalClientProviderContext from "../context/LMGlobalClientProviderContext";
import { OneArgVoidReturns, ZeroArgVoidReturns } from "./useInput";
import { Chatroom } from "../types/models/Chatroom";
import { CustomisationContextProvider } from "../context/LMChatCustomisationContext";
// import { CHANNEL_PATH } from "../shared/constants/lm.routes.constant";

export function useChatroomSearch(): UseChatroomSearch {
  const { chatroomSearchCustomActions = {} } = useContext(
    CustomisationContextProvider,
  );
  const {
    searchChatroomsCustomCallback,
    onSearchChatroomClickCustomCallback,
    setSearchKeyCustomCallback,
    resetSearchCustomCallback,
  } = chatroomSearchCustomActions;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { lmChatclient } = useContext(GlobalClientProviderContext);
  const [searchList, setSearchList] = useState<Chatroom[]>([]);
  const [searchKey, setSearchKey] = useState<string>("");
  const [loadMoreChatrooms, setLoadMoreChatrooms] = useState<boolean>(false);
  const pageCount = useRef<number>(1);
  const followStatus = useRef<boolean>(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSearchChatroomClick = (chatroomId: number) => {};
  const searchChatrooms = useCallback(async () => {
    try {
      if (searchKey.length === 0) {
        return;
      }
      const PAGE_SIZE = 20;
      const call = await lmChatclient?.searchChatroom({
        search: searchKey,
        page: pageCount.current,
        pageSize: PAGE_SIZE,
        followStatus: followStatus.current,
        searchType: "header",
      });
      if (call?.data.chatrooms.length === 0 && followStatus.current === true) {
        followStatus.current = false;
        pageCount.current = 1;
        searchChatrooms();
        // return;
      }
      if (call?.data.chatrooms.length === 0 && followStatus.current === false) {
        setLoadMoreChatrooms(() => false);
      }
      if (call?.data && call.data.chatrooms.length > 0) {
        setSearchList((currentList) => {
          const newList = [...currentList, ...call.data.chatrooms];
          return newList;
        });
        pageCount.current = pageCount.current + 1;
      }
    } catch (error) {
      console.log(error);
    }
  }, [lmChatclient, searchKey]);
  const resetSearch = () => {
    setSearchList(() => {
      return [];
    });
    setSearchKey("");
    pageCount.current = 1;
    followStatus.current = true;
    setLoadMoreChatrooms(true);
  };
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchChatrooms();
    }, 300);

    return () => {
      clearTimeout(debounceTimer);
      setSearchList(() => []);
      setLoadMoreChatrooms(() => true);
      pageCount.current = 1;
    };
  }, [searchChatrooms, searchKey]);

  const chatroomSearchDefaultActions: ChatroomSearchDefaultActions = {
    searchChatrooms,
    onSearchChatroomClick,
    setSearchKey,
    resetSearch,
  };
  const chatroomSearchDataStore: ChatroomSearchDataStore = {
    loadMoreChatrooms,
    searchKey,
    searchList,
  };
  return {
    searchList,
    searchChatrooms: searchChatroomsCustomCallback
      ? searchChatroomsCustomCallback.bind(
          null,
          chatroomSearchDefaultActions,
          chatroomSearchDataStore,
        )
      : searchChatrooms,
    resetSearch: resetSearchCustomCallback
      ? resetSearchCustomCallback.bind(
          null,
          chatroomSearchDefaultActions,
          chatroomSearchDataStore,
        )
      : resetSearch,
    loadMoreChatrooms,
    searchKey,
    setSearchKey: setSearchKeyCustomCallback
      ? setSearchKeyCustomCallback.bind(
          null,
          chatroomSearchDefaultActions,
          chatroomSearchDataStore,
        )
      : setSearchKey,
    onSearchChatroomClick: onSearchChatroomClickCustomCallback
      ? onSearchChatroomClickCustomCallback.bind(
          null,
          chatroomSearchDefaultActions,
          chatroomSearchDataStore,
        )
      : onSearchChatroomClick,
  };
}

interface UseChatroomSearch {
  searchList: Chatroom[];
  resetSearch: ZeroArgVoidReturns;
  searchChatrooms: ZeroArgVoidReturns;
  loadMoreChatrooms: boolean;
  searchKey: string;
  setSearchKey: Dispatch<string>;
  onSearchChatroomClick: OneArgVoidReturns<number>;
}

export interface ChatroomSearchDefaultActions {
  searchChatrooms: ZeroArgVoidReturns;
  onSearchChatroomClick: OneArgVoidReturns<number>;
  setSearchKey: Dispatch<string>;
  resetSearch: ZeroArgVoidReturns;
}

export interface ChatroomSearchDataStore {
  loadMoreChatrooms: boolean;
  searchKey: string;
  searchList: Chatroom[];
}
