import React, { useContext } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import { LMChatroomContext } from "../../context/LMChatChatroomContext";
import LMGlobalClientProviderContext from "../../context/LMGlobalClientProviderContext";
import { Utils } from "../../utils/helpers";
import { LMInputAttachments } from "../../enums/lm-input-attachment-options";
import { LMConversationAttachments } from "../../enums/lm-conversation-attachments";
function LMMessageReplyCollapse() {
  const { conversationToReply, setConversationToReply } =
    useContext(LMChatroomContext);
  function closeReply() {
    setConversationToReply(null);
  }

  const { customComponents } = useContext(LMGlobalClientProviderContext);

  // Custom component
  if (customComponents?.input?.chatroomInputMessageReplyCollapse) {
    return <customComponents.input.chatroomInputMessageReplyCollapse />;
  }

  return (
    <div className="lm-input-message-reply">
      <div className="lm-input-message-reply-message-wrapper">
        <div className="lm-input-message-username">
          {conversationToReply?.member.name}
        </div>
        {conversationToReply?.attachments?.some(
          (attachment) =>
            attachment.type === LMConversationAttachments.VOICE_NOTE,
        ) ? (
          <span className="reply-on-voice-note">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="20"
              viewBox="0 0 16 20"
              fill="none"
              style={{
                marginLeft: "4px",
              }}
            >
              <path
                d="M0.75 0.8125V19.1875L15.1875 10L0.75 0.8125Z"
                fill="white"
              />
            </svg>
          </span>
        ) : null}
        <div className="lm-input-message-text">
          {Utils.parseAndReplaceTags(conversationToReply?.answer || "")}
        </div>
      </div>
      <div className="lm-input-message-reply-close" onClick={closeReply}>
        <ClearIcon fontSize="medium" />
      </div>
    </div>
  );
}

export default LMMessageReplyCollapse;
