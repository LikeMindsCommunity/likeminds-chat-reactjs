/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { useMenu } from "../../hooks/useMenu";
import AddReactionIcon from "@mui/icons-material/AddReaction";
import { Menu } from "@mui/material";

import { EmojiData } from "../../types/models/emojiData";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useReactions } from "../../hooks/useReactions";
const Reactions = () => {
  const { menuAnchor, openMenu, closeMenu } = useMenu();
  const { addReaction } = useReactions();
  const onEmojiSelect = (emoji: EmojiData, _mouseEvent: MouseEvent) => {
    addReaction(emoji);
    closeMenu();
  };
  return (
    <div>
      <Menu
        open={Boolean(menuAnchor)}
        onClose={closeMenu}
        anchorEl={menuAnchor}
        transformOrigin={{
          horizontal: 300,
          vertical: "top",
        }}
      >
        <div className="message-reactions-picker-wrapper">
          <Picker data={data} onEmojiSelect={onEmojiSelect} />
        </div>
      </Menu>
      <span onClick={openMenu}>
        <AddReactionIcon fontSize="small" />
      </span>
    </div>
  );
};

export default Reactions;
