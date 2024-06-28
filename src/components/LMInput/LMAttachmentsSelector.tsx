import React, { useContext } from "react";
import { useMenu } from "../../hooks/useMenu";
import { Menu, MenuItem } from "@mui/material";
import InputContext from "../../context/InputContext";

// Icons
import attachmentIcon from "./../../assets/img/attachment.svg";
import uploadMedia from "./../../assets/img/upload-media.svg";
import uploadDoc from "./../../assets/img/upload-doc.svg";

const LMAttachmentsSelector = () => {
  const { openMenu, closeMenu, menuAnchor } = useMenu();
  const {
    addDocumentsMedia,
    addImagesAndVideosMedia,
    imagesAndVideosMediaList,
    documentsMediaList,
  } = useContext(InputContext);
  return (
    <div className="attachment-selecter-wrapper">
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