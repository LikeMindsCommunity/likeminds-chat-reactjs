import React, { useContext } from "react";
import smileyIcon from "../../assets/img/smiley.svg";
import { Menu } from "@mui/material";
import { useMenu } from "../../hooks/useMenu";
import InputContext from "../../context/LMInputContext";
import { EmojiData } from "../../types/models/emojiData";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import LMGlobalClientProviderContext from "../../context/LMGlobalClientProviderContext";

const LMEmojis = () => {
  const { menuAnchor, openMenu, closeMenu } = useMenu();
  const { addEmojiToText } = useContext(InputContext);
  const onEmojiSelect = (emojiData: EmojiData, mouseEvent: MouseEvent) => {
    addEmojiToText(emojiData, mouseEvent);
    closeMenu();
  };

  const { customComponents } = useContext(LMGlobalClientProviderContext);
  // Custom component
  if (customComponents?.input?.chatroomInputEmojiSelector) {
    return <customComponents.input.chatroomInputEmojiSelector />;
  }
  // Default component
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
        <Picker data={data} theme="light" onEmojiSelect={onEmojiSelect} />
      </Menu>
      <img onClick={openMenu} src={smileyIcon} alt="smileyIcon" />
    </div>
  );
};

export default LMEmojis;
