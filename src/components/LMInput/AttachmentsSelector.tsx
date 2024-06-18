import React, { useContext } from "react";
import attachmentIcon from "./../../assets/img/attachment.svg";
import { useMenu } from "../../hooks/useMenu";
// TODO change to default icons
import PermMediaIcon from "@mui/icons-material/PermMedia";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { Menu, MenuItem } from "@mui/material";
import InputContext from "../../context/InputContext";
const AttachmentsSelector = () => {
  const { openMenu, closeMenu, menuAnchor } = useMenu();
  const { addDocumentsMedia, addImagesAndVideosMedia } =
    useContext(InputContext);
  return (
    <div className="attachment-selecter-wrapper">
      <Menu
        open={Boolean(menuAnchor)}
        onClose={closeMenu}
        anchorEl={menuAnchor}
      >
        <MenuItem>
          <label className="lm-chat-input-attachment-label">
            <input
              type="file"
              accept=".png, .jpeg, .jpg, .mp4"
              onChange={addImagesAndVideosMedia}
            />
            <PermMediaIcon />
          </label>
        </MenuItem>
        <MenuItem>
          <label className="lm-chat-input-attachment-label">
            <input type="file" accept=".pdf" onChange={addDocumentsMedia} />
            <PictureAsPdfIcon />
          </label>
        </MenuItem>
      </Menu>
      <img onClick={openMenu} src={attachmentIcon} alt="attachment" />
    </div>
  );
};

export default AttachmentsSelector;
