import React, { useContext } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import { LMChatroomContext } from "../../context/LMChatChatroomContext";
import LMGlobalClientProviderContext from "../../context/LMGlobalClientProviderContext";
import { Utils } from "../../utils/helpers";
function LMMessageEditCollapse() {
  const { conversationToedit, setConversationToEdit } =
    useContext(LMChatroomContext);
  function closeReply() {
    setConversationToEdit(null);
  }

  const { customComponents } = useContext(LMGlobalClientProviderContext);

  // Custom component
  if (customComponents?.input?.chatroomInputMessageEditCollapse) {
    return <customComponents.input.chatroomInputMessageEditCollapse />;
  }

  return (
    <div className="lm-input-message-reply">
      <div className="lm-input-message-reply-message-wrapper">
        <div className="lm-input-message-username">
          {conversationToedit?.member.name}
        </div>
        <div className="lm-input-message-text">
          {Utils.parseAndReplaceTags(conversationToedit?.answer || "")}
        </div>
      </div>
      <div className="lm-input-message-reply-close" onClick={closeReply}>
        <ClearIcon fontSize="medium" />
      </div>
    </div>
  );
}

export default LMMessageEditCollapse;
