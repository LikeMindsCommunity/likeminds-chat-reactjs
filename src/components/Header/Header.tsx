// Icons
import searchIcon from "./../../assets/img/search.svg";
import shareIcon from "./../../assets/img/share.svg";
import menuIcon from "./../../assets/img/overflow-menu.svg";
import { useContext } from "react";
import { LMChatChatroomContext } from "../../context/LMChatChatroomContext";

const Header = () => {
  const { chatroom } = useContext(LMChatChatroomContext);
  return (
    <div className="lm-channel-header">
      <div className="lm-header-left">
        <div className="lm-channel-img">
          <img src="https://placehold.co/400" alt="chaneel img" />
        </div>
        <div className="lm-channel-desc">
          <div className="lm-channel-title">{chatroom?.chatroom.header}</div>
          <div className="lm-channel-participants">
            {chatroom?.chatroom.participants_count} Participants
          </div>
        </div>
      </div>
      <div className="lm-header-right">
        <div className="lm-channel-icon">
          <img src={searchIcon} alt="searchIcon" />
        </div>
        <div className="lm-channel-icon">
          <img src={shareIcon} alt="shareIcon" />
        </div>
        <div className="lm-channel-icon">
          <img src={menuIcon} alt="menuIcon" />
        </div>
      </div>
    </div>
  );
};

export default Header;
