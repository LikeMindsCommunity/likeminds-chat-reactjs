import { useCallback, useContext, useMemo, useState } from "react";
import { Menu, MenuItem } from "@mui/material";

import useChatroomMenuOptions from "../../hooks/useChatroomMenuOptions";
import { LMChatChatroomContext } from "../../context/LMChatChatroomContext";
import { getAvatar } from "../../shared/components/LMUserMedia";
import { ChatroomAction } from "../../enums/chatroom-actions";
import { useMenu } from "../../hooks/useMenu";

// Icons
import menuIcon from "../../assets/img/overflow-menu.svg";
import searchIcon from "../../assets/img/search.svg";
import { ChatroomTypes } from "../../enums/chatroom-types";
import UserProviderContext from "../../context/UserProviderContext";
import LMConversationSearch from "../search/LMConversationSearch";

const Header = () => {
  const { chatroom } = useContext(LMChatChatroomContext);
  const { currentUser } = useContext(UserProviderContext);
  const { onMute, onLeaveChatroom, onViewParticipants, onBlock, onUnBlock } =
    useChatroomMenuOptions();
  const { menuAnchor, openMenu, closeMenu } = useMenu();

  const getChatroomReciever = useCallback(() => {
    if (!chatroom) {
      return null;
    }
    if (chatroom.chatroom.type !== ChatroomTypes.DIRECT_MESSAGE_CHATROOM) {
      return null;
    }
    const recieverUser =
      chatroom.chatroom.member.id.toString() === currentUser.id.toString()
        ? chatroom.chatroom.chatroom_with_user
        : chatroom.chatroom.member;
    return recieverUser;
  }, [chatroom, currentUser]);
  const chatroomAvatar = useMemo(() => {
    if (chatroom?.chatroom.type === ChatroomTypes.DIRECT_MESSAGE_CHATROOM) {
      const recieverUser = getChatroomReciever();
      if (recieverUser) {
        const imageUrl = recieverUser?.image_url;
        const name = recieverUser?.name;
        const avatarContent = getAvatar({ imageUrl, name });
        return avatarContent;
      } else {
        return null;
      }
    } else {
      const imageUrl = chatroom?.chatroom.chatroom_image_url;
      const name = chatroom?.chatroom.header;
      const avatarContent = getAvatar({ imageUrl, name });
      return avatarContent;
    }
  }, [
    chatroom?.chatroom.chatroom_image_url,
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

  // const [menuAnchorSearch, setMenuAnchorSearch] = useState(null);
  // const [showSearch, setShowSearch] = useState(false);
  // const [searchTerm, setSearchTerm] = useState("");
  // const [searchResults, setSearchResults] = useState([]);

  // const openMenuSearch = (event) => {
  //   setMenuAnchorSearch(event.currentTarget);
  // };

  // const closeMenuSearch = () => {
  //   setMenuAnchorSearch(null);
  // };

  // const handleSearchIconClick = () => {
  //   setShowSearch(true);
  // };

  // const handleSearchInputChange = (event) => {
  //   setSearchTerm(event.target.value);
  //   // Mock search results for demonstration
  //   const results = ["Result 1", "Result 2", "Result 3"].filter((result) =>
  //     result.toLowerCase().includes(event.target.value.toLowerCase()),
  //   );
  //   setSearchResults(results);
  // };

  // const handleSearchResultClick = (result) => {
  //   // Handle the selection of a search result
  //   console.log(`Selected search result: ${result}`);
  //   // Hide the search input and clear results after selection
  //   setShowSearch(false);
  //   setSearchTerm("");
  //   setSearchResults([]);
  // };
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
        return (
          <>
            <div className="lm-channel-header">
              <div className="lm-header-left">
                <div className="lm-channel-img">{chatroomAvatar}</div>
                <div className="lm-channel-desc">
                  <div className="lm-channel-title">{chatroomTitle}</div>
                  {chatroom?.chatroom?.participants_count &&
                  chatroom.chatroom.type !==
                    ChatroomTypes.DIRECT_MESSAGE_CHATROOM ? (
                    <div className="lm-channel-participants">
                      {chatroom?.chatroom.participants_count} Participants
                    </div>
                  ) : null}
                </div>
              </div>

              {/* <div className="lm-header-right">
        <div className="lm-channel-icon">
          <img
            src={searchIcon}
            alt="searchIcon"
            onClick={handleSearchIconClick}
          />
        </div>
        {showSearch && (
          <div className="search-input-wrapper">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchInputChange}
              placeholder="Search..."
            />
            {searchResults.length > 0 && (
              <div className="search-results-dropdown">
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    className="search-result-item"
                    onClick={() => handleSearchResultClick(result)}
                  >
                    {result}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
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
                    default:
                      return null;
                  }
                }}
              >
                {menuOption.title}
              </MenuItem>
            );
          })}
        </Menu>
      </div> */}
              {/* old code  */}
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
                  {chatroom?.chatroom_actions.map((menuOption) => {
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

export default Header;
