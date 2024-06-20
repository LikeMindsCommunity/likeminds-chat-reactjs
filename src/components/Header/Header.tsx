import { useContext } from "react";

// Icons

import menuIcon from "./../../assets/img/overflow-menu.svg";
import { LMChatChatroomContext } from "../../context/LMChatChatroomContext";
import { getAvatar } from "../../shared/components/LMUserMedia";

import { useMenu } from "../../hooks/useMenu";
import { Menu, MenuItem } from "@mui/material";
import useChatroomMenuOptions from "../../hooks/useChatroomMenuOptions";

const Header = () => {
  const { chatroom } = useContext(LMChatChatroomContext);
  const { onMute } = useChatroomMenuOptions();
  const { menuAnchor, openMenu, closeMenu } = useMenu();
  const imageUrl = chatroom?.chatroom.chatroom_image_url;
  const name = chatroom?.chatroom.header;
  const avatarContent = getAvatar({ imageUrl, name });
  return (
    <div className="lm-channel-header">
      {/* <LMParticipantList /> */}

      <div className="lm-header-left">
        <div className="lm-channel-img">{avatarContent}</div>
        <div className="lm-channel-desc">
          <div className="lm-channel-title">{chatroom?.chatroom.header}</div>
          <div className="lm-channel-participants">
            {chatroom?.chatroom.participants_count} Participants
          </div>
        </div>
      </div>
      <div className="lm-header-right">
        {/* <div className="lm-channel-icon">
          <img src={searchIcon} alt="searchIcon" />
        </div>
        <div className="lm-channel-icon">
          <img src={shareIcon} alt="shareIcon" />
        </div> */}
        <div className="lm-channel-icon">
          <img onClick={openMenu} src={menuIcon} alt="menuIcon" />
        </div>
        <Menu
          open={Boolean(menuAnchor)}
          anchorEl={menuAnchor}
          onClose={closeMenu}
        >
          {chatroom?.chatroom_actions.map((menuOption) => {
            return <MenuItem onClick={onMute}>{menuOption.title}</MenuItem>;
          })}
        </Menu>
      </div>
    </div>
  );
};

export default Header;
