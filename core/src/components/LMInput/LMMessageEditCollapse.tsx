import React, { useContext } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import { LMChatChatroomContext } from "../../context/LMChatChatroomContext";
function LMMessageEditCollapse() {
  const { conversationToedit, setConversationToEdit } = useContext(
    LMChatChatroomContext,
  );
  function closeReply() {
    setConversationToEdit(null);
  }

  return (
    <div className="lm-input-message-reply">
      <div className="lm-input-message-reply-message-wrapper">
        <div className="lm-input-message-username">
          {conversationToedit?.member.name}
        </div>
        <div className="lm-input-message-text">
          {conversationToedit?.answer}
        </div>
      </div>
      <div className="lm-input-message-reply-close" onClick={closeReply}>
        <ClearIcon fontSize="medium" />
      </div>
    </div>
  );
}

export default LMMessageEditCollapse;
