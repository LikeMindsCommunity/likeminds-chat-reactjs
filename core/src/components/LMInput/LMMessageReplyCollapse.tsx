import React, { useContext } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import { LMChatChatroomContext } from "../../context/LMChatChatroomContext";
function LMMessageReplyCollapse() {
  const { conversationToReply, setConversationToReply } = useContext(
    LMChatChatroomContext,
  );
  function closeReply() {
    setConversationToReply(null);
  }

  return (
    <div className="lm-input-message-reply">
      <div className="lm-input-message-reply-message-wrapper">
        <div className="lm-input-message-username">
          {conversationToReply?.member.name}
        </div>
        <div className="lm-input-message-text">
          {conversationToReply?.answer}
        </div>
      </div>
      <div className="lm-input-message-reply-close" onClick={closeReply}>
        <ClearIcon fontSize="medium" />
      </div>
    </div>
  );
}

export default LMMessageReplyCollapse;
