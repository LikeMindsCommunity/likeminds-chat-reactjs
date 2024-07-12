import React from "react";
import backArrowNavigation from "../../assets/img/back-navigation-arrow.svg";
// import { usechatroomSearch } from "../../hooks/usechatroomSearch";
import { Collapse } from "@mui/material";
import { ZeroArgVoidReturns } from "../../hooks/useInput";
import { getAvatar } from "../../shared/components/LMUserMedia";
import InfiniteScroll from "react-infinite-scroll-component";
import { useChatroomSearch } from "../../hooks/useChatroomSearch";
interface LMChatroomSearchProps {
  onCloseSearch: ZeroArgVoidReturns;
}
const LMChatroomSearch = ({ onCloseSearch }: LMChatroomSearchProps) => {
  const {
    searchList,
    searchChatrooms,
    resetSearch,
    loadMoreChatrooms,
    onSearchChatroomClick,
    searchKey,
    setSearchKey,
  } = useChatroomSearch();
  return (
    <>
      <div className="lm-chatroom-search">
        <div className="lm-chatroom-search-go-back-icon">
          <img
            src={backArrowNavigation}
            alt="backArrowNavigation"
            onClick={onCloseSearch}
            className="lm-cursor-pointer"
          />
        </div>
        <div className="lm-chatroom-search-input">
          <input
            type="text"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            placeholder="Search"
            className="lm-chatroom-search-input-field"
          />
        </div>
      </div>
      <Collapse in={searchList.length > 0}>
        <div className="lm-chatroom-search-list" id="lm-chatroom-search-list">
          <InfiniteScroll
            dataLength={searchList.length}
            next={searchChatrooms}
            hasMore={loadMoreChatrooms}
            loader={<h4>Loading...</h4>}
            scrollableTarget="lm-chatroom-search-list"
          >
            {searchList.map((chatroom) => (
              <div
                key={chatroom.id}
                className="lm-chatroom-search-list-item lm-cursor-pointer"
                onClick={() => {
                  onCloseSearch();
                  onSearchChatroomClick(chatroom.chatroom.id);
                }}
              >
                <div className="search-chatroom-member-icon">
                  {getAvatar({
                    imageUrl: chatroom.chatroom.chatroom_image_url,
                    name: chatroom.chatroom.header,
                  })}
                </div>
                <div className="search-chatroom-content">
                  <p className="search-chatroom-user-meta">
                    {chatroom.chatroom.header}
                  </p>
                  <p className="search-chatroom-message">
                    {/* {chatroom.answer} */}
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

export default LMChatroomSearch;
