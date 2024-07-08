import React from "react";
import backArrowNavigation from "../../assets/img/back-arrow-navigation.svg";
import { useConversationSearch } from "../../hooks/useConversationSearch";
import { Collapse } from "@mui/material";
const LMConversationSearch = () => {
  const {
    searchList,
    searchConversations,
    resetSearch,
    loadMoreConversations,
    onSearchedConversationClick,
    searchKey,
    setSearchKey,
  } = useConversationSearch();
  return (
    <div className="lm-conversation-search">
      <div className="lm-conversation-search-go-back-icon">
        <img src={backArrowNavigation} alt="backArrowNavigation" />
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
      <Collapse in={searchList.length > 0}>
        <div className="lm-conversation-search-list">
          {searchList.map((conversation) => (
            <div
              key={conversation.id}
              className="lm-conversation-search-list-item"
              onClick={() => onSearchedConversationClick(conversation.id)}
            >
              {conversation.answer}
            </div>
          ))}
        </div>
      </Collapse>
    </div>
  );
};

export default LMConversationSearch;
