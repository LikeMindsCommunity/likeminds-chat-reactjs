import React, { useContext } from "react";
import InputContext from "../../context/InputContext";

const LMChatTextArea = () => {
  const {
    inputWrapperRef,
    inputBoxRef,
    onTextInputKeydownHandler,
    updateInputText,
  } = useContext(InputContext);
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
        data-placeholder="Write something here..."
        className="lm-chat-text-area__input-box"
        onKeyDown={onTextInputKeydownHandler}
        onInput={updateInputText}
      ></div>
    </div>
  );
};

export default LMChatTextArea;
