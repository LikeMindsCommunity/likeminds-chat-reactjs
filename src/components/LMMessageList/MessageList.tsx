/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { PropsWithChildren, memo, useContext } from "react";
import { MessageListProps } from "../../types/prop-types/MessageListProps";
import MessageListContext from "../../context/MessageListContext";
import MessageContext from "../../context/MessageContext";
import Message from "../LMMessage/Message";
import Conversation from "../../types/models/conversations";
import ScrollContainer from "../DualSidePagination/ScrollContainer";
import useConversations from "../../hooks/useConversations";
import LMMessageMiddleware from "./LMMessageMiddleware";
import InfiniteScroll from "react-infinite-scroll-component";
// import DmReqBlock from "./DmReqBlock";

const MessageList: React.FC<PropsWithChildren<MessageListProps>> = memo(
  (props) => {
    const { MessageComponent } = props;

    // const { conversations, getChatroomConversationsOnTopScroll } =
    //   useContext(MessageListContext);
    const {
      conversations,
      getChatroomConversationsOnBottomScroll,
      getChatroomConversationsOnTopScroll,
      loadMore,
    } = useConversations();
    if (!conversations?.length) {
      return null;
    }
    return (
      <div className="lm-channel">
        <MessageListContext.Provider
          value={{
            conversations,
            getChatroomConversationsOnBottomScroll,
            getChatroomConversationsOnTopScroll,
          }}
        >
          <ScrollContainer
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
            {conversations?.map((conversation: Conversation) => {
              return (
                // <MessageContext
                //   value={{
                //     message: conversation,
                //   }}
                // >
                //   {MessageComponent ? <MessageComponent /> : <Message />}
                // </MessageContext>
                <LMMessageMiddleware
                  message={conversation}
                  key={conversation.id}
                />
              );
            })}
          </ScrollContainer>
          {/* <InfiniteScroll
            dataLength={conversations?.length || 0}
            hasMore={loadMore}
            next={getChatroomConversationsOnTopScroll}
            inverse={true}
            loader={null}
          >
            {conversations?.map((conversation: Conversation) => {
              return (
                // <MessageContext
                //   value={{
                //     message: conversation,
                //   }}
                // >
                //   {MessageComponent ? <MessageComponent /> : <Message />}
                // </MessageContext>
                <LMMessageMiddleware message={conversation} />
              );
            })}
          </InfiniteScroll> */}
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
