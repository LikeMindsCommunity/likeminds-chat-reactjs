import {
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Menu, MenuItem } from "@mui/material";
// icons
import backIcon from "../../assets/img/back-navigation-arrow.svg";
import useChatroomMenuOptions from "../../hooks/useChatroomMenuOptions";
import { LMChatChatroomContext } from "../../context/LMChatChatroomContext";
import { getAvatar } from "../../shared/components/LMUserMedia";
import { ChatroomAction } from "../../enums/lm-chatroom-actions";
import { useMenu } from "../../hooks/useMenu";

// Icons
import menuIcon from "../../assets/img/overflow-menu.svg";
import searchIcon from "../../assets/img/search.svg";
import { ChatroomTypes } from "../../enums/lm-chatroom-types";
import UserProviderContext from "../../context/LMUserProviderContext";
import LMConversationSearch from "../search/LMConversationSearch";
import { ChatroomMenuCustomActions } from "../../types/prop-types/CustomComponents";
import LMGlobalClientProviderContext from "../../context/LMGlobalClientProviderContext";

import { useNavigate } from "react-router-dom";
interface LMHeaderProps {
  chatroomMenuCustomActions?: ChatroomMenuCustomActions;
}
const LMHeader: React.FC<PropsWithChildren<LMHeaderProps>> = ({
  chatroomMenuCustomActions,
}) => {
  const { chatroom } = useContext(LMChatChatroomContext);
  const { currentUser } = useContext(UserProviderContext);
  const { onMute, onLeaveChatroom, onViewParticipants, onBlock, onUnBlock } =
    useChatroomMenuOptions(chatroomMenuCustomActions);
  const { menuAnchor, openMenu, closeMenu } = useMenu();
  const { customComponents } = useContext(LMGlobalClientProviderContext);

  const getChatroomReciever = useCallback(() => {
    if (!chatroom) {
      return null;
    }
    if (chatroom.chatroom.type !== ChatroomTypes.DIRECT_MESSAGE_CHATROOM) {
      return null;
    }
    const recieverUser =
      chatroom.chatroom.member.id.toString() === currentUser.id.toString()
        ? chatroom.chatroom.chatroomWithUser
        : chatroom.chatroom.member;
    return recieverUser;
  }, [chatroom, currentUser]);

  const navigate = useNavigate();
  /**
   * Navigates back to the chatroom.
   */
  const navigateBack = () => {
    navigate(`/channel`);
  };

  const chatroomAvatar = useMemo(() => {
    if (chatroom?.chatroom.type === ChatroomTypes.DIRECT_MESSAGE_CHATROOM) {
      const recieverUser = getChatroomReciever();
      if (recieverUser) {
        const imageUrl = recieverUser?.imageUrl;
        const name = recieverUser?.name;
        const avatarContent = getAvatar({ imageUrl, name });
        return avatarContent;
      } else {
        return null;
      }
    } else {
      const imageUrl = chatroom?.chatroom.chatroomImageUrl;
      const name = chatroom?.chatroom.header;
      const avatarContent = getAvatar({ imageUrl, name });
      return avatarContent;
    }
  }, [
    chatroom?.chatroom.chatroomImageUrl,
    chatroom?.chatroom.header,
    chatroom?.chatroom.type,
    getChatroomReciever,
  ]);
  const chatroomTitle = useMemo(() => {
    if (!chatroom) return "";
    const chatroomType = chatroom?.chatroom.type;

    if (chatroomType === ChatroomTypes.DIRECT_MESSAGE_CHATROOM) {
      const recieverUser = getChatroomReciever();
      if (recieverUser) {
        return recieverUser.name;
      } else {
        return "";
      }
    } else {
      return chatroom?.chatroom.header;
    }
  }, [chatroom, getChatroomReciever]);

  const [openSearchField, setOpenSearchField] = useState<boolean>(false);
  const onOpenSearch = () => {
    setOpenSearchField(true);
  };
  const onCloseSearch = () => {
    setOpenSearchField(false);
  };
  const renderHeaderComponents = () => {
    switch (openSearchField) {
      case true: {
        return <LMConversationSearch onCloseSearch={onCloseSearch} />;
      }
      case false: {
        if (customComponents?.chatroomHeader)
          return <customComponents.chatroomHeader />;
        return (
          <>
            <div className="lm-channel-header">
              <div className="lm-header-left">
                <div
                  className="back-icon header-back-icon"
                  onClick={navigateBack}
                >
                  <img src={backIcon} alt="back-icon" />
                </div>
                <div className="lm-channel-img">{chatroomAvatar}</div>
                <div className="lm-channel-desc">
                  <div className="lm-channel-title">{chatroomTitle}</div>
                  {chatroom?.chatroom?.participantsCount &&
                  chatroom.chatroom.type !==
                    ChatroomTypes.DIRECT_MESSAGE_CHATROOM ? (
                    <div className="lm-channel-participants">
                      {chatroom?.chatroom.participantsCount} Participants
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="lm-header-right">
                <div className="lm-channel-icon">
                  <img
                    onClick={onOpenSearch}
                    src={searchIcon}
                    alt="searchIcon"
                  />
                </div>

                <div className="lm-channel-icon">
                  <img onClick={openMenu} src={menuIcon} alt="menuIcon" />
                </div>
                <Menu
                  open={Boolean(menuAnchor)}
                  anchorEl={menuAnchor}
                  onClose={closeMenu}
                >
                  {chatroom?.chatroomActions.map((menuOption) => {
                    return (
                      <MenuItem
                        key={menuOption.id}
                        className="lm-chatroom-menu-item"
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
          </>
        );
      }
    }
  };
  return renderHeaderComponents();
};

export default LMHeader;
