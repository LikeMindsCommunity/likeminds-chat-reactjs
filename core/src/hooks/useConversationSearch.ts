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

export function useConversationSearch(): UseConversationSearch {
  const { lmChatclient } = useContext(GlobalClientProviderContext);
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
      const call = await lmChatclient?.searchConversation({
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
  }, [chatroomDetails, lmChatclient, searchKey]);
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

  return {
    searchList,
    searchConversations,
    resetSearch,
    loadMoreConversations,
    onSearchedConversationClick,
    searchKey,
    setSearchKey,
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
