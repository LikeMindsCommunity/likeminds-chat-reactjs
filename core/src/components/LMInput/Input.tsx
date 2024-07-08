import LinkOffIcon from "@mui/icons-material/LinkOff";
import ClearIcon from "@mui/icons-material/Clear";

import sendIcon from "../../assets/img/send.svg";
import { useInput } from "../../hooks/useInput";
import InputContext from "../../context/InputContext";
import LMChatTextArea from "./LMChatTextArea";
import Emojis from "./LMEmojis";
import { Alert, Collapse, IconButton } from "@mui/material";
import MediaCarousel from "./LMCarousel";
import AttachmentsSelector from "./LMAttachmentsSelector";
import giffyIcon from "../../assets/img/giffy.png";
// import GiphySearch from "./GiphySearch";

import GiphySearch from "./LMGiphySearch";
import { useContext, useMemo, useState } from "react";
import { LMChatChatroomContext } from "../../context/LMChatChatroomContext";
import UserProviderContext from "../../context/UserProviderContext";
import { MemberType } from "../../enums/member-type";
import { ConstantStrings } from "../../enums/common-strings";
import MessageReplyCollapse from "./MessageReplyCollapse";
import { ChatroomTypes } from "../../enums/chatroom-types";
// import { ReplyDmQueries } from "../../enums/reply-dm-queries";
import { ChatRequestStates } from "../../enums/chat-request-states";

const Input = () => {
  const {
    inputBoxRef,
    inputWrapperRef,
    inputText,
    matchedTagMembersList,
    updateInputText,
    onTextInputKeydownHandler,
    fetchMoreTags,
    clearTaggingList,
    addEmojiToText,
    addDocumentsMedia,
    addImagesAndVideosMedia,
    imagesAndVideosMediaList,
    documentsMediaList,
    postMessage,
    removeOgTag,
    getTaggingMembers,
    ogTag,
    gifs,
    loadingGifs,
    errorOnGifs,
    gifSearchQuery,
    openGifCollapse,
    setOpenGifCollapse,
    fetchGifs,
    handleGifSearch,
    gifQuery,
    setGifMedia,
    gifMedia,
    removeMediaFromImageList,
    removeMediaFromDocumentList,
    aprooveDMRequest,
    sendDMRequest,
    rejectDMRequest,
  } = useInput();
  const { currentUser } = useContext(UserProviderContext);
  const { chatroom, conversationToReply } = useContext(LMChatChatroomContext);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const shouldShowInputBox = useMemo(() => {
    const canRespondInChatroom = currentUser?.memberRights?.find(
      (right) => right.state === 3,
    )?.is_selected
      ? true
      : false;

    if (!canRespondInChatroom) {
      setAlertMessage(ConstantStrings.USER_MESSAGES_RESTRICTED_BY_CM);
      return false;
    } else {
      setAlertMessage(null);
    }
    const member_can_message = chatroom?.chatroom.member_can_message;
    switch (member_can_message) {
      case true:
        setAlertMessage(null);
        return true;
      case false: {
        if (currentUser?.state === MemberType.COMMUNITY_MANAGER) {
          setAlertMessage(null);
          return true;
        } else {
          setAlertMessage(ConstantStrings.ONLY_CM_MESSAGES_ALLOWED);
          return false;
        }
      }
    }
  }, [chatroom?.chatroom, currentUser?.memberRights, currentUser?.state]);
  const renderInputBoxComponent = () => {
    let isInputBoxDisabled = false;
    let disabledInputMessage = "";
    const isDMChatroom =
      chatroom?.chatroom.type === ChatroomTypes.DIRECT_MESSAGE_CHATROOM;

    if (isDMChatroom) {
      const chatRequestState =
        chatroom?.chatroom.chat_request_state?.toString();
      if (chatRequestState === ChatRequestStates.REJECTED_STATE) {
        isInputBoxDisabled = true;
        disabledInputMessage =
          // chatroom.chatroom.member.id.toString() === currentUser?.id.toString()
          chatroom.chatroom.chat_requested_by.id.toString() ===
          currentUser?.id.toString()
            ? ConstantStrings.DM_REQUEST_REJECTED_MESSAGE_CHATROOM_USER
            : ConstantStrings.DM_REQUEST_REJECTED_MESSAGE_CHATROOM_WITH_USER;
      }
      if (chatRequestState === ChatRequestStates.PENDING_STATE) {
        isInputBoxDisabled = true;
        chatroom.chatroom.member.id.toString() === currentUser?.id.toString();
        disabledInputMessage =
          chatroom.chatroom.chat_requested_by.id.toString() ===
          currentUser?.id.toString()
            ? // chatroom.chatroom.member.id.toString() === currentUser?.id.toString()
              ConstantStrings.DM_REQUEST_PENDING_MESSAGING_CHATROOM_USER
            : ConstantStrings.DM_REQUEST_PENDING_MESSAGING_CHATROOM_WITH_USER;
      }
    }
    console.log("isInputBoxDisabled", isInputBoxDisabled);
    if (isInputBoxDisabled) {
      return (
        <input
          disabled
          type="text"
          className="disabled-state"
          placeholder={disabledInputMessage}
        />
      );
    } else {
      return (
        <>
          <LMChatTextArea />
          <div className="lm-channel-icon send lm-cursor-pointer">
            <IconButton onClick={postMessage}>
              <img src={sendIcon} alt="sendIcon" />
            </IconButton>
          </div>
        </>
      );
    }
  };
  const renderDMChatroomStatusComponents = () => {
    const currentChatroom = chatroom?.chatroom;
    const currentChatroomType = currentChatroom?.type;
    if (currentChatroomType !== ChatroomTypes.DIRECT_MESSAGE_CHATROOM) {
      return null;
    }
    const chatRequestState = currentChatroom?.chat_request_state;
    if (chatRequestState === null) {
      return null;
    }
    const targetDmUser =
      currentChatroom?.member.id.toString() === currentUser?.id.toString()
        ? currentChatroom?.chatroom_with_user
        : currentChatroom?.member;
    const isRequestSender =
      chatroom?.chatroom.chat_requested_by?.id.toString() ===
      currentUser.id.toString()
        ? true
        : false;
    // chatroom?.chatroom.chatroom_with_user?.id.toString() ===
    // currentUser.id.toString()
    //   ? false
    //   : true;
    console.log("isRequestSender", isRequestSender);
    // if (targetDmUser?.id.toString() !== currentUser.id.toString()) {
    //   isRequestSender = true;
    // }
    switch (chatRequestState.toString()) {
      case ChatRequestStates.APPROVED_STATE: {
        return null;
      }
      case ChatRequestStates.REJECTED_STATE: {
        if (isRequestSender) {
          return null;
        } else {
          return null;
        }
        break;
      }
      case ChatRequestStates.PENDING_STATE: {
        if (isRequestSender) {
          return null;
        } else {
          return (
            <div className="dm-request-respond-bottom-sheet">
              <p className="dm-request-respond-message">
                The sender has sent you a direct messaging request. Approve or
                respond with a message to get connected. Rejecting this request
                will not notify the sender.
              </p>
              <div className="dm-request-respond-action-buttons">
                <button
                  className="dm-request-accept-action-button dm-request-action-button"
                  onClick={aprooveDMRequest}
                >
                  APPROVE
                </button>
                <button
                  className="dm-request-reject-action-button dm-request-action-button"
                  onClick={rejectDMRequest}
                >
                  REJECT
                </button>
              </div>
            </div>
          );
        }
        break;
      }
      default: {
        // this case will be only encountered when the chatroom type is DM and chat_Request_state is null
        break;
      }
    }
  };
  if (!shouldShowInputBox) {
    return (
      <Alert
        severity="warning"
        icon={false}
        sx={{
          background: "white",
        }}
      >
        {alertMessage}
      </Alert>
    );
  }

  return (
    // Defalut view
    <InputContext.Provider
      value={{
        inputBoxRef,
        inputWrapperRef,
        inputText,
        matchedTagMembersList,
        updateInputText,
        onTextInputKeydownHandler,
        fetchMoreTags,
        clearTaggingList,
        addEmojiToText,
        addDocumentsMedia,
        addImagesAndVideosMedia,
        imagesAndVideosMediaList,
        documentsMediaList,
        postMessage,
        getTaggingMembers,
        removeOgTag,
        ogTag,
        gifMedia,
        gifs,
        loadingGifs,
        errorOnGifs,
        gifSearchQuery,
        openGifCollapse,
        setOpenGifCollapse,
        fetchGifs,
        handleGifSearch,
        gifQuery,
        setGifMedia,
        removeMediaFromImageList,
        removeMediaFromDocumentList,
        aprooveDMRequest,
        rejectDMRequest,
        sendDMRequest,
      }}
    >
      <div className="lm-channel-footer-wrapper">
        {/* Collapseable for OG Tags */}
        <Collapse
          in={Boolean(ogTag)}
          sx={{
            background: "#D0D8E3",
          }}
        >
          <div className="og-tag-wrapper">
            <div className="og-tag-container">
              <div className="og-tag-icon">
                {ogTag?.image && ogTag?.image.length ? (
                  <img src={ogTag?.image} alt="icon" />
                ) : (
                  <LinkOffIcon
                    fontSize="medium"
                    sx={{
                      color: "white",
                    }}
                  />
                )}
              </div>
              <div className="og-tag-data">
                <div className="og-tag-data-header">{ogTag?.title}</div>
                <div className="og-tag-data-description">
                  {ogTag?.description}
                </div>
                <div className="og-tag-data-url">{ogTag?.url}</div>
              </div>
            </div>
            <div className="remove-og-tag-button">
              <IconButton onClick={removeOgTag}>
                <ClearIcon fontSize="small" />
              </IconButton>
            </div>
          </div>
        </Collapse>

        {/* Collapseable for Gif  */}
        <Collapse in={openGifCollapse}>
          <div className="lm-giphy-container">
            <GiphySearch />
          </div>
        </Collapse>

        <Collapse
          in={Boolean(conversationToReply)}
          sx={{
            background: "#D0D8E3",
          }}
        >
          <MessageReplyCollapse />
        </Collapse>
        {/* Collapsable for dm chatroom status component */}
        <Collapse
          in={Boolean(
            chatroom?.chatroom?.type === ChatroomTypes.DIRECT_MESSAGE_CHATROOM,
          )}
        >
          {renderDMChatroomStatusComponents()}
        </Collapse>
        {/* Media Carousel */}
        <div>
          <MediaCarousel />
        </div>

        {/* Message response  */}
        {/* <div className="lm-response-block">
          <div className="lm-response">
            <div className="lm-res-name">User Name</div>
            <div className="lm-res-msg">skdfj slkdfjslkdj fslkdfjlskfjd</div>
          </div>
          <div className="lm-response-cancel">
            <IconButton onClick={() => {}}>
              <ClearIcon fontSize="small" />
            </IconButton>
          </div>
        </div> */}
        {/* Message response  */}

        <div className="lm-channel-footer">
          <div className="lm-channel-icon lm-cursor-pointer">
            <Emojis />
          </div>
          <div className="lm-channel-icon lm-cursor-pointer">
            <AttachmentsSelector />
          </div>
          <div className="lm-channel-icon lm-cursor-pointer">
            <img
              src={giffyIcon}
              alt="giffy"
              onClick={() => {
                setOpenGifCollapse(!openGifCollapse);
              }}
            />
            {/* <GiSelector /> */}
          </div>
          {renderInputBoxComponent()}
          {/* <LMChatTextArea /> */}
        </div>
      </div>
    </InputContext.Provider>

    // Can't Respond
    // <div className="lm-channel-footer">
    //   <div className="disable-input">
    //     You can not respond to a rejected connection. Approve to send a message.
    //   </div>
    // </div>
  );
};

export default Input;
