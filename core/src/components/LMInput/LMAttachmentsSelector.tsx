import React, { useContext, useEffect, useMemo, useRef } from "react";
import { useMenu } from "../../hooks/useMenu";
import { Dialog } from "@mui/material";
import InputContext from "../../context/LMInputContext";

// Icons
import attachmentIcon from "../../assets/img/attachment.svg";
import uploadMedia from "../../assets/img/upload-media.svg";
import uploadDoc from "../../assets/img/upload-doc.svg";
import PollIcon from "../../assets/img/Location.png";
import { useDialog } from "../../hooks/useDialog";
import LMPollCreationDialog from "./LMPollCreationDialog";
import { LMChatroomContext } from "../../context/LMChatChatroomContext";
import { ChatroomTypes } from "../../enums/lm-chatroom-types";
import LMGlobalClientProviderContext from "../../context/LMGlobalClientProviderContext";
import { Utils } from "../../utils/helpers";
import { Chatroom } from "@likeminds.community/chat-js";
import LMUserProviderContext from "../../context/LMUserProviderContext";
import { LMInputAttachments } from "../../enums/lm-input-attachment-options";
import { CustomisationContextProvider } from "../../context/LMChatCustomisationContext";

const LMAttachmentsSelector = () => {
  const { openMenu, closeMenu, menuAnchor } = useMenu();
  const {
    addDocumentsMedia,
    addImagesAndVideosMedia,
    imagesAndVideosMediaList,
    documentsMediaList,
  } = useContext(InputContext);
  const { attachmentOptions } = useContext(CustomisationContextProvider);
  const { openDialog, closeDialog, dialogOpen } = useDialog();
  const { chatroomDetails } = useContext(LMChatroomContext);
  const { customComponents } = useContext(LMGlobalClientProviderContext);
  const { currentUser } = useContext(LMUserProviderContext);
  const attachmentMenuRef = useRef<HTMLDivElement>(null);

  const isOtherUserAiChatbot = useMemo(() => {
    return Utils.isOtherUserAIChatbot(
      chatroomDetails?.chatroom as unknown as Chatroom,
      currentUser,
    );
  }, [chatroomDetails?.chatroom, currentUser]);

  useEffect(() => {
    const handleClick: EventListener = (event) => {
      const target = event.target;
      const iconElement = document.getElementById("lm-input-attachment-icon");
      if (attachmentMenuRef && attachmentMenuRef.current && target) {
        const doesClickContainsRef = attachmentMenuRef.current.contains(
          target as Node,
        );
        if (!doesClickContainsRef || iconElement?.contains(target as Node)) {
          closeMenu();
        }
        event.stopPropagation();
      }
    };
    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [closeMenu, menuAnchor]);

  // Custom component
  if (customComponents?.input?.chatroomInputAttachmentsSelector) {
    return <customComponents.input.chatroomInputAttachmentsSelector />;
  }

  const allAttachmentOptions = [
    <div className="lm-chat-input-attachment-label" key={"mediaOption"}>
      <label htmlFor="media">
        <input
          id="media"
          type="file"
          // Give only the option of image to AI Chatbot
          accept={
            chatroomDetails?.chatroom.type ===
              ChatroomTypes.DIRECT_MESSAGE_CHATROOM && isOtherUserAiChatbot
              ? ".png, .jpeg, .jpg"
              : ".png, .jpeg, .jpg, .mp4"
          }
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            addImagesAndVideosMedia(e);
            closeMenu();
          }}
          // Disable the mulitple select state if the chatroom is AI chatbot
          multiple={
            chatroomDetails?.chatroom.type ===
              ChatroomTypes.DIRECT_MESSAGE_CHATROOM && isOtherUserAiChatbot
              ? false
              : true
          }
          disabled={documentsMediaList?.length ? true : false}
        />
        <div>
          <img src={uploadMedia} alt="media" />
        </div>
        <div className="title">Photos &amp; Videos</div>
      </label>
    </div>,

    <div className="lm-chat-input-attachment-label" key={"docOption"}>
      <label htmlFor="doc">
        <input
          id="doc"
          type="file"
          accept=".pdf"
          onChange={(e) => {
            addDocumentsMedia(e);
            closeMenu();
          }}
          multiple
          disabled={imagesAndVideosMediaList?.length ? true : false}
        />
        <div>
          <img src={uploadDoc} alt="doc" />
        </div>
        <div className="title">Document</div>
      </label>
    </div>,

    chatroomDetails?.chatroom.type !==
      ChatroomTypes.DIRECT_MESSAGE_CHATROOM && (
      <div className="lm-chat-input-attachment-label" key={"pollOption"}>
        <label onClick={openDialog}>
          <div>
            <img src={PollIcon} alt="poll" />
          </div>
          <div className="title">Polls</div>
        </label>
      </div>
    ),
  ];

  const renderAttachmentsMenuitems = () => {
    // sending all the default attachment options if not attachmentOptions are provided
    if (!attachmentOptions) {
      return allAttachmentOptions;
    }
    // If attachmentOptions are provided, render the custom attachment options
    return attachmentOptions.map((option) => {
      switch (option) {
        case LMInputAttachments.GALLERY: {
          return (
            <div className="lm-chat-input-attachment-label" key={"mediaOption"}>
              <label htmlFor="media">
                <input
                  id="media"
                  type="file"
                  accept={
                    chatroomDetails?.chatroom.type ===
                      ChatroomTypes.DIRECT_MESSAGE_CHATROOM &&
                    isOtherUserAiChatbot
                      ? ".png, .jpeg, .jpg"
                      : ".png, .jpeg, .jpg, .mp4"
                  }
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    addImagesAndVideosMedia(e);
                    closeMenu();
                  }}
                  multiple={
                    chatroomDetails?.chatroom.type ===
                      ChatroomTypes.DIRECT_MESSAGE_CHATROOM &&
                    isOtherUserAiChatbot
                      ? false
                      : true
                  }
                  disabled={documentsMediaList?.length ? true : false}
                />
                <div>
                  <img src={uploadMedia} alt="media" />
                </div>
                <div className="title">Photos &amp; Videos</div>
              </label>
            </div>
          );
        }
        case LMInputAttachments.DOCUMENT: {
          return (
            <div className="lm-chat-input-attachment-label" key={"docOption"}>
              <label htmlFor="doc">
                <input
                  id="doc"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    addDocumentsMedia(e);
                    closeMenu();
                  }}
                  multiple
                  disabled={imagesAndVideosMediaList?.length ? true : false}
                />
                <div>
                  <img src={uploadDoc} alt="doc" />
                </div>
                <div className="title">Document</div>
              </label>
            </div>
          );
        }
        case LMInputAttachments.POLL: {
          if (
            chatroomDetails?.chatroom.type !==
            ChatroomTypes.DIRECT_MESSAGE_CHATROOM
          ) {
            return (
              <div
                className="lm-chat-input-attachment-label"
                key={"pollOption"}
              >
                <label onClick={openDialog}>
                  <div>
                    <img src={PollIcon} alt="poll" />
                  </div>
                  <div className="title">Polls</div>
                </label>
              </div>
            );
          }
        }
      }
    });
  };
  // Default component
  return (
    <div className="attachment-selecter-wrapper">
      <Dialog open={dialogOpen} onClose={closeDialog}>
        <LMPollCreationDialog closeDialog={closeDialog} />
      </Dialog>
      {Boolean(menuAnchor) && (
        <div
          className="lm-input-attachments-menu-sheet-wrapper"
          ref={attachmentMenuRef}
        >
          <div className="lm-input-attachments-menu-sheet">
            {renderAttachmentsMenuitems()}
          </div>
        </div>
      )}
      <img
        onClick={(e) => {
          if (menuAnchor) {
            closeMenu();
          } else {
            openMenu(e);
          }
        }}
        src={attachmentIcon}
        alt="attachment"
        className="lm-cursor-pointer"
        id="lm-input-attachment-icon"
      />
    </div>
  );
};

export default LMAttachmentsSelector;
