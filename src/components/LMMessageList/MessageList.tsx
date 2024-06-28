/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { PropsWithChildren, memo, useContext } from "react";
import { MessageListProps } from "../../types/prop-types/MessageListProps";
import MessageListContext from "../../context/MessageListContext";
import Conversation from "../../types/models/conversations";
import ScrollContainer from "../DualSidePagination/ScrollContainer";
import useConversations from "../../hooks/useConversations";
import LMMessageMiddleware from "./LMMessageMiddleware";

import { CircularProgress } from "@mui/material";

const MessageList: React.FC<PropsWithChildren<MessageListProps>> = memo(
  (props) => {
    const { MessageComponent } = props;
    const scrollToBottom = () => {
      if (bottomReferenceDiv && bottomReferenceDiv.current) {
        bottomReferenceDiv.current.scrollIntoView(false);
      }
    };

    const {
      conversations,
      getChatroomConversationsOnBottomScroll,
      getChatroomConversationsOnTopScroll,
      showLoader,
      bottomReferenceDiv,
      messageListContainerRef,
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
        <MessageListContext.Provider
          value={{
            conversations,
            getChatroomConversationsOnBottomScroll,
            getChatroomConversationsOnTopScroll,
            bottomReferenceDiv,
            messageListContainerRef,
          }}
        >
          <ScrollContainer
            bottomReferenceDiv={bottomReferenceDiv}
            dataLength={conversations?.length || 0}
            nextOnScrollBottom={() => {
              // console.log("bottom scroll function call");
            }}
            nextOnScrollTop={() => {
              if (getChatroomConversationsOnTopScroll) {
                // console.log("calling");
                getChatroomConversationsOnTopScroll();
              }
            }}
            callNextOnBottom={false}
            callNextOnTop={true}
          >
            {conversations?.map((conversation: Conversation, index: number) => {
              return (
                <LMMessageMiddleware
                  message={conversation}
                  index={index}
                  key={conversation.id}
                />
              );
            })}
          </ScrollContainer>
        </MessageListContext.Provider>
        {/* DM Request Block */}
        {/* <DmReqBlock /> */}
      </div>
    );
  },
);

export default MessageList;
