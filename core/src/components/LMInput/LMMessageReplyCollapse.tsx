import React, { useContext } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import { LMChatChatroomContext } from "../../context/LMChatChatroomContext";
import LMGlobalClientProviderContext from "../../context/LMGlobalClientProviderContext";
import { Utils } from "../../utils/helpers";
function LMMessageReplyCollapse() {
  const { conversationToReply, setConversationToReply } = useContext(
    LMChatChatroomContext,
  );
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
