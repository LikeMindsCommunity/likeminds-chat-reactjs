import InfiniteScroll from "react-infinite-scroll-component";
import useDmChannelLists from "../../hooks/useDMChannelLists";
import { LMDMChannelListContext } from "../../context/LMDMChannelListContext";
import LMJoinedDMChannelTile from "./LMJoinedDMChannelTile";
import LMGlobalClientProviderContext from "../../context/LMGlobalClientProviderContext";
import { useContext } from "react";

const LMDMChatChannels = () => {
  const {
    dmChatrooms,
    loadMoreDmChatrooms,
    getDMChatroomsList,
    refreshDMChatrooms,
    markReadADMChatroom,
    conversationsData,
    usersData,
  } = useDmChannelLists();

  const { customComponents } = useContext(LMGlobalClientProviderContext);

  // Custom component
  if (customComponents?.dmChannelList) {
    return <customComponents.dmChannelList />;
  }

  return (
    <div className="lm-channel-list dm-channel-list">
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
          }}
        >
          <InfiniteScroll
            dataLength={dmChatrooms.length}
            next={getDMChatroomsList}
            hasMore={loadMoreDmChatrooms}
            loader={null}
            //   endMessage={<EndMessage />}
            scrollableTarget="lm-channel-list-dm"
          >
            {dmChatrooms.map((chatroom) => {
              return (
                <LMJoinedDMChannelTile
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
export default LMDMChatChannels;
