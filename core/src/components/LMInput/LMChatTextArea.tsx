import React, { useContext } from "react";
import InputContext from "../../context/LMInputContext";
import { LMChatChatroomContext } from "../../context/LMChatChatroomContext";
import InfiniteScroll from "react-infinite-scroll-component";
import { Utils } from "../../utils/helpers";

const LMChatTextArea = () => {
  const {
    inputWrapperRef,
    inputBoxRef,
    onTextInputKeydownHandler,
    onTextInputKeyUpHandler,
    updateInputText,
    fetchMoreTags,
    matchedTagMembersList,
    getTaggingMembers,
    onMemberTabClick,
  } = useContext(InputContext);
  const { chatroom } = useContext(LMChatChatroomContext);
  return (
    <div
      className="lm-chat-text-area lm-chat-text-area-wrapper"
      ref={inputWrapperRef}
    >
      {matchedTagMembersList && matchedTagMembersList?.length > 0 ? (
        <div
          className="taggingBox"
          id="scrollableTaggingContainer"
          style={Utils.returnCSSForTagging(inputWrapperRef)}
        >
          <InfiniteScroll
            loader={null}
            hasMore={fetchMoreTags}
            next={getTaggingMembers}
            dataLength={matchedTagMembersList.length}
            scrollableTarget="scrollableTaggingContainer"
          >
            {matchedTagMembersList?.map!((member) => {
              return (
                <button
                  key={member?.id.toString() + Math.random().toString()}
                  className="taggingTile"
                  // onClick={(e) => {
                  //   e.preventDefault();
                  //   const selection = window.getSelection();
                  //   if (!selection) {
                  //     return;
                  //   }
                  //   const focusNode = selection.focusNode;

                  //   if (focusNode === null) {
                  //     return;
                  //   }

                  //   const div = focusNode.parentElement;
                  //   const text = div!.childNodes;
                  //   if (focusNode === null || text.length === 0) {
                  //     return;
                  //   }

                  //   const textContentFocusNode = focusNode.textContent;
                  //   if (textContentFocusNode === null) {
                  //     return;
                  //   }

                  //   const tagOp = Utils.findTag(textContentFocusNode);

                  //   // ('the tag string is ', tagOp!.tagString);
                  //   if (tagOp === undefined) return;

                  //   const { limitLeft, limitRight } = tagOp;

                  //   const textNode1Text = textContentFocusNode.substring(
                  //     0,
                  //     limitLeft - 1,
                  //   );

                  //   const textNode2Text = textContentFocusNode.substring(
                  //     limitRight + 1,
                  //   );

                  //   const textNode1 = document.createTextNode(textNode1Text);
                  //   const anchorNode = document.createElement("a");
                  //   anchorNode.id = member?.sdkClientInfo.uuid.toString();
                  //   anchorNode.href = "#";
                  //   anchorNode.textContent = `@${member?.name.trim()} `;
                  //   anchorNode.contentEditable = "false";
                  //   const textNode2 = document.createTextNode(textNode2Text);
                  //   const dummyNode = document.createElement("span");
                  //   div!.replaceChild(textNode2, focusNode);

                  //   div!.insertBefore(anchorNode, textNode2);
                  //   div!.insertBefore(dummyNode, anchorNode);
                  //   div!.insertBefore(textNode1, dummyNode);
                  //   clearTaggingList();
                  //   Utils.setCursorAtEnd(inputBoxRef);
                  // }}
                  onClick={(e) => {
                    onMemberTabClick(e, member);
                  }}
                >
                  <div>{Utils.setTagUserImage(member)}</div>
                  <div className="tagUserName">{member?.name}</div>
                </button>
              );
            })}
          </InfiniteScroll>
        </div>
      ) : null}
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
        onKeyUp={onTextInputKeyUpHandler}
      ></div>
    </div>
  );
};

export default LMChatTextArea;
