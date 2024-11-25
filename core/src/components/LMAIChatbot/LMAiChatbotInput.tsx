import sendIcon from "../../assets/img/send.svg";
import { useInput } from "../../hooks/useInput";
import InputContext from "../../context/LMInputContext";
import { Alert } from "@mui/material";
import { PropsWithChildren, useContext, useMemo, useState } from "react";
import { LMChatroomContext } from "../../context/LMChatChatroomContext";
import UserProviderContext from "../../context/LMUserProviderContext";
import { MemberType } from "../../enums/lm-member-type";
import { ConstantStrings } from "../../enums/lm-common-strings";
import { ChatroomTypes } from "../../enums/lm-chatroom-types";
import { ChatRequestStates } from "../../enums/lm-chat-request-states";
import { InputCustomActions } from "../../types/prop-types/CustomComponents";
import LMGlobalClientProviderContext from "../../context/LMGlobalClientProviderContext";
import { LMInputAttachments } from "../../enums/lm-input-attachment-options";
import LMChatTextArea from "../LMInput/LMChatTextArea";
import MediaCarousel from "../LMInput/LMCarousel";
import LMChatbotAiBotInputAttachmentSelector from "./LMChatbotAiBotInputAttachmentSelector";
interface LMInputProps {
  inputCustomActions?: InputCustomActions;
  attachmentOptions?: LMInputAttachments[];
}

const LMAiChatbotInput: React.FC<PropsWithChildren<LMInputProps>> = (props) => {
  const { inputCustomActions = {}, attachmentOptions } = props;
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
  } = useInput(inputCustomActions);
  const { currentUser } = useContext(UserProviderContext);
  const { chatroomDetails } = useContext(LMChatroomContext);
  const { customComponents } = useContext(LMGlobalClientProviderContext);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const shouldShowInputBox = useMemo(() => {
    const canRespondInChatroom = currentUser?.memberRights?.find(
      (right) => right.state === 3,
    )?.isSelected
      ? true
      : false;
    if (!canRespondInChatroom) {
      setAlertMessage(ConstantStrings.USER_MESSAGES_RESTRICTED_BY_CM);
      return false;
    } else {
      setAlertMessage(null);
    }
    const memberCanMessage = chatroomDetails?.chatroom.memberCanMessage;

    switch (memberCanMessage) {
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
  }, [
    chatroomDetails?.chatroom,
    currentUser?.memberRights,
    currentUser?.state,
  ]);
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
    return (
      <div className="lm-channel-icon lm-cursor-pointer">
        <LMChatbotAiBotInputAttachmentSelector />
      </div>
    );
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
        attachmentOptions,
      }}
    >
      <div className="lm-channel-footer-wrapper">
        <MediaCarousel />

        <div className="lm-channel-footer">
          {renderAdditionalComponents()}
          {renderInputBoxComponent()}
        </div>
      </div>
    </InputContext.Provider>
  );
};

export default LMAiChatbotInput;
