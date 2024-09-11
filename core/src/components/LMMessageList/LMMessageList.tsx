/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { PropsWithChildren, memo, useContext } from "react";
import { MessageListProps } from "../../types/prop-types/MessageListProps";
import MessageListContext from "../../context/LMMessageListContext";
import Conversation from "../../types/models/conversations";
import ScrollContainer from "../DualSidePagination/ScrollContainer";
import useConversations from "../../hooks/useConversations";
import LMMessageMiddleware from "./LMMessageMiddleware";

import { CircularProgress } from "@mui/material";
import { LMChatChatroomContext } from "../../context/LMChatChatroomContext";
import UserProviderContext from "../../context/LMUserProviderContext";
import { ChatroomTypes } from "../../enums/lm-chatroom-types";
import { MemberType } from "../../enums/lm-member-type";
import { LMMessageListCustomActionsContext } from "../../context/LMMessageListCustomActionsContext";
import { getAvatar } from "../../shared/components/LMUserMedia";
import { useConversationSearch } from "../../main_index";
import { Utils } from "../../utils/helpers";

const LMMessageList: React.FC<PropsWithChildren<MessageListProps>> = memo(
  (props) => {
    const { messageCustomActions } = props;
    const { chatroom, searchedConversationId } = useContext(
      LMChatChatroomContext,
    );
    const { currentUser } = useContext(UserProviderContext);
    const scrollToBottom = () => {
      if (bottomReferenceDiv && bottomReferenceDiv.current) {
        bottomReferenceDiv.current.scrollIntoView(false);
      }
    };
    const chatroomUser = () => {
      if (chatroom?.chatroom.type !== ChatroomTypes.DIRECT_MESSAGE_CHATROOM) {
        return;
      }
      if (
        chatroom?.chatroom.member.id.toString() === currentUser?.id.toString()
      ) {
        const chatroomUser = chatroom?.chatroom.chatroom_with_user;
        return chatroomUser;
      } else {
        const chatroomUser = chatroom?.chatroom.member;
        return chatroomUser;
      }
    };

    const showInitiateDMRequestMessage: () => boolean = () => {
      if (chatroom?.chatroom.type !== ChatroomTypes.DIRECT_MESSAGE_CHATROOM) {
        return false;
      }
      if (
        currentUser.state === MemberType.COMMUNITY_MANAGER ||
        chatroomUser()?.state === MemberType.COMMUNITY_MANAGER
      ) {
        return false;
      }
      const chatRequestState = chatroom?.chatroom.chat_request_state;
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
    } = useConversations();

    const { searchConversations, resetSearch, onSearchedConversationClick } =
      useConversationSearch();

    const imageUrl = chatroomTopic?.member.imageUrl;
    const name = chatroomTopic?.member.name;
    const avatarContent = getAvatar({ imageUrl, name });
    if (chatroomTopic?.deleted_by) {
      setChatroomTopic(null);
    }
    if (showLoader.current) {
      return (
        <div className="lm-channel-loader">
          <CircularProgress />
        </div>
      );
    }
    return (
      <LMMessageListCustomActionsContext.Provider
        value={{
          messageCustomActions: messageCustomActions,
        }}
      >
        <div className="lm-channel" ref={messageListContainerRef}>
          {/* Set Chatroom Topic */}

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
                        key={conversation.id}
                      />
                    );
                  }
                },
              )}
            </ScrollContainer>
          </MessageListContext.Provider>
          {/* DM Request Block */}
          {/* <DmReqBlock /> */}
        </div>
      </LMMessageListCustomActionsContext.Provider>
    );
  },
);

export default LMMessageList;
