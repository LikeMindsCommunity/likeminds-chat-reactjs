import sendIcon from "../../assets/img/send.svg";
import { useInput } from "../../hooks/useInput";
import InputContext from "../../context/LMInputContext";
import { Alert } from "@mui/material";
import { useContext, useMemo } from "react";
import { LMChatroomContext } from "../../context/LMChatChatroomContext";
import UserProviderContext from "../../context/LMUserProviderContext";

import { ConstantStrings } from "../../enums/lm-common-strings";
import { ChatroomTypes } from "../../enums/lm-chatroom-types";
import { ChatRequestStates } from "../../enums/lm-chat-request-states";

import LMGlobalClientProviderContext from "../../context/LMGlobalClientProviderContext";

import LMChatTextArea from "../LMInput/LMChatTextArea";
import MediaCarousel from "../LMInput/LMCarousel";
import LMChatbotAIBotInputAttachmentSelector from "./LMChatbotAiBotInputAttachmentSelector";
import { createPortal } from "react-dom";

const LMAIChatbotInput: React.FC = () => {
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
  const { chatroomDetails } = useContext(LMChatroomContext);
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
            ? ConstantStrings.DM_REQUEST_PENDING_MESSAGING_CHATROOM_USER
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
    return (
      <div className="lm-channel-icon lm-cursor-pointer">
        <LMChatbotAIBotInputAttachmentSelector />
      </div>
    );
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
        {renderMediaCarousel()}
        <div className="lm-channel-footer">
          {renderAdditionalComponents()}
          {renderInputBoxComponent()}
        </div>
      </div>
    </InputContext.Provider>
  );
};

export default LMAIChatbotInput;
