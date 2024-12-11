/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext } from "react";

import ConversationStates from "../../enums/lm-conversation-states";
import { Utils } from "../../utils/helpers";
import { getAvatar } from "../../shared/components/LMUserMedia";
import UserProviderContext from "../../context/LMUserProviderContext";
import MessageOptions from "./LMMessageOptions";
import Reactions from "./LMReactions";
import MessageListContext from "../../context/LMMessageListContext";
import { ConstantStrings } from "../../enums/lm-common-strings";
import LMMessageContext from "../../context/LMMessageContext";
import MediaRenderer from "../../shared/components/LMMediaRenderer";

// Icons

import linkImg from "../../assets/img/link-img.svg";
import replyIcon from "../../assets/img/reply.png";
import MessageReactionHolder from "./LMMessageReactionHolder";
import LMMicroPoll from "./LMMicroPoll";

import { LMChatroomContext } from "../../context/LMChatChatroomContext";
import { ChatRequestStates } from "../../enums/lm-chat-request-states";
import { ChatroomTypes } from "../../enums/lm-chatroom-types";
import { useMessageOptions } from "../../hooks/useMessageOptions";
import LMGlobalClientProviderContext from "../../context/LMGlobalClientProviderContext";
import { MemberRole } from "@likeminds.community/chat-js";
import MediaRendererLocal from "../../shared/components/LMLocalMediaRenderer";

const LMMessage = () => {
  const { customComponents } = useContext(LMGlobalClientProviderContext);
  const { messageBubbles, message: CustomMessageComponent } =
    customComponents || {};
  const { message, index } = useContext(LMMessageContext);
  const { conversations, unBlockUserInDM } = useContext(MessageListContext);
  const { currentUser } = useContext(UserProviderContext);
  const { chatroomDetails } = useContext(LMChatroomContext);
  const isSender = message?.member?.uuid === currentUser?.uuid;
  const messageClass = isSender ? "sender" : "receiver";
  const { onReply } = useMessageOptions();
  const imageUrl = message?.member.imageUrl;
  const name = message?.member.name;
  const avatarContent = getAvatar({ imageUrl, name });

  // custom message component

  if (message?.widgetId?.length && messageBubbles?.customWidget) {
    return <messageBubbles.customWidget />;
  }
  if (CustomMessageComponent) {
    return <CustomMessageComponent />;
  }

  const handleImageError = (e: any) => {
    e.target.src = linkImg; // Fallback image URL
    e.target.onerror = null; // Prevent infinite loop if the fallback also fails
  };
  function renderTapToUndo() {
    if (
      chatroomDetails?.chatroom.chatRequestState?.toString() ===
      ChatRequestStates.REJECTED_STATE
    )
      if (
        currentUser.id.toString() ===
        chatroomDetails?.chatroom.chatroomWithUser?.id.toString()
      ) {
        return (
          <span
            className="undo-dm-blocked lm-cursor-pointer"
            onClick={unBlockUserInDM}
          >
            Tap to undo
          </span>
        );
      }
  }
  function renderDatePill() {
    if (index === 0) {
      return (
        <div className="lm-chat-card">
          <div className="data-pill">{message?.date}</div>
        </div>
      );
    } else if (conversations![index - 1].date !== message?.date) {
      return (
        <div className="lm-chat-card">
          <div className="data-pill">{message?.date}</div>
        </div>
      );
    } else {
      return null;
    }
  }
  function renderStateHeaderMessage() {
    if (
      chatroomDetails?.chatroom.type === ChatroomTypes.DIRECT_MESSAGE_CHATROOM
    ) {
      const chatroomuser =
        chatroomDetails.chatroom.member.id.toString() ===
        currentUser?.id.toString()
          ? chatroomDetails.chatroom.chatroomWithUser
          : chatroomDetails.chatroom.member;
      return (
        <div className="data-pill">
          {/* {Utils.parseAndReplaceTags(message?.answer || "")} */}
          {`This is the very beginning of your direct message with ${
            chatroomuser?.name
          }`}
        </div>
      );
    } else {
      return (
        <div className="data-pill">
          {Utils.parseAndReplaceTags(message?.answer || "")}
        </div>
      );
    }
  }
  if (message?.deletedBy || message?.deletedByUserId) {
    if (messageBubbles?.chatroomDeletedChatBubble) {
      return <messageBubbles.chatroomDeletedChatBubble />;
    }
    return (
      <div className={`lm-chat-card ${messageClass} ${message?.state}`}>
        {!isSender ? <div className="lmUserData">{avatarContent}</div> : null}
        <div className={`conversation ${messageClass}`}>
          {!isSender ? (
            <div className="name">{message?.member.name}</div>
          ) : null}
          <div className="lm-delete-msg">
            {message?.deletedByMember?.uuid === currentUser?.uuid
              ? ConstantStrings.MESSAGE_DELETED_BY_SELF
              : ConstantStrings.MESSAGE_DELETED_NOT_BY_SELF}
          </div>
          <div className="time">{message?.createdAt}</div>
        </div>
        <div className={`actions ${message?.deletedBy ? "none" : ""}`}>
          <div className="lm-cursor-pointer">
            <MessageOptions />
          </div>
          <div className="lm-cursor-pointer">
            <Reactions />
          </div>
        </div>
      </div>
    );
  }
  switch (message?.state) {
    case ConversationStates.MICRO_POLL: {
      if (messageBubbles?.chatroolMicroPoll) {
        return <messageBubbles.chatroolMicroPoll />;
      }
      return <LMMicroPoll />;
    }
    case ConversationStates.NORMAL: {
      if (messageBubbles?.chatroomNormalChatBubble) {
        return <messageBubbles.chatroomNormalChatBubble />;
      }
      return (
        <>
          {renderDatePill()}
          <div className={`lm-chat-card ${messageClass} ${message?.state} `}>
            {!isSender ? (
              <div className="lmUserData">{avatarContent}</div>
            ) : null}
            <div className="lm-chat-message-reactions-holder-plate">
              <div
                className={`conversation ${messageClass} ${
                  Utils.isOtherUserAIChatbot(
                    chatroomDetails.chatroom,
                    currentUser,
                  ) && "ai-chatbot-conversation"
                }`}
              >
                {!isSender &&
                  !message.member.roles?.includes(MemberRole.Chatbot) && (
                    <div className="name">{message?.member.name}</div>
                  )}
                {/* media */}

                {(message.attachments?.length || 0) > 0 ? (
                  <div className="lm-media">
                    <MediaRenderer attachments={message?.attachments || []} />
                  </div>
                ) : null}

                {/* OG Tags */}

                {message.ogTags ? (
                  <div className="lm-og-tags">
                    {message.ogTags.image ? (
                      <>
                        <div className="lm-og-img">
                          <img
                            src={message.ogTags.image || linkImg}
                            alt="image"
                            onError={handleImageError}
                          />
                        </div>
                      </>
                    ) : null}
                    <div className="lm-og-content">
                      <div className="lm-og-title">
                        {message?.ogTags?.title}
                      </div>
                      <div className="lm-og-desc">
                        {message?.ogTags?.description}
                      </div>
                    </div>
                  </div>
                ) : null}
                {/* OG Tags */}

                {/* text msg */}
                {message?.replyConversationObject && (
                  <div className="lm-reply-wrapper">
                    <div className="lm-reply-wrapper-content">
                      <div className="lm-reply-wrapper-content-name">
                        {message.replyConversationObject.member.name}
                      </div>
                      <div className="lm-reply-wrapper-content-msg">
                        {message.replyConversationObject.answer}
                      </div>
                    </div>
                  </div>
                )}

                <div className="msg">
                  {message?.answer.includes(
                    "* This is a gif message. Please update your app *",
                  ) ? (
                    message?.answer.replace(
                      "* This is a gif message. Please update your app *",
                      "",
                    )
                  ) : (
                    <div>
                      {Utils.parseAndReplaceTags(message?.answer || "")}
                    </div>
                  )}
                </div>
                <div className="time">
                  {message.isEdited ? (
                    <>
                      <div className="error-message">Edited</div>
                      <div className="edited-bullet">&nbsp;</div>
                    </>
                  ) : null}
                  {message?.createdAt}
                </div>
              </div>
              <MessageReactionHolder />
            </div>
            {!Utils.isOtherUserAIChatbot(
              chatroomDetails.chatroom,
              currentUser,
            ) && (
              <div className="actions">
                <div className="lm-cursor-pointer">
                  <img
                    src={replyIcon}
                    alt="reply icon"
                    className="lm-add-emoji"
                    onClick={onReply}
                  />
                </div>

                <div className="lm-cursor-pointer">
                  <Reactions />
                </div>
                <div className="lm-cursor-pointer">
                  <MessageOptions />
                </div>
              </div>
            )}

            {/* <div className="data-pill">{message?.date}</div> */}
          </div>
        </>
      );
    }

    case ConversationStates.CHAT_ROOM_HEADER: {
      if (messageBubbles?.chatroomHeaderBubble) {
        return <messageBubbles.chatroomHeaderBubble />;
      }
      return (
        <>
          {renderDatePill()}

          <div className="lm-chat-card">
            <div className="lm-date-data ">{renderStateHeaderMessage()}</div>
          </div>
        </>
      );
    }

    case ConversationStates.CHAT_ROOM_UNFOLLOWED: {
      if (messageBubbles?.chatroomUnFollowedBubble) {
        return <messageBubbles.chatroomUnFollowedBubble />;
      }
      return (
        <>
          {renderDatePill()}

          <div className="lm-chat-card">
            <div className="lm-date-data ">
              <div className="data-pill">
                {Utils.parseAndReplaceTags(message?.answer || "")}
              </div>
            </div>
          </div>
        </>
      );
    }

    case ConversationStates.CHAT_ROOM_FOLLOWED: {
      if (messageBubbles?.chatroomFollowedBubble) {
        return <messageBubbles.chatroomFollowedBubble />;
      }
      return (
        <>
          {renderDatePill()}

          <div className="lm-chat-card">
            <div className="lm-date-data ">
              <div className="data-pill">
                {Utils.parseAndReplaceTags(message?.answer || "")}
              </div>
            </div>
          </div>
        </>
      );
    }
    case ConversationStates.ADD_ALL_MEMBERS:
      if (messageBubbles?.chatroomMembersAddedBubble) {
        return <messageBubbles.chatroomMembersAddedBubble />;
      }
      return (
        <div className={`lm-chat-card ${message?.state}`}>
          <div className="data-pill">{message?.answer}</div>
        </div>
      );
    case ConversationStates.DIRECT_MESSAGE_MEMBER_REQUEST_REJECTED: {
      if (messageBubbles?.chatroomDirectMessageRequestRejectedBubble) {
        return <messageBubbles.chatroomDirectMessageRequestRejectedBubble />;
      }
      return (
        <div className={`lm-chat-card ${message?.state}`}>
          <div className="data-pill">
            {message?.answer}
            {renderTapToUndo()}
          </div>
        </div>
      );
    }
    case ConversationStates.DIRECT_MESSAGE_MEMBER_REQUEST_APPROVED: {
      if (messageBubbles?.chatroomDirectMessageRequestAcceptedBubble) {
        return <messageBubbles.chatroomDirectMessageRequestAcceptedBubble />;
      }
      return (
        <div className={`lm-chat-card ${message?.state}`}>
          <div className="data-pill">
            {" "}
            {Utils.parseAndReplaceTags(message?.answer || "")}
          </div>
        </div>
      );
    }
    case ConversationStates.LOCAL_CONVERSATION_STATE: {
      if (messageBubbles?.chatroomNormalChatBubble) {
        return <messageBubbles.chatroomNormalChatBubble />;
      }
      return (
        <div className={`lm-chat-card ${messageClass} ${message?.state} `}>
          {!isSender ? <div className="lmUserData">{avatarContent}</div> : null}
          <div className="lm-chat-message-reactions-holder-plate">
            <div
              className={`conversation ${messageClass} ${
                Utils.isOtherUserAIChatbot(
                  chatroomDetails.chatroom,
                  currentUser,
                ) && "ai-chatbot-conversation"
              }`}
            >
              {!isSender &&
                !message.member.roles?.includes(MemberRole.Chatbot) && (
                  <div className="name">{message?.member.name}</div>
                )}
              {/* media */}
              <div className="lm-media">
                {(message.attachments?.length || 0) > 0 ? (
                  <MediaRendererLocal
                    attachments={(message?.attachments || []) as File[]}
                  />
                ) : null}
              </div>
              {/* OG Tags */}

              {message.ogTags ? (
                <div className="lm-og-tags">
                  {message.ogTags.image ? (
                    <>
                      <div className="lm-og-img">
                        <img
                          src={message.ogTags.image || linkImg}
                          alt="image"
                          onError={handleImageError}
                        />
                      </div>
                    </>
                  ) : null}
                  <div className="lm-og-content">
                    <div className="lm-og-title">{message?.ogTags?.title}</div>
                    <div className="lm-og-desc">
                      {message?.ogTags?.description}
                    </div>
                  </div>
                </div>
              ) : null}
              {/* OG Tags */}

              {/* text msg */}
              {message?.replyConversationObject && (
                <div className="lm-reply-wrapper">
                  <div className="lm-reply-wrapper-content">
                    <div className="lm-reply-wrapper-content-name">
                      {message.replyConversationObject.member.name}
                    </div>
                    <div className="lm-reply-wrapper-content-msg">
                      {message.replyConversationObject.answer}
                    </div>
                  </div>
                </div>
              )}

              <div className="msg">
                {message?.answer.includes(
                  "* This is a gif message. Please update your app *",
                ) ? (
                  message?.answer.replace(
                    "* This is a gif message. Please update your app *",
                    "",
                  )
                ) : (
                  <div>{Utils.parseAndReplaceTags(message?.answer || "")}</div>
                )}
              </div>
              <div className="time">
                {message.isEdited ? (
                  <>
                    <div className="error-message">Edited</div>
                    <div className="edited-bullet">&nbsp;</div>
                  </>
                ) : null}
                {message?.createdAt}
              </div>
            </div>
            <MessageReactionHolder />
          </div>
          {!Utils.isOtherUserAIChatbot(
            chatroomDetails.chatroom,
            currentUser,
          ) && (
            <div className="actions">
              <div className="lm-cursor-pointer">
                <img
                  src={replyIcon}
                  alt="reply icon"
                  className="lm-add-emoji"
                  onClick={onReply}
                />
              </div>

              <div className="lm-cursor-pointer">
                <Reactions />
              </div>
              <div className="lm-cursor-pointer">
                <MessageOptions />
              </div>
            </div>
          )}

          {/* <div className="data-pill">{message?.date}</div> */}
        </div>
      );
    }
    default: {
      return null;
    }
  }
};

export default LMMessage;
