import {
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Menu, MenuItem } from "@mui/material";
// icons
import backIcon from "../../assets/img/back-navigation-arrow.svg";
import useChatroomMenuOptions from "../../hooks/useChatroomMenuOptions";
import { LMChatroomContext } from "../../context/LMChatChatroomContext";
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

interface LMHeaderProps {
  chatroomMenuCustomActions?: ChatroomMenuCustomActions;
}
const LMHeader: React.FC<PropsWithChildren<LMHeaderProps>> = ({
  chatroomMenuCustomActions,
}) => {
  const { chatroomDetails } = useContext(LMChatroomContext);
  const { currentUser } = useContext(UserProviderContext);
  const { onMute, onLeaveChatroom, onViewParticipants, onBlock, onUnBlock } =
    useChatroomMenuOptions(chatroomMenuCustomActions);
  const { menuAnchor, openMenu, closeMenu } = useMenu();
  const { customComponents } = useContext(LMGlobalClientProviderContext);

  const getChatroomReciever = useCallback(() => {
    if (!chatroomDetails) {
      return null;
    }
    if (
      chatroomDetails.chatroom.type !== ChatroomTypes.DIRECT_MESSAGE_CHATROOM
    ) {
      return null;
    }
    const recieverUser =
      chatroomDetails.chatroom.member.id.toString() ===
      currentUser.id.toString()
        ? chatroomDetails.chatroom.chatroomWithUser
        : chatroomDetails.chatroom.member;
    return recieverUser;
  }, [chatroomDetails, currentUser]);

  /**
   * Navigates back to the chatroom.
   */

  const chatroomAvatar = useMemo(() => {
    if (
      chatroomDetails?.chatroom.type === ChatroomTypes.DIRECT_MESSAGE_CHATROOM
    ) {
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
      const imageUrl = chatroomDetails?.chatroom.chatroomImageUrl;
      const name = chatroomDetails?.chatroom.header;
      const avatarContent = getAvatar({ imageUrl, name });
      return avatarContent;
    }
  }, [
    chatroomDetails?.chatroom.chatroomImageUrl,
    chatroomDetails?.chatroom.header,
    chatroomDetails?.chatroom.type,
    getChatroomReciever,
  ]);
  const chatroomTitle = useMemo(() => {
    if (!chatroomDetails) return "";
    const chatroomType = chatroomDetails?.chatroom.type;

    if (chatroomType === ChatroomTypes.DIRECT_MESSAGE_CHATROOM) {
      const recieverUser = getChatroomReciever();
      if (recieverUser) {
        return recieverUser.name;
      } else {
        return "";
      }
    } else {
      return chatroomDetails?.chatroom.header;
    }
  }, [chatroomDetails, getChatroomReciever]);

  const [openSearchField, setOpenSearchField] = useState<boolean>(false);
  const onOpenSearch = () => {
    setOpenSearchField(true);
  };
  const onCloseSearch = () => {
    setOpenSearchField(false);
  };
  useEffect(() => {
    return () => {
      setOpenSearchField(false);
    };
  }, [chatroomDetails.chatroom.id]);
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
                <div className="back-icon header-back-icon">
                  <img src={backIcon} alt="back-icon" />
                </div>
                <div className="lm-channel-img">{chatroomAvatar}</div>
                <div className="lm-channel-desc">
                  <div className="lm-channel-title">{chatroomTitle}</div>
                  {chatroomDetails?.chatroom?.participantsCount &&
                  chatroomDetails.chatroom.type !==
                    ChatroomTypes.DIRECT_MESSAGE_CHATROOM ? (
                    <div className="lm-channel-participants">
                      {chatroomDetails?.chatroom.participantsCount} Participants
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
                  {chatroomDetails?.chatroomActions.map((menuOption) => {
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
