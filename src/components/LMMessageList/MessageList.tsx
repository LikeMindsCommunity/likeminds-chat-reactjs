/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { PropsWithChildren, memo, useContext } from "react";
import { MessageListProps } from "../../types/prop-types/MessageListProps";
import MessageListContext from "../../context/MessageListContext";
import Conversation from "../../types/models/conversations";
import ScrollContainer from "../DualSidePagination/ScrollContainer";
import useConversations from "../../hooks/useConversations";
import LMMessageMiddleware from "./LMMessageMiddleware";

import { CircularProgress } from "@mui/material";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import { IconButton } from "@mui/material";
// import DmReqBlock from "./DmReqBlock";

const MessageList: React.FC<PropsWithChildren<MessageListProps>> = memo(
  (props) => {
    const { MessageComponent } = props;
    const scrollToBottom = () => {
      if (bottomReferenceDiv && bottomReferenceDiv.current) {
        bottomReferenceDiv.current.scrollIntoView(false);
      }
    };
    // const { conversations, getChatroomConversationsOnTopScroll } =
    //   useContext(MessageListContext);
    const {
      conversations,
      getChatroomConversationsOnBottomScroll,
      getChatroomConversationsOnTopScroll,
      showLoader,
      bottomReferenceDiv,
    } = useConversations();

    if (showLoader.current) {
      return (
        <div className="lm-channel-loader">
          <CircularProgress />
        </div>
      );
    }
    return (
      <div className="lm-channel">
        {/* <span className="scroll-to-bottom-shortcut">
          <IconButton onClick={scrollToBottom}>
            <KeyboardDoubleArrowDownIcon fontSize="small" />
          </IconButton>
        </span> */}
        <MessageListContext.Provider
          value={{
            conversations,
            getChatroomConversationsOnBottomScroll,
            getChatroomConversationsOnTopScroll,
            bottomReferenceDiv,
          }}
        >
          <ScrollContainer
            bottomReferenceDiv={bottomReferenceDiv}
            dataLength={conversations?.length || 0}
            nextOnScrollBottom={() => {
              console.log("bottom scroll function call");
            }}
            nextOnScrollTop={() => {
              if (getChatroomConversationsOnTopScroll) {
                console.log("calling");
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

{
  /* <div className="data-pill">
  This is the beginning of your direct message with Marvin McKinny
</div>

<div className="data-pill">Jan 4</div>

<div className="conversation receiver">
  <div className="name">Name</div>
  <div className="msg">Can we connect sometime?</div>
  <div className="time">10:30</div>
</div>

<div className="conversation sender">
  <div className="msg">Sender's message goes here</div>
  <div className="time">10:30</div>
</div> */
}
