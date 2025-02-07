import InfiniteScroll from "react-infinite-scroll-component";
import useDmChannelLists from "../../hooks/useDMChannelLists";
import { LMDMChannelListContext } from "../../context/LMDMChannelListContext";
import LMChatJoinedChannelTile from "./LMJoinedDMChannelTile";
import LMGlobalClientProviderContext from "../../context/LMGlobalClientProviderContext";
import CreateDMIcon from "../../assets/img/new-dm-icon.png";
import { useContext, useState } from "react";
import LMChatAllMembersScreen from "./LMChatAllMembersScreen";
import goBackIcon from "../../assets/img/back-navigation-arrow.svg";
const LMChatDMChannelList = ({ currentChatroomId }: LMDMChannelListProps) => {
  const [openNewDM, setOpenNewDM] = useState<boolean>(false);

  const {
    dmChatrooms,
    loadMoreDmChatrooms,
    getDMChatroomsList,
    refreshDMChatrooms,
    markReadADMChatroom,
    conversationsData,
    usersData,
    selectNewChatroom,
    currentSelectedChatroomId,
    showDM,
    showList,
  } = useDmChannelLists(currentChatroomId);

  const { customComponents } = useContext(LMGlobalClientProviderContext);

  function openDMCreate() {
    setOpenNewDM(true);
  }

  function closeDMCreate() {
    setOpenNewDM(false);
  }

  // Custom component
  if (customComponents?.dmChannelList) {
    return <customComponents.dmChannelList />;
  }
  if (openNewDM) {
    return (
      <div className="lm-channel-list dm-channel-list create-new-dm">
        <div className="lm-channel-list-header">
          <img
            src={goBackIcon}
            onClick={closeDMCreate}
            className="lm-cursor-pointer"
          />
          <div className="title">Create New Chat</div>
        </div>
        <div className="lm-channel-list-body" id="lm-channel-list-dm">
          <LMChatAllMembersScreen
            closeNewDMScreen={closeDMCreate}
            showList={showList}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="lm-channel-list dm-channel-list">
      {showDM ? (
        <div
          className="lm-chat-create-new-dm-conversation"
          onClick={openDMCreate}
        >
          <img src={CreateDMIcon} />
          New Chat
        </div>
      ) : null}
      <div className="lm-channel-list-header">
        <div className="title">Direct Messages</div>
      </div>
      <div className="lm-channel-list-body" id="lm-channel-list-dm">
        <LMDMChannelListContext.Provider
          value={{
            dmChatrooms,
            loadMoreDmChatrooms,
            getDMChatroomsList,
            refreshDMChatrooms,
            markReadADMChatroom,
            usersData,
            conversationsData,
            selectNewChatroom,
            currentSelectedChatroomId,
            showDM,
            showList,
          }}
        >
          <InfiniteScroll
            dataLength={dmChatrooms.length}
            next={getDMChatroomsList}
            hasMore={loadMoreDmChatrooms}
            loader={null}
            scrollableTarget="lm-channel-list-dm"
          >
            {dmChatrooms.map((chatroom) => {
              return (
                <LMChatJoinedChannelTile
                  key={chatroom.id.toString()}
                  chatroom={chatroom}
                />
              );
            })}
          </InfiniteScroll>
        </LMDMChannelListContext.Provider>
      </div>
    </div>
  );
};
export default LMChatDMChannelList;

export interface LMDMChannelListProps {
  currentChatroomId?: number;
}
