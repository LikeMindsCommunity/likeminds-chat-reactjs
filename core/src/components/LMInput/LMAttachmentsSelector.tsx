import React, { useContext } from "react";
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
import { LMChatChatroomContext } from "../../context/LMChatChatroomContext";
import { ChatroomTypes } from "../../enums/lm-chatroom-types";
import LMGlobalClientProviderContext from "../../context/LMGlobalClientProviderContext";

const LMAttachmentsSelector = () => {
  const { openMenu, closeMenu, menuAnchor } = useMenu();
  const {
    addDocumentsMedia,
    addImagesAndVideosMedia,
    imagesAndVideosMediaList,
    documentsMediaList,
  } = useContext(InputContext);
  const { openDialog, closeDialog, dialogOpen } = useDialog();
  const { chatroom } = useContext(LMChatChatroomContext);
  const { customComponents } = useContext(LMGlobalClientProviderContext);

  // Custom component
  if (customComponents?.input?.chatroomInputAttachmentsSelector) {
    return <customComponents.input.chatroomInputAttachmentsSelector />;
  }
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
        {/* <div className="lm-upload-media-dialog"> */}
        <MenuItem className="lm-chat-input-attachment-label">
          <label htmlFor="media">
            <input
              id="media"
              type="file"
              accept=".png, .jpeg, .jpg, .mp4"
              onChange={(e) => {
                addImagesAndVideosMedia(e);
                closeMenu();
              }}
              multiple
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
        {chatroom?.chatroom.type !== ChatroomTypes.DIRECT_MESSAGE_CHATROOM && (
          <MenuItem className="lm-chat-input-attachment-label">
            <label onClick={openDialog}>
              <div>
                <img src={PollIcon} alt="poll" />
              </div>
              <div className="title">Polls</div>
            </label>
          </MenuItem>
        )}
        {/* </div> */}
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
