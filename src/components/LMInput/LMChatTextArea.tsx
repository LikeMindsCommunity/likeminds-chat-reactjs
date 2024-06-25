import React, { useContext } from "react";
import InputContext from "../../context/InputContext";
import { LMChatChatroomContext } from "../../context/LMChatChatroomContext";

const LMChatTextArea = () => {
  const {
    inputWrapperRef,
    inputBoxRef,
    onTextInputKeydownHandler,
    updateInputText,
  } = useContext(InputContext);
  const { chatroom } = useContext(LMChatChatroomContext);
  return (
    <div
      className="lm-chat-text-area lm-chat-text-area-wrapper"
      ref={inputWrapperRef}
    >
      <div
        ref={inputBoxRef}
        contentEditable={true}
        suppressContentEditableWarning
        tabIndex={0}
        autoFocus={true}
        id="lm-feed-content-editable-text-area"
        data-placeholder={
          chatroom?.chatroom.member_can_message
            ? `Type a message`
            : `Members can't message in this chatroom`
        }
        className="lm-chat-text-area__input-box"
        onKeyDown={onTextInputKeydownHandler}
        onInput={updateInputText}
      ></div>
    </div>
  );
};

export default LMChatTextArea;
