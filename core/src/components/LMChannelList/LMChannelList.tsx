/* eslint-disable @typescript-eslint/no-unused-vars */
import InfiniteScroll from "react-infinite-scroll-component";
import useChatroomList from "../../hooks/useChatroomsList";
import { useNavigate, useParams } from "react-router-dom";
import { ConstantStrings } from "../../enums/common-strings";

// Icons
import joinIcon from "../../assets/img/icon_join.svg";
import document from "../../assets/img/document.svg";
import joinedIcon from "../../assets/img/icon_joined.svg";
import { Utils } from "../../utils/helpers";
import { useContext } from "react";
import UserProviderContext from "../../context/UserProviderContext";
import { CHANNEL_PATH } from "../../shared/constants/lm.routes.constant";

function LMChannelList() {
  const {
    groupChatroomsList,
    loadMoreGroupChatrooms,
    getChatroomsMine,
    getExploreGroupChatrooms,
    exploreGroupChatrooms,
    loadMoreExploreGroupChatrooms,
    joinAChatroom,
    groupChatroomConversationsMeta,
    groupChatroomMember,
    markReadAChatroom,
    onLeaveChatroom,
  } = useChatroomList();
  const { currentUser } = useContext(UserProviderContext);

  const navigate = useNavigate();
  const { id: chatroomId } = useParams();
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

      <div className="lm-channel-list-body" id="lm-channel-list-group">
        <InfiniteScroll
          dataLength={groupChatroomsList?.length || 0}
          loader={null}
          hasMore={loadMoreGroupChatrooms}
          next={getChatroomsMine}
          scrollableTarget="lm-channel-list-group"
        >
          {groupChatroomsList?.map((chatroom) => {
            return (
              <div
                key={chatroom.id.toString()}
                className={`channel-media ${chatroomId?.toString() === chatroom.id.toString() ? "selected" : null}`}
                onClick={() => {
                  markReadAChatroom(chatroom.id);
                  navigate(`/${CHANNEL_PATH}/${chatroom.id}`);
                }}
              >
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
                    <div className="time">
                      {
                        groupChatroomConversationsMeta[
                          chatroom.last_conversation_id
                        ]?.created_at
                      }
                    </div>
                  </div>
                  <div className="channel-info">
                    <div className="channel-last-conversation">
                      {chatroom?.user_id === currentUser?.id
                        ? "You"
                        : groupChatroomMember[chatroom.user_id]?.name.split(
                            " ",
                          )[0]}
                      :&nbsp;{" "}
                      {groupChatroomConversationsMeta[
                        chatroom.last_conversation_id
                      ]?.attachment_count ? (
                        <>
                          <img src={document} alt="document" />
                        </>
                      ) : null}
                      {groupChatroomConversationsMeta[
                        chatroom.last_conversation_id
                      ]
                        ? Utils.parseAnser(
                            groupChatroomConversationsMeta[
                              chatroom.last_conversation_id
                            ].answer,
                          )
                        : null}
                    </div>
                  </div>

                  {chatroom?.unseen_count?.length > 0 ? (
                    <div className="channel-unseen-convo-count">
                      {chatroom.unseen_count}
                    </div>
                  ) : null}
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

      <div className="lm-channel-list-body" id="lm-channel-list-explore">
        <InfiniteScroll
          dataLength={exploreGroupChatrooms?.length || 0}
          loader={null}
          hasMore={loadMoreExploreGroupChatrooms}
          next={getExploreGroupChatrooms}
          scrollableTarget="lm-channel-list-explore"
        >
          {exploreGroupChatrooms?.map((chatroom) => {
            return (
              <div
                className="channel-media"
                key={chatroom.id.toString()}
                onClick={() => {
                  navigate(`/${CHANNEL_PATH}/${chatroom.id}`);
                }}
              >
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

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        chatroom.follow_status
                          ? onLeaveChatroom(chatroom.id.toString())
                          : joinAChatroom(chatroom.id.toString());
                      }}
                      className={chatroom.follow_status ? "joined" : ""}
                    >
                      {chatroom.follow_status ? (
                        <img src={joinedIcon} alt={joinedIcon} />
                      ) : (
                        <img src={joinIcon} alt={joinIcon} />
                      )}
                      {chatroom.follow_status
                        ? ConstantStrings.CHATROOM_ALREADY_JOINED_BUTTON_STRING
                        : ConstantStrings.CHATROOM_NOT_ALREADY_JOINED_BUTTON_STRING}
                    </button>
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