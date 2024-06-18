import React, { useContext } from "react";
import smileyIcon from "./../../assets/img/smiley.svg";
import { Menu } from "@mui/material";
import { useMenu } from "../../hooks/useMenu";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import InputContext from "../../context/InputContext";
import { EmojiData } from "../../types/models/emojiData";

const Emojis = () => {
  const { menuAnchor, openMenu, closeMenu } = useMenu();
  const { addEmojiToText } = useContext(InputContext);
  const onEmojiSelect = (emojiData: EmojiData, mouseEvent: MouseEvent) => {
    addEmojiToText(emojiData, mouseEvent);
    closeMenu();
  };
  return (
    <div className="emoji-wrapper">
      <Menu
        open={Boolean(menuAnchor)}
        anchorEl={menuAnchor}
        onClose={closeMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Picker data={data} onEmojiSelect={onEmojiSelect} />
      </Menu>
      <img onClick={openMenu} src={smileyIcon} alt="smileyIcon" />
    </div>
  );
};

export default Emojis;
