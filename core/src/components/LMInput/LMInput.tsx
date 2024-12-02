import LinkOffIcon from "@mui/icons-material/LinkOff";
import ClearIcon from "@mui/icons-material/Clear";

import sendIcon from "../../assets/img/send.svg";
import { useInput } from "../../hooks/useInput";
import InputContext from "../../context/LMInputContext";
import LMChatTextArea from "./LMChatTextArea";
import Emojis from "./LMEmojis";
import { Alert, Collapse, IconButton } from "@mui/material";
import MediaCarousel from "./LMCarousel";
import AttachmentsSelector from "./LMAttachmentsSelector";
import giffyIcon from "../../assets/img/gif.png";
import GiphySearch from "./LMGiphySearch";
import { useContext, useMemo } from "react";
import { LMChatroomContext } from "../../context/LMChatChatroomContext";
import UserProviderContext from "../../context/LMUserProviderContext";
import { ConstantStrings } from "../../enums/lm-common-strings";
import { ChatroomTypes } from "../../enums/lm-chatroom-types";
import { ChatRequestStates } from "../../enums/lm-chat-request-states";
import LMMessageReplyCollapse from "./LMMessageReplyCollapse";
import LMMessageEditCollapse from "./LMMessageEditCollapse";
import LMGlobalClientProviderContext from "../../context/LMGlobalClientProviderContext";
import { createPortal } from "react-dom";

const LMInput: React.FC = () => {
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
    onTextInputKeyUpHandler,
    shouldShowInputBox: ShouldShowInputBox,
    alertMessage,
  } = useInput();
  const { currentUser } = useContext(UserProviderContext);
  const { chatroomDetails, conversationToReply, conversationToedit } =
    useContext(LMChatroomContext);
  const { customComponents } = useContext(LMGlobalClientProviderContext);

  const shouldShowInputBox = useMemo(
    () => ShouldShowInputBox(),
    [ShouldShowInputBox],
  );
  const renderInputBoxComponent = () => {
    let isInputBoxDisabled = false;
    let disabledInputMessage = "";
    const isDMChatroom =
      chatroomDetails?.chatroom.type === ChatroomTypes.DIRECT_MESSAGE_CHATROOM;

    if (isDMChatroom) {
      const chatRequestState =
        chatroomDetails?.chatroom.chatRequestState?.toString();
      if (chatRequestState === ChatRequestStates.REJECTED_STATE) {
        isInputBoxDisabled = true;
        disabledInputMessage =
          // chatroom.chatroom.member.id.toString() === currentUser?.id.toString()
          chatroomDetails?.chatroom?.chatRequestedBy?.id.toString() ===
          currentUser?.id.toString()
            ? ConstantStrings.DM_REQUEST_REJECTED_MESSAGE_CHATROOM_USER
            : ConstantStrings.DM_REQUEST_REJECTED_MESSAGE_CHATROOM_WITH_USER;
      }
      if (chatRequestState === ChatRequestStates.PENDING_STATE) {
        isInputBoxDisabled = true;
        chatroomDetails.chatroom.member.id.toString() ===
          currentUser?.id.toString();
        disabledInputMessage =
          chatroomDetails.chatroom.chatRequestedBy?.id.toString() ===
          currentUser?.id.toString()
            ? // chatroom.chatroom.member.id.toString() === currentUser?.id.toString()
              ConstantStrings.DM_REQUEST_PENDING_MESSAGING_CHATROOM_USER
            : ConstantStrings.DM_REQUEST_PENDING_MESSAGING_CHATROOM_WITH_USER;
      }
    }

    if (isInputBoxDisabled) {
      // Custom component
      if (customComponents?.input?.chatroomInputTextArea) {
        return <customComponents.input.chatroomInputTextArea />;
      }
      // Default component
      return (
        <input
          disabled
          type="text"
          className="disabled-state"
          placeholder={disabledInputMessage}
        />
      );
    } else {
      // Custom component
      if (customComponents?.input?.chatroomInputTextArea) {
        return <customComponents.input.chatroomInputTextArea />;
      }
      // Default component
      return (
        <>
          <LMChatTextArea />
          <div className="lm-channel-icon send lm-cursor-pointer">
            <button
              onClick={() => postMessage()}
              className="lm-post-conversation"
            >
              <img src={sendIcon} alt="sendIcon" />
            </button>
          </div>
        </>
      );
    }
  };
  const renderAdditionalComponents = () => {
    if (
      chatroomDetails?.chatroom.type ===
        ChatroomTypes.DIRECT_MESSAGE_CHATROOM &&
      chatroomDetails?.chatroom.chatRequestState?.toString() !==
        ChatRequestStates.APPROVED_STATE
    ) {
      return null;
    } else {
      return (
        <>
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
              className="lm-giffy-icon"
            />
          </div>
        </>
      );
    }
  };
  const renderDMChatroomStatusComponents = () => {
    const currentChatroom = chatroomDetails?.chatroom;
    const currentChatroomType = currentChatroom?.type;
    if (currentChatroomType !== ChatroomTypes.DIRECT_MESSAGE_CHATROOM) {
      return null;
    }
    const chatRequestState = currentChatroom?.chatRequestState;
    if (chatRequestState === null) {
      return null;
    }

    const isRequestSender =
      chatroomDetails?.chatroom.chatRequestedBy?.id.toString() ===
      currentUser.id.toString()
        ? true
        : false;

    switch (chatRequestState?.toString()) {
      case ChatRequestStates.APPROVED_STATE: {
        return null;
      }
      case ChatRequestStates.REJECTED_STATE: {
        if (isRequestSender) {
          return null;
        } else {
          return null;
        }
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
  const renderMediaCarousel = () => {
    if (imagesAndVideosMediaList?.length || documentsMediaList?.length) {
      return createPortal(
        <MediaCarousel />,
        document.getElementById("lm-media-render-portal")!,
      );
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
        onTextInputKeyUpHandler,
        shouldShowInputBox: ShouldShowInputBox,
        alertMessage,
      }}
    >
      <div className="lm-channel-footer-wrapper">
        {/* Collapseable  for Edit message*/}

        <Collapse
          in={Boolean(conversationToedit)}
          sx={{
            background: "#D0D8E3",
          }}
        >
          <LMMessageEditCollapse />
        </Collapse>
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
          <LMMessageReplyCollapse />
        </Collapse>
        {/* Collapsable for dm chatroom status component */}
        <Collapse
          in={Boolean(
            chatroomDetails?.chatroom?.type ===
              ChatroomTypes.DIRECT_MESSAGE_CHATROOM,
          )}
        >
          {renderDMChatroomStatusComponents()}
        </Collapse>
        {/* Media Carousel */}
        {renderMediaCarousel()}

        <div className="lm-channel-footer">
          {renderAdditionalComponents()}
          {renderInputBoxComponent()}
        </div>
      </div>
    </InputContext.Provider>
  );
};

export default LMInput;
