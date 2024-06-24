import React, { useContext } from "react";
import { useParticipants } from "../../hooks/useParticipants";

// icons
import backIcon from "../../assets/img/back-navigation-arrow.svg";

const LMParticipantList = () => {
  const { participantsList, navigateBackToChatroom } = useParticipants();
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
      <div className="lm-participant-body">
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
      </div>
    </div>
  );
};

export default LMParticipantList;
