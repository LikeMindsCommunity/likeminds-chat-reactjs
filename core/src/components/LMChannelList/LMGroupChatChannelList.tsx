/* eslint-disable @typescript-eslint/no-unused-vars */
import InfiniteScroll from "react-infinite-scroll-component";
import useChatroomList from "../../hooks/useChatroomsList";

import { ConstantStrings } from "../../enums/lm-common-strings";
import { Utils } from "../../utils/helpers";
import { useContext, useState } from "react";
import UserProviderContext from "../../context/LMUserProviderContext";

// Icons
import joinIcon from "../../assets/img/icon_join.svg";
import document from "../../assets/img/document.svg";
import searchIcon from "../../assets/img/search.svg";
import joinedIcon from "../../assets/img/icon_joined.svg";
import participantsIcon from "../../assets/img/explore-feed_chatroom_participants.svg";
import messageIcon from "../../assets/img/explore-feed_chatroom_messages.svg";
import LMChatroomSearch from "../search/LMChatroomSearch";

import LMGlobalClientProviderContext from "../../context/LMGlobalClientProviderContext";
import { Chatroom } from "../../types/models/Chatroom";
import { Conversation } from "../../types/models/conversations";

import previewIconImage from "../../assets/img/preview-icon-image.svg";
import previewIconDoc from "../../assets/img/preview-icon-file.svg";
import previewIconPoll from "../../assets/img/preview-icon-poll.svg";
import { Attachment } from "../../types/models/Attachment";
import { FileTypeInitials } from "../../enums/lm-file-type-initials";
import { FileType } from "../../types/enums/Filetype";

export interface LMGroupChatChannelListProps {
  currentChatroomId?: number;
}

function LMChatGroupChannelList({
  currentChatroomId,
}: LMGroupChatChannelListProps) {
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
    onLeaveChatroom,
    currentSelectedChatroomId,
    selectNewChatroom,
  } = useChatroomList(currentChatroomId);
  const { currentUser } = useContext(UserProviderContext);

  // Search in chatroom
  const [openSearchField, setOpenSearchField] = useState<boolean>(false);

  const onOpenSearch = () => {
    setOpenSearchField(true);
  };
  const onCloseSearch = () => {
    setOpenSearchField(false);
  };

  function returnAttachmentPreviewIcon(conversation: Conversation) {
    if (conversation.polls) {
      return (
        <img
          src={previewIconPoll}
          alt="poll-preview-icon"
          className="lm-chat-conversation-preview-icon"
        />
      );
    }
    if (conversation.attachmentCount) {
      const attachmentArray = conversation.attachments!;
      if (!attachmentArray) {
        return null;
      }
      const firstAttachment = attachmentArray[0];
      const attachmentType = firstAttachment?.type;
      switch (attachmentType) {
        case "pdf":
          return (
            <img
              src={previewIconDoc}
              alt="doc-preview-icon"
              className="lm-chat-conversation-preview-icon"
            />
          );
        default:
          return (
            <img
              src={previewIconImage}
              alt="image-preview-icon"
              className="lm-chat-conversation-preview-icon"
            />
          );
      }
    } else return null;
  }

  const renderLastConversationUsername = (chatroom: Chatroom) => {
    const lastConversationId = chatroom?.lastConversationId || "";
    const lastConversation =
      groupChatroomConversationsMeta[lastConversationId] ||
      ({} as Conversation);
    const lastConversationUserId = lastConversation?.userId;
    const lastConversationUser = groupChatroomMember[lastConversationUserId!];
    if (lastConversationUserId?.toString() === currentUser?.id.toString()) {
      return "You";
    } else {
      return lastConversationUser?.name.split(" ")[0];
    }
  };

  const { customComponents } = useContext(LMGlobalClientProviderContext);

  const renderChatroomSearchComponent = () => {
    switch (openSearchField) {
      case true: {
        return <LMChatroomSearch onCloseSearch={onCloseSearch} />;
      }
      case false: {
        // To do
        return (
          <>
            <div className="lm-channel-list-header">
              <div className="title">Chatrooms</div>
              <div className="icon lm-cursor-pointer">
                <img
                  src={searchIcon}
                  alt="searchIcon"
                  className="lm-cursor-pointer"
                  onClick={onOpenSearch}
                />
              </div>
            </div>
          </>
        );
      }
    }
  };

  // return renderChatroomSearchComponent();

  // Custom component
  if (customComponents?.groupChatChannelList) {
    return <customComponents.groupChatChannelList />;
  }
  // Default component

  return (
    <div className="lm-channel-list">
      <div>{renderChatroomSearchComponent()}</div>

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
                key={chatroom?.id?.toString()}
                className={`channel-media ${currentSelectedChatroomId?.toString() === chatroom?.id?.toString() ? "selected" : null}`}
                onClick={() => {
                  selectNewChatroom(chatroom?.id);
                }}
              >
                <div className="channel-icon">
                  {chatroom?.chatroomImageUrl ? (
                    <>
                      <img
                        src={chatroom?.chatroomImageUrl || ""}
                        alt="channel icon"
                      />
                    </>
                  ) : (
                    <>{chatroom.header ? chatroom?.header[0] : ""}</>
                  )}
                </div>
                <div className="channel-desc">
                  <div className="channel-title">
                    <div>{chatroom?.header}</div>
                    <div className="time">
                      {
                        groupChatroomConversationsMeta[
                          chatroom?.lastConversationId || ""
                        ]?.createdAt
                      }
                    </div>
                  </div>
                  <div className="channel-info">
                    {
                      // Block for rendering the last conversation

                      groupChatroomConversationsMeta[
                        chatroom?.lastConversationId || ""
                      ]?.deletedByUserId ? (
                        <div className="channel-last-conversation">
                          {groupChatroomConversationsMeta[
                            chatroom?.lastConversationId || ""
                          ]?.deletedByMember?.uuid ===
                          currentUser.sdkClientInfo?.uuid
                            ? ConstantStrings.MESSAGE_DELETED_BY_SELF
                            : ConstantStrings.MESSAGE_DELETED_NOT_BY_SELF}
                        </div>
                      ) : (
                        <div className="channel-last-conversation">
                          {renderLastConversationUsername(chatroom)}
                          :&nbsp;{" "}
                          {groupChatroomConversationsMeta[
                            chatroom?.lastConversationId || ""
                          ]?.attachmentCount
                            ? returnAttachmentPreviewIcon(
                                groupChatroomConversationsMeta[
                                  chatroom?.lastConversationId || ""
                                ],
                              )
                            : null}
                          {groupChatroomConversationsMeta[
                            chatroom?.lastConversationId || ""
                          ]
                            ? Utils.parseAnser(
                                groupChatroomConversationsMeta[
                                  chatroom?.lastConversationId || ""
                                ]?.answer,
                              )
                            : null}
                        </div>
                      )
                    }
                  </div>

                  {(chatroom?.unseenCount || 0) > 0 ? (
                    <div className="channel-unseen-convo-count">
                      {chatroom?.unseenCount}
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
                  selectNewChatroom(chatroom.id);
                }}
              >
                <div className="channel-icon">
                  {chatroom.chatroomImageUrl ? (
                    <>
                      <img
                        src={chatroom.chatroomImageUrl || ""}
                        alt="channel icon"
                      />
                    </>
                  ) : (
                    <>{chatroom.header ? chatroom?.header[0] : ""}</>
                  )}
                </div>
                <div className="channel-desc">
                  <div className="channel-title">
                    <div>
                      <div className="exploreTextTitle">{chatroom.header}</div>
                      <div className="channel-counts">
                        <div>
                          <img src={participantsIcon} alt={participantsIcon} />
                          {chatroom.participantsCount}
                        </div>
                        <div className="ellipse"></div>
                        <div>
                          <img src={messageIcon} alt={messageIcon} />
                          {chatroom.totalResponseCount}
                        </div>
                      </div>
                      <div className="exploreTextMsg">{chatroom.title}</div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        chatroom.followStatus
                          ? onLeaveChatroom(chatroom.id)
                          : joinAChatroom(chatroom.id);
                      }}
                      className={chatroom.followStatus ? "joined" : ""}
                    >
                      {chatroom.followStatus ? (
                        <img src={joinedIcon} alt={joinedIcon} />
                      ) : (
                        <img src={joinIcon} alt={joinIcon} />
                      )}
                      {chatroom.followStatus
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

export default LMChatGroupChannelList;
