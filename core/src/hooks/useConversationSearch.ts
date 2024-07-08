import { Dispatch, useContext, useRef, useState } from "react";
import GlobalClientProviderContext from "../context/GlobalClientProviderContext";
import { OneArgVoidReturns, ZeroArgVoidReturns } from "./useInput";
import { LMChatChatroomContext } from "../context/LMChatChatroomContext";
import { SearchedConversation } from "../types/models/SearchedConversation";

export function useConversationSearch(): UseConversationSearch {
  const { lmChatclient } = useContext(GlobalClientProviderContext);
  const { chatroom, setSearchedConversationId } = useContext(
    LMChatChatroomContext,
  );
  const [searchList, setSearchList] = useState<SearchedConversation[]>([]);
  const [searchKey, setSearchKey] = useState<string>("");
  const [loadMoreConversations, setLoadMoreConversations] =
    useState<boolean>(false);
  const pageCount = useRef<number>(1);
  const onSearchedConversationClick = (conversationId: number) => {
    setSearchedConversationId(conversationId);
  };
  const searchConversations = async () => {
    try {
      const PAGE_SIZE = 20;
      const call = await lmChatclient?.searchConversation({
        search: searchKey,
        page: pageCount.current,
        pageSize: PAGE_SIZE,
        chatroomId: chatroom!.chatroom.id!,
        followStatus: true,
      });
      if (call.data.chatrooms.length === 0) {
        setLoadMoreConversations(false);
      }

      if (call.data.chatrooms.length > 0) {
        setSearchList((currentList) => {
          const newList = [...currentList, ...call.data.conversations];
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

    setLoadMoreConversations(true);
  };

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
  searchList: SearchedConversation[];
  resetSearch: ZeroArgVoidReturns;
  searchConversations: ZeroArgVoidReturns;
  loadMoreConversations: boolean;
  onSearchedConversationClick: OneArgVoidReturns<number>;
}
