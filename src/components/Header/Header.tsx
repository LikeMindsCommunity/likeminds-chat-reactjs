import { useContext } from "react";

// Icons
import searchIcon from "./../../assets/img/search.svg";
import shareIcon from "./../../assets/img/share.svg";
import menuIcon from "./../../assets/img/overflow-menu.svg";
import { LMChatChatroomContext } from "../../context/LMChatChatroomContext";
import { getAvatar } from "../../shared/components/LMUserMedia";
import LMParticipantList from "../LMParticipant/LMParticipantList";

const Header = () => {
  const { chatroom } = useContext(LMChatChatroomContext);
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
          <img src={menuIcon} alt="menuIcon" />
        </div>
      </div>
    </div>
  );
};

export default Header;
