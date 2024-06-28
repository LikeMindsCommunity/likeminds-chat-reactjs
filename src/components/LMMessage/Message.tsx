import React, { useContext, useEffect } from "react";
import MessageContext from "../../context/MessageContext";
import ConversationStates from "../../enums/conversation-states";
import { Utils } from "../../utils/helpers";
import { getAvatar } from "../../shared/components/LMUserMedia";
import UserProviderContext from "../../context/UserProviderContext";
import MessageOptions from "./MessageOptions";
import Reactions from "./Reactions";
import MessageListContext from "../../context/MessageListContext";
import { ConstantStrings } from "../../enums/common-strings";
import LMMessageContext from "../../context/MessageContext";
import MediaRenderer from "../../shared/components/MediaRenderer";

// Icons

import linkImg from "../../assets/img/link-img.svg";
import MessageReactionHolder from "./MessageReactionHolder";

const Message = () => {
  const { message, index } = useContext(LMMessageContext);

  const { conversations } = useContext(MessageListContext);
  const { currentUser } = useContext(UserProviderContext);

  const isSender = message?.member?.uuid === currentUser?.uuid;
  const messageClass = isSender ? "sender" : "receiver";

  const imageUrl = message?.member.imageUrl;
  const name = message?.member.name;
  const avatarContent = getAvatar({ imageUrl, name });

  const handleImageError = (e) => {
    e.target.src = linkImg; // Fallback image URL
    e.target.onerror = null; // Prevent infinite loop if the fallback also fails
  };

  function renderDatePill() {
    if (index === 0) {
      return <div className="data-pill">{message?.date}</div>;
    } else {
      if (conversations![index - 1].date !== message?.date) {
        return <div className="data-pill">{message?.date}</div>;
      }
    }
  }
  if (message?.deleted_by) {
    return (
      <div className={`lm-chat-card ${messageClass} ${message?.state}`}>
        {!isSender ? <div className="lmUserData">{avatarContent}</div> : null}
        <div className={`conversation ${messageClass}`}>
          {!isSender ? (
            <div className="name">{message?.member.name}</div>
          ) : null}
          <div className="lm-delete-msg">
            {message.deleted_by_member.uuid === currentUser?.uuid
              ? ConstantStrings.MESSAGE_DELETED_BY_SELF
              : ConstantStrings.MESSAGE_DELETED_NOT_BY_SELF}
          </div>
          <div className="time">{message?.created_at}</div>
        </div>

        <div className={`actions ${message?.deleted_by ? "none" : ""}`}>
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
    case ConversationStates.NORMAL: {
      return (
        <>
          <div className={`lm-chat-card ${message?.state}`}>
            {renderDatePill()}
          </div>
          <div className={`lm-chat-card ${messageClass} ${message?.state}`}>
            {!isSender ? (
              <div className="lmUserData">{avatarContent}</div>
            ) : null}
            <div className="lm-chat-message-reactions-holder-plate">
              <div className={`conversation ${messageClass}`}>
                {!isSender ? (
                  <div className="name">{message?.member.name}</div>
                ) : null}
                {/* media */}
                <div className="lm-media">
                  {message.has_files && message.attachments?.length > 0 ? (
                    <MediaRenderer attachments={message.attachments} />
                  ) : null}
                </div>
                {/* OG Tags */}

                {message.og_tags ? (
                  <div className="lm-og-tags">
                    <div className="lm-og-img">
                      <img
                        src={message.og_tags.image || linkImg}
                        alt="image"
                        onError={handleImageError}
                      />
                    </div>
                    <div className="lm-og-title">{message?.og_tags?.title}</div>
                    <div className="lm-og-desc">
                      {message?.og_tags?.description}
                    </div>
                  </div>
                ) : null}
                {/* OG Tags */}

                {/* text msg */}
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
                  {message.is_edited ? (
                    <div className="error-message">Edited</div>
                  ) : null}
                  {message?.created_at}
                </div>
              </div>
              <MessageReactionHolder />
            </div>
            <div className="actions">
              <div className="lm-cursor-pointer">
                <MessageOptions />
              </div>
              <div className="lm-cursor-pointer">
                <Reactions />
              </div>
            </div>

            {/* <div className="data-pill">{message?.date}</div> */}
          </div>
        </>
      );
    }
    case ConversationStates.CHAT_ROOM_HEADER: {
      return (
        <>
          <div className={`lm-chat-card ${message?.state}`}>
            {/* {message?.state} */}
            {renderDatePill()}
          </div>
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
    case ConversationStates.CHAT_ROOM_UNFOLLOWED: {
      return (
        <>
          <div className={`lm-chat-card ${message?.state}`}>
            {/* {message?.state} */}
            {renderDatePill()}
          </div>
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
      return (
        <>
          <div className={`lm-chat-card ${message?.state}`}>
            {/* {message?.state} */}
            {renderDatePill()}
          </div>
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
    case 11:
      return (
        <div className={`lm-chat-card ${message?.state}`}>
          <div className="data-pill">{message?.date}</div>
        </div>
      );
    default: {
      return null;
      // <div className={`lm-chat-card ${message?.state}`}>
      //   {/* {message?.state} */}
      //   <div className="data-pill">{message?.date}</div>
      // </div>
    }
  }
  // return <div>{message?.toString()}</div>;
};

export default Message;
