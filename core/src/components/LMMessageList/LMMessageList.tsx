/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { PropsWithChildren, memo, useContext, useEffect } from "react";
import { MessageListProps } from "../../types/prop-types/MessageListProps";
import MessageListContext from "../../context/LMMessageListContext";
import { Conversation } from "../../types/models/conversations";
import ScrollContainer from "../DualSidePagination/ScrollContainer";
import useConversations from "../../hooks/useConversations";
import LMMessageMiddleware from "./LMMessageMiddleware";

import { CircularProgress } from "@mui/material";
import { LMChatroomContext } from "../../context/LMChatChatroomContext";
import UserProviderContext from "../../context/LMUserProviderContext";
import { ChatroomTypes } from "../../enums/lm-chatroom-types";
import { MemberType } from "../../enums/lm-member-type";
import { LMMessageListCustomActionsContext } from "../../context/LMMessageListCustomActionsContext";
import { getAvatar } from "../../shared/components/LMUserMedia";
import { useConversationSearch } from "../../hooks/useConversationSearch";
import { Utils } from "../../utils/helpers";
import LMMessageSkeleton from "../LMMessage/LMMessageSkeleton";

const LMMessageList: React.FC<PropsWithChildren<MessageListProps>> = memo(
  (props) => {
    const { messageCustomActions } = props;
    const { chatroomDetails, searchedConversationId } =
      useContext(LMChatroomContext);
    const { currentUser } = useContext(UserProviderContext);
    const scrollToBottom = () => {
      if (bottomReferenceDiv && bottomReferenceDiv.current) {
        bottomReferenceDiv.current.scrollIntoView(false);
      }
    };
    const chatroomUser = () => {
      if (
        chatroomDetails?.chatroom.type !== ChatroomTypes.DIRECT_MESSAGE_CHATROOM
      ) {
        return;
      }
      if (
        chatroomDetails?.chatroom.member.id.toString() ===
        currentUser?.id.toString()
      ) {
        const chatroomUser = chatroomDetails?.chatroom.chatroomWithUser;
        return chatroomUser;
      } else {
        const chatroomUser = chatroomDetails?.chatroom.member;
        return chatroomUser;
      }
    };

    const showInitiateDMRequestMessage: () => boolean = () => {
      if (
        chatroomDetails?.chatroom.type !== ChatroomTypes.DIRECT_MESSAGE_CHATROOM
      ) {
        return false;
      }
      if (
        currentUser.state === MemberType.COMMUNITY_MANAGER ||
        chatroomUser()?.state === MemberType.COMMUNITY_MANAGER
      ) {
        return false;
      }
      const chatRequestState = chatroomDetails?.chatroom.chatRequestState;
      if (chatRequestState === null) {
        return true;
      } else {
        return false;
      }
    };

    const getInitiateDmRequestMessage = () => {
      const user = chatroomUser();
      const templateMessage = `Send a DM request to ${user?.name} by sending your 1st message.`;
      return templateMessage;
    };
    const {
      conversations,
      getChatroomConversationsOnBottomScroll,
      getChatroomConversationsOnTopScroll,
      showLoader,
      bottomReferenceDiv,
      messageListContainerRef,
      searchedConversationRef,
      unBlockUserInDM,
      loadMoreBottomConversation,
      setChatroomTopic,
      chatroomTopic,
      showSkeletonResponse,
    } = useConversations();

    const { onSearchedConversationClick } = useConversationSearch();

    const imageUrl = chatroomTopic?.member.imageUrl;
    const name = chatroomTopic?.member.name;
    const avatarContent = getAvatar({ imageUrl, name });
    if (chatroomTopic?.deletedBy) {
      setChatroomTopic(null);
    }
    useEffect(() => {
      if (showSkeletonResponse) {
        bottomReferenceDiv.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest",
        });
      }
    }, [bottomReferenceDiv, showSkeletonResponse]);

    return (
      <LMMessageListCustomActionsContext.Provider
        value={{
          messageCustomActions: messageCustomActions,
        }}
      >
        <div className="lm-channel" ref={messageListContainerRef}>
          {/* Set Chatroom Topic */}
          <div
            className="lm-media-render-portal"
            id="lm-media-render-portal"
          ></div>
          {chatroomTopic ? (
            <>
              <div
                className="lm-channel-header topicHeader"
                onClick={() => {
                  onSearchedConversationClick(chatroomTopic?.id);
                }}
              >
                <div className="lm-header-left">
                  <div className="lm-channel-img">{avatarContent}</div>
                  <div className="lm-channel-desc">
                    <div className="lm-channel-title">
                      {chatroomTopic?.member?.name}
                    </div>

                    <div className="lm-channel-participants lm-chatroom-topic">
                      {Utils.parseAndReplaceTags(chatroomTopic?.answer || "")}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : null}

          {/* Set Chatroom Topic */}

          {showInitiateDMRequestMessage() && (
            <p className="initiate-dm-request-message">
              {getInitiateDmRequestMessage()}
            </p>
          )}
          <MessageListContext.Provider
            value={{
              conversations,
              getChatroomConversationsOnBottomScroll,
              getChatroomConversationsOnTopScroll,
              bottomReferenceDiv,
              messageListContainerRef,
              unBlockUserInDM,
              searchedConversationRef,
              setChatroomTopic,
              chatroomTopic,
            }}
          >
            <ScrollContainer
              bottomReferenceDiv={bottomReferenceDiv}
              dataLength={conversations?.length || 0}
              nextOnScrollBottom={() => {
                if (getChatroomConversationsOnBottomScroll) {
                  getChatroomConversationsOnBottomScroll();
                }
              }}
              nextOnScrollTop={() => {
                if (getChatroomConversationsOnTopScroll) {
                  getChatroomConversationsOnTopScroll();
                }
              }}
              callNextOnBottom={loadMoreBottomConversation}
              callNextOnTop={true}
            >
              {conversations?.map(
                (conversation: Conversation, index: number) => {
                  if (
                    searchedConversationId?.toString() ===
                    conversation.id.toString()
                  ) {
                    return (
                      <div
                        key={conversation.id}
                        ref={
                          searchedConversationId?.toString() ===
                          conversation.id.toString()
                            ? searchedConversationRef
                            : undefined
                        }
                        className="searched-conversation"
                        id={conversation.id.toString()}
                      >
                        <LMMessageMiddleware
                          message={conversation}
                          index={index}
                        />
                      </div>
                    );
                  } else {
                    return (
                      <LMMessageMiddleware
                        message={conversation}
                        index={index}
                        key={
                          conversation.temporaryId?.toString() ||
                          conversation.id
                        }
                      />
                    );
                  }
                },
              )}
              {Utils.isOtherUserAIChatbot(
                chatroomDetails?.chatroom,
                currentUser,
              ) &&
                showSkeletonResponse && <LMMessageSkeleton />}
            </ScrollContainer>
          </MessageListContext.Provider>
        </div>
      </LMMessageListCustomActionsContext.Provider>
    );
  },
);

export default LMMessageList;
