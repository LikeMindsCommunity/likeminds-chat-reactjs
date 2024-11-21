import React, { useContext } from "react";
import { useMenu } from "../../hooks/useMenu";
import { Menu, MenuItem } from "@mui/material";
import InputContext from "../../context/LMInputContext";

// Icons
import aiChatbotAttachment from "../../assets/img/add-attachment-ai-chatbot.png";
import uploadMedia from "../../assets/img/upload-media.svg";
import uploadDoc from "../../assets/img/upload-doc.svg";

import { LMChatChatroomContext } from "../../context/LMChatChatroomContext";
import { ChatroomTypes } from "../../enums/lm-chatroom-types";
import LMGlobalClientProviderContext from "../../context/LMGlobalClientProviderContext";
import { Utils } from "../../utils/helpers";
import { Chatroom } from "@likeminds.community/chat-js-beta";
import LMUserProviderContext from "../../context/LMUserProviderContext";
import { LMInputAttachments } from "../../enums/lm-input-attachment-options";

const LMChatbotAiBotInputAttachmentSelector = () => {
  const { openMenu, closeMenu, menuAnchor } = useMenu();
  const {
    addDocumentsMedia,
    addImagesAndVideosMedia,
    imagesAndVideosMediaList,
    documentsMediaList,
    attachmentOptions,
  } = useContext(InputContext);

  const { chatroom } = useContext(LMChatChatroomContext);
  const { customComponents } = useContext(LMGlobalClientProviderContext);
  const { currentUser } = useContext(LMUserProviderContext);
  // Custom component
  if (customComponents?.input?.chatroomInputAttachmentsSelector) {
    return <customComponents.input.chatroomInputAttachmentsSelector />;
  }

  const allAttachmentOptions = (
    <>
      <MenuItem className="lm-chat-input-attachment-label">
        <label htmlFor="media">
          <input
            id="media"
            type="file"
            // Give only the option of image to AI Chatbot
            accept={
              chatroom?.chatroom.type ===
                ChatroomTypes.DIRECT_MESSAGE_CHATROOM &&
              Utils.isOtherUserAIChatbot(
                chatroom?.chatroom as unknown as Chatroom,
                currentUser,
              )
                ? ".png, .jpeg, .jpg"
                : ".png, .jpeg, .jpg, .mp4"
            }
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              addImagesAndVideosMedia(e);
              closeMenu();
            }}
            // Disable the mulitple select state if the chatroom is AI chatbot
            multiple={
              chatroom?.chatroom.type ===
                ChatroomTypes.DIRECT_MESSAGE_CHATROOM &&
              Utils.isOtherUserAIChatbot(
                chatroom as unknown as Chatroom,
                currentUser,
              )
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

      <MenuItem className="lm-chat-input-attachment-label">
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
      {/* Option for poll */}
    </>
  );
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
            <MenuItem className="lm-chat-input-attachment-label">
              <label htmlFor="media">
                <input
                  id="media"
                  type="file"
                  accept={
                    chatroom?.chatroom.type ===
                      ChatroomTypes.DIRECT_MESSAGE_CHATROOM &&
                    Utils.isOtherUserAIChatbot(
                      chatroom?.chatroom as unknown as Chatroom,
                      currentUser,
                    )
                      ? ".png, .jpeg, .jpg"
                      : ".png, .jpeg, .jpg, .mp4"
                  }
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    addImagesAndVideosMedia(e);
                    closeMenu();
                  }}
                  multiple={
                    chatroom?.chatroom.type ===
                      ChatroomTypes.DIRECT_MESSAGE_CHATROOM &&
                    Utils.isOtherUserAIChatbot(
                      chatroom as unknown as Chatroom,
                      currentUser,
                    )
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
            <MenuItem className="lm-chat-input-attachment-label">
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
      }
    });
  };

  // Default component
  return (
    <>
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
      <div
        className="lm-chat-ai-bot-input-attachment-selecter-wrapper"
        onClick={openMenu}
      >
        <img
          src={aiChatbotAttachment}
          alt="attachment"
          className="lm-cursor-pointer"
        />
      </div>
    </>
  );
};

export default LMChatbotAiBotInputAttachmentSelector;
