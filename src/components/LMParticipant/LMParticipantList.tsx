import React from "react";
import { useParticipants } from "../../hooks/useParticipants";

// icons
import backIcon from "../../assets/img/back-navigation-arrow.svg";
import InfiniteScroll from "react-infinite-scroll-component";

const LMParticipantList = () => {
  const {
    participantsList,
    navigateBackToChatroom,
    getMembers,
    loadMoreParticipants,
  } = useParticipants();
  return (
    <div className="lm-participant-wrapper">
      <div className="lm-participant-header">
        <div className="heading">
          <div className="back-icon" onClick={navigateBackToChatroom}>
            <img src={backIcon} alt="back-icon" />
          </div>
          <div>Participants</div>
        </div>
        <div className="counts">{participantsList.length} Participants</div>
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
                  {participant.image_url ? (
                    <>
                      <img src={participant.image_url} alt="" />
                    </>
                  ) : (
                    <>{participant.name[0]}</>
                  )}
                </div>
                <div className="lm-participant-card-detail">
                  <div className="name">{participant.name}</div>

                  <div className="desc">{participant.custom_title}</div>
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
