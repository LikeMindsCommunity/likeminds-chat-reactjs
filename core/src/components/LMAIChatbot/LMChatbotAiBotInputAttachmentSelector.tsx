import React, { FC, useContext, useEffect, useRef } from "react";
import { useMenu } from "../../hooks/useMenu";

import InputContext from "../../context/LMInputContext";
import aiChatbotAttachment from "../../assets/img/add-attachment-ai-chatbot.png";
import uploadMedia from "../../assets/img/upload-media.svg";
import LMGlobalClientProviderContext from "../../context/LMGlobalClientProviderContext";

const LMChatbotAIBotInputAttachmentSelector: FC = () => {
  const { openMenu, closeMenu, menuAnchor } = useMenu();
  const { addImagesAndVideosMedia, imagesAndVideosMediaList } =
    useContext(InputContext);
  const { customComponents } = useContext(LMGlobalClientProviderContext);
  const attachmentMenuRef = useRef<HTMLDivElement>(null);

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

  const allAttachmentOptions = (
    <div className="lm-chat-input-attachment-label">
      <label htmlFor="media">
        <input
          id="media"
          type="file"
          // Give only the option of image to AI Chatbot
          accept=".png, .jpeg, .jpg"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            addImagesAndVideosMedia(e);
            closeMenu();
          }}
          // Disable the mulitple select state if the chatroom is AI chatbot
          multiple={false}
          disabled={imagesAndVideosMediaList?.length ? true : false}
        />
        <div>
          <img src={uploadMedia} alt="media" />
        </div>
        <div className="title">Photos</div>
      </label>
    </div>
  );

  // Function to render the UI block for Attachments Menu
  const renderAttachmentsdivs = () => {
    return allAttachmentOptions;
  };

  // Default component
  return (
    <>
      {Boolean(menuAnchor) && (
        <div
          className="lm-input-attachments-menu-sheet-wrapper"
          ref={attachmentMenuRef}
        >
          <div className="lm-input-attachments-menu-sheet">
            {renderAttachmentsdivs()}
          </div>
        </div>
      )}
      <button
        className="lm-chat-ai-bot-input-attachment-selecter-wrapper"
        onClick={(e) => {
          if (menuAnchor) {
            closeMenu();
          } else {
            openMenu(e);
          }
        }}
        disabled={imagesAndVideosMediaList?.length ? true : false}
      >
        <img
          src={aiChatbotAttachment}
          alt="attachment"
          className="lm-cursor-pointer"
          id="lm-input-attachment-icon"
        />
      </button>
    </>
  );
};

export default LMChatbotAIBotInputAttachmentSelector;
