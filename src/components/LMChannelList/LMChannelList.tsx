/* eslint-disable @typescript-eslint/no-unused-vars */
import InfiniteScroll from "react-infinite-scroll-component";
import useChatroomList from "../../hooks/useChatroomsList";
import searchIcon from "./../../assets/img/search.svg";
import { getAvatar } from "../../shared/components/LMUserMedia";

function LMChannelList() {
  const { groupChatroomsList, loadMoreGroupChatrooms, getChatroomsMine } =
    useChatroomList();

  return (
    <div className="lm-channel-list">
      <div>
        <div className="lm-channel-list-header">
          <div className="title">Chatrooms</div>
          {/* <div className="icon">
            <img src={searchIcon} alt="searchIcon" />
          </div> */}
        </div>
      </div>

      <div className="lm-channel-list-body">
        <InfiniteScroll
          dataLength={groupChatroomsList?.length || 0}
          loader={null}
          hasMore={loadMoreGroupChatrooms}
          next={getChatroomsMine}
        >
          {groupChatroomsList?.map((chatroom) => {
            console.log(chatroom);
            return (
              <div className="channel-media">
                <div className="channel-icon">
                  {chatroom.chatroom_image_url ? (
                    <>
                      <img
                        src={chatroom.chatroom_image_url || ""}
                        alt="channel icon"
                      />
                    </>
                  ) : (
                    <>{chatroom.header[0]}</>
                  )}
                </div>
                <div className="channel-desc">
                  <div className="channel-title">{chatroom.header}</div>
                  {/* <div className="channel-info">
                    Direct messaging request received.
                  </div> */}
                </div>
              </div>
            );
          })}
        </InfiniteScroll>
      </div>

      {/* ------------------------ Explore Feed ------------------------ */}
      <div>
        <div className="lm-channel-list-header">
          <div className="title">Explore</div>
        </div>
      </div>

      <div className="lm-channel-list-body">
        <InfiniteScroll
          dataLength={groupChatroomsList?.length || 0}
          loader={null}
          hasMore={loadMoreGroupChatrooms}
          next={getChatroomsMine}
        >
          {groupChatroomsList?.map((chatroom) => {
            console.log(chatroom);
            return (
              <div className="channel-media">
                <div className="channel-icon">
                  {chatroom.chatroom_image_url ? (
                    <>
                      <img
                        src={chatroom.chatroom_image_url || ""}
                        alt="channel icon"
                      />
                    </>
                  ) : (
                    <>{chatroom.header[0]}</>
                  )}
                </div>
                <div className="channel-desc">
                  <div className="channel-title">
                    <div>{chatroom.header}</div>
                    <div>
                      <button>Join</button>
                      {/* <button className="joined">Join</button> */}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </InfiniteScroll>
      </div>
    </div>
  );
}

export default LMChannelList;
