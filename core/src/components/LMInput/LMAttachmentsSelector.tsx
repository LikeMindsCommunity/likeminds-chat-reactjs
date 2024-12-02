import React, { useContext, useMemo } from "react";
import { useMenu } from "../../hooks/useMenu";
import { Dialog, Menu, MenuItem } from "@mui/material";
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
import { Chatroom } from "@likeminds.community/chat-js-beta";
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

  const isOtherUserAiChatbot = useMemo(() => {
    return Utils.isOtherUserAIChatbot(
      chatroomDetails?.chatroom as unknown as Chatroom,
      currentUser,
    );
  }, [chatroomDetails?.chatroom, currentUser]);

  // Custom component
  if (customComponents?.input?.chatroomInputAttachmentsSelector) {
    return <customComponents.input.chatroomInputAttachmentsSelector />;
  }

  const allAttachmentOptions = [
    <MenuItem className="lm-chat-input-attachment-label" key={"mediaOption"}>
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
    </MenuItem>,

    <MenuItem className="lm-chat-input-attachment-label" key={"docOption"}>
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
    </MenuItem>,

    chatroomDetails?.chatroom.type !==
      ChatroomTypes.DIRECT_MESSAGE_CHATROOM && (
      <MenuItem className="lm-chat-input-attachment-label" key={"pollOption"}>
        <label onClick={openDialog}>
          <div>
            <img src={PollIcon} alt="poll" />
          </div>
          <div className="title">Polls</div>
        </label>
      </MenuItem>
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
            <MenuItem
              className="lm-chat-input-attachment-label"
              key={"mediaOption"}
            >
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
            </MenuItem>
          );
        }
        case LMInputAttachments.DOCUMENT: {
          return (
            <MenuItem
              className="lm-chat-input-attachment-label"
              key={"docOption"}
            >
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
            </MenuItem>
          );
        }
        case LMInputAttachments.POLL: {
          if (
            chatroomDetails?.chatroom.type !==
            ChatroomTypes.DIRECT_MESSAGE_CHATROOM
          ) {
            return (
              <MenuItem
                className="lm-chat-input-attachment-label"
                key={"pollOption"}
              >
                <label onClick={openDialog}>
                  <div>
                    <img src={PollIcon} alt="poll" />
                  </div>
                  <div className="title">Polls</div>
                </label>
              </MenuItem>
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
      <Menu
        open={Boolean(menuAnchor)}
        onClose={closeMenu}
        anchorEl={menuAnchor}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          horizontal: "left",
          vertical: "bottom",
        }}
        sx={{
          padding: "0",
        }}
        classes={{ paper: "lm-custom-menu" }}
      >
        {renderAttachmentsMenuitems()}
      </Menu>
      <img
        onClick={openMenu}
        src={attachmentIcon}
        alt="attachment"
        className="lm-cursor-pointer"
      />
    </div>
  );
};

export default LMAttachmentsSelector;
