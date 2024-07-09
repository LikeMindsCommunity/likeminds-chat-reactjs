/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { PropsWithChildren, memo, useContext } from "react";
import { MessageListProps } from "../../types/prop-types/MessageListProps";
import MessageListContext from "../../context/MessageListContext";
import Conversation from "../../types/models/conversations";
import ScrollContainer from "../DualSidePagination/ScrollContainer";
import useConversations from "../../hooks/useConversations";
import LMMessageMiddleware from "./LMMessageMiddleware";

import { CircularProgress } from "@mui/material";
import { LMChatChatroomContext } from "../../context/LMChatChatroomContext";
import UserProviderContext from "../../context/UserProviderContext";
import { ChatroomTypes } from "../../enums/chatroom-types";
import { MemberType } from "../../enums/member-type";

const LMMessageList: React.FC<PropsWithChildren<MessageListProps>> = memo(
  (props) => {
    const { chatroom, searchedConversationId } = useContext(
      LMChatChatroomContext,
    );
    const { currentUser } = useContext(UserProviderContext);
    const { MessageComponent } = props;
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
      console.log(chatRequestState);

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
    } = useConversations();

    if (showLoader.current) {
      return (
        <div className="lm-channel-loader">
          <CircularProgress />
        </div>
      );
    }
    return (
      <div className="lm-channel" ref={messageListContainerRef}>
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
          }}
        >
          <ScrollContainer
            bottomReferenceDiv={bottomReferenceDiv}
            dataLength={conversations?.length || 0}
            nextOnScrollBottom={() => {
              // console.log("bottom scroll function call");
              if (getChatroomConversationsOnBottomScroll) {
                getChatroomConversationsOnBottomScroll();
              }
            }}
            nextOnScrollTop={() => {
              if (getChatroomConversationsOnTopScroll) {
                // console.log("calling");
                getChatroomConversationsOnTopScroll();
              }
            }}
            callNextOnBottom={loadMoreBottomConversation}
            callNextOnTop={true}
          >
            {conversations?.map((conversation: Conversation, index: number) => {
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
                    <LMMessageMiddleware message={conversation} index={index} />
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
            })}
          </ScrollContainer>
        </MessageListContext.Provider>
        {/* DM Request Block */}
        {/* <DmReqBlock /> */}
      </div>
    );
  },
);

export default LMMessageList;
