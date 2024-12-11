import React, { useContext } from "react";
import backArrowNavigation from "../../assets/img/back-navigation-arrow.svg";
import { useConversationSearch } from "../../hooks/useConversationSearch";
import { Collapse } from "@mui/material";
import { ZeroArgVoidReturns } from "../../hooks/useInput";
import { getAvatar } from "../../shared/components/LMUserMedia";
import InfiniteScroll from "react-infinite-scroll-component";
import LMGlobalClientProviderContext from "../../context/LMGlobalClientProviderContext";
interface LMConversationSearchProps {
  onCloseSearch: ZeroArgVoidReturns;
}
const LMConversationSearch = ({ onCloseSearch }: LMConversationSearchProps) => {
  const {
    searchList,
    searchConversations,
    loadMoreConversations,
    onSearchedConversationClick,
    searchKey,
    setSearchKey,
  } = useConversationSearch();

  const { customComponents } = useContext(LMGlobalClientProviderContext);

  // Custom component
  if (customComponents?.searchConversation) {
    return <customComponents.searchConversation />;
  }
  // Default component
  return (
    <>
      <div className="lm-conversation-search">
        <div className="lm-conversation-search-go-back-icon">
          <img
            src={backArrowNavigation}
            alt="backArrowNavigation"
            onClick={onCloseSearch}
            className="lm-cursor-pointer"
          />
        </div>
        <div className="lm-conversation-search-input">
          <input
            type="text"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            placeholder="Search"
            className="lm-conversation-search-input-field"
          />
        </div>
      </div>
      <Collapse in={searchList.length > 0}>
        <div
          className="lm-conversation-search-list"
          id="lm-conversation-search-list"
        >
          <InfiniteScroll
            dataLength={searchList.length}
            next={searchConversations}
            hasMore={loadMoreConversations}
            loader={<h4>Loading...</h4>}
            scrollableTarget="lm-conversation-search-list"
          >
            {searchList.map((conversation) => (
              <div
                key={conversation.id}
                className="lm-conversation-search-list-item lm-cursor-pointer"
                onClick={() => {
                  onCloseSearch();
                  onSearchedConversationClick(conversation.id);
                }}
              >
                <div className="search-conversation-member-icon">
                  {getAvatar({
                    imageUrl: conversation.member.imageUrl,
                    name: conversation.member.name,
                  })}
                </div>
                <div className="search-conversation-content">
                  <p className="search-conversation-user-meta">
                    {conversation.member.name}
                  </p>
                  <p className="search-conversation-message">
                    {conversation.answer}
                  </p>
                </div>
              </div>
            ))}
          </InfiniteScroll>
        </div>
      </Collapse>
    </>
  );
};

export default LMConversationSearch;
