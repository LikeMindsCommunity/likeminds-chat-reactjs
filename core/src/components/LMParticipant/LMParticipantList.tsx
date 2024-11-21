import React, { useContext } from "react";
import { useParticipants } from "../../hooks/useParticipants";

// icons
import backIcon from "../../assets/img/back-navigation-arrow.svg";
import InfiniteScroll from "react-infinite-scroll-component";
import searchIcon from "../../assets/img/search.svg";
import LMGlobalClientProviderContext from "../../context/LMGlobalClientProviderContext";

const LMParticipantList = () => {
  const {
    participantsList,
    navigateBackToChatroom,
    getMembers,
    loadMoreParticipants,
    searchKeyword,
    setSearchKeyword,
    totalParticipantCount,
  } = useParticipants();

  const { customComponents } = useContext(LMGlobalClientProviderContext);

  // Custom component
  if (customComponents?.participantList) {
    return <customComponents.participantList />;
  }
  // Default component

  return (
    <div className="lm-participant-wrapper">
      <div className="lm-participant-header">
        <div className="heading">
          <div className="back-icon" onClick={navigateBackToChatroom}>
            <img src={backIcon} alt="back-icon" />
          </div>
          <div>Participants</div>
        </div>
        <div className="counts">{totalParticipantCount} Participants</div>
      </div>
      <div className="member-search">
        <img src={searchIcon} alt="search-icon" />
        <input
          type="text"
          placeholder="Search by member name"
          value={searchKeyword}
          onChange={(e) => {
            setSearchKeyword(e.target.value);
          }}
        />
      </div>
      <div className="lm-participant-body" id="lm-participant-scroller">
        <InfiniteScroll
          dataLength={participantsList.length}
          next={getMembers}
          hasMore={loadMoreParticipants}
          loader={null}
          scrollableTarget="lm-participant-scroller"
        >
          {participantsList.map((participant) => {
            return (
              <div className="lm-participant-card">
                <div className="lm-participant-card-user">
                  {participant.imageUrl ? (
                    <>
                      <img src={participant.imageUrl} alt="" />
                    </>
                  ) : (
                    <>{participant.name[0]}</>
                  )}
                </div>
                <div className="lm-participant-card-detail">
                  <div className="name">{participant.name}</div>

                  <div className="desc">{participant.customTitle}</div>
                </div>
              </div>
            );
          })}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default LMParticipantList;
