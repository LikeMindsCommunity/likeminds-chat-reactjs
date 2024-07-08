import { useContext } from "react";
import { Menu, MenuItem } from "@mui/material";

import useChatroomMenuOptions from "../../hooks/useChatroomMenuOptions";
import { LMChatChatroomContext } from "../../context/LMChatChatroomContext";
import { getAvatar } from "../../shared/components/LMUserMedia";
import { ChatroomAction } from "../../enums/chatroom-actions";
import { useMenu } from "../../hooks/useMenu";

// Icons
import menuIcon from "../../assets/img/overflow-menu.svg";

const Header = () => {
  const { chatroom } = useContext(LMChatChatroomContext);
  const { onMute, onLeaveChatroom, onViewParticipants, onBlock, onUnBlock } =
    useChatroomMenuOptions();
  const { menuAnchor, openMenu, closeMenu } = useMenu();
  const imageUrl = chatroom?.chatroom.chatroom_image_url;
  const name = chatroom?.chatroom.header;
  const avatarContent = getAvatar({ imageUrl, name });
  return (
    <div className="lm-channel-header">
      <div className="lm-header-left">
        <div className="lm-channel-img">{avatarContent}</div>
        <div className="lm-channel-desc">
          <div className="lm-channel-title">{chatroom?.chatroom.header}</div>
          {chatroom?.chatroom?.participants_count ? (
            <div className="lm-channel-participants">
              {chatroom?.chatroom.participants_count} Participants
            </div>
          ) : null}
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
            return (
              <MenuItem
                key={menuOption.id}
                onClick={() => {
                  switch (menuOption.id) {
                    case ChatroomAction.ACTION_MUTE:
                      return onMute();
                    case ChatroomAction.ACTION_UNMUTE:
                      return onMute();
                    case ChatroomAction.ACTION_UNFOLLOW:
                      return onLeaveChatroom();
                    case ChatroomAction.ACTION_VIEW_PARTICIPANTS:
                      return onViewParticipants();
                    case ChatroomAction.ACTION_BLOCK_CHATROOM:
                      return onBlock();
                    case ChatroomAction.ACTION_UNBLOCK_CHATROOM:
                      return onUnBlock();
                  }
                }}
              >
                {menuOption.title}
              </MenuItem>
            );
          })}
        </Menu>
      </div>
    </div>
  );
};

export default Header;
