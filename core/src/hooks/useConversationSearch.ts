import {
  Dispatch,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import GlobalClientProviderContext from "../context/LMGlobalClientProviderContext";
import { OneArgVoidReturns, ZeroArgVoidReturns } from "./useInput";
import { LMChatroomContext } from "../context/LMChatChatroomContext";

import { Conversation } from "../types/models/conversations";
import { CustomisationContextProvider } from "../context/LMChatCustomisationContext";

export function useConversationSearch(): UseConversationSearch {
  const { lmChatClient } = useContext(GlobalClientProviderContext);
  const { conversationSearchCustomActions = {} } = useContext(
    CustomisationContextProvider,
  );
  const {
    searchConversationsCustomCallback,
    resetSearchCustomCallback,
    setSearchKeyCustomCallback,
    onSearchedConversationClickCustomCallback,
  } = conversationSearchCustomActions;
  const { chatroomDetails, setSearchedConversationId } =
    useContext(LMChatroomContext);
  const [searchList, setSearchList] = useState<Conversation[]>([]);
  const [searchKey, setSearchKey] = useState<string>("");
  const [loadMoreConversations, setLoadMoreConversations] =
    useState<boolean>(false);
  const pageCount = useRef<number>(1);
  const onSearchedConversationClick = (conversationId: number) => {
    setSearchedConversationId(conversationId);
  };
  const searchConversations = useCallback(async () => {
    try {
      const PAGE_SIZE = 20;
      const call = await lmChatClient?.searchConversation({
        search: searchKey,
        page: pageCount.current,
        pageSize: PAGE_SIZE,
        chatroomId: chatroomDetails!.chatroom.id!,
        followStatus: true,
      });
      if (call?.data.conversations.length === 0) {
        setLoadMoreConversations(false);
      }
      if (call!.data.conversations.length > 0) {
        setSearchList((currentList) => {
          const newList = [...currentList, ...call!.data.conversations];
          return newList;
        });
        pageCount.current = pageCount.current + 1;
      }
    } catch (error) {
      console.log(error);
    }
  }, [chatroomDetails, lmChatClient, searchKey]);
  const resetSearch = () => {
    setSearchList(() => {
      return [];
    });
    setSearchKey("");
    pageCount.current = 1;
    setLoadMoreConversations(() => true);
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchConversations();
    }, 300);

    return () => {
      clearTimeout(debounceTimer);
      setSearchList(() => []);
      setLoadMoreConversations(() => true);
      pageCount.current = 1;
    };
  }, [searchConversations, searchKey]);
  const conversationSearchDefaultActions: ConversationSearchDefaultActions = {
    searchConversations,
    resetSearch,
    setSearchKey,
    onSearchedConversationClick,
  };
  const conversationSearchDataStore: ConversationSearchDataStore = {
    searchKey,
    searchList,
    loadMoreConversations,
  };
  return {
    searchList,
    searchConversations: searchConversationsCustomCallback
      ? searchConversationsCustomCallback?.bind(
          null,
          conversationSearchDefaultActions,
          conversationSearchDataStore,
        )
      : searchConversations,
    resetSearch: resetSearchCustomCallback
      ? resetSearchCustomCallback.bind(
          null,
          conversationSearchDefaultActions,
          conversationSearchDataStore,
        )
      : resetSearch,
    loadMoreConversations,
    onSearchedConversationClick: onSearchedConversationClickCustomCallback
      ? onSearchedConversationClickCustomCallback.bind(
          null,
          conversationSearchDefaultActions,
          conversationSearchDataStore,
        )
      : onSearchedConversationClick,
    searchKey,
    setSearchKey: setSearchKeyCustomCallback
      ? setSearchKeyCustomCallback.bind(
          null,
          conversationSearchDefaultActions,
          conversationSearchDataStore,
        )
      : setSearchKey,
  };
}

interface UseConversationSearch {
  searchKey: string;
  setSearchKey: Dispatch<string>;
  searchList: Conversation[];
  resetSearch: ZeroArgVoidReturns;
  searchConversations: ZeroArgVoidReturns;
  loadMoreConversations: boolean;
  onSearchedConversationClick: OneArgVoidReturns<number>;
}

export interface ConversationSearchDefaultActions {
  searchConversations: ZeroArgVoidReturns;
  resetSearch: ZeroArgVoidReturns;
  setSearchKey: Dispatch<string>;
  onSearchedConversationClick: OneArgVoidReturns<number>;
}

export interface ConversationSearchDataStore {
  searchKey: string;
  searchList: Conversation[];
  loadMoreConversations: boolean;
}
