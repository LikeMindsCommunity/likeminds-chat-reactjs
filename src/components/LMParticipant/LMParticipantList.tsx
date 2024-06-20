import React, { useContext } from "react";
import { Utils } from "../../utils/helpers";
import { getAvatar } from "../../shared/components/LMUserMedia";
import { useParticipants } from "../../hooks/useParticipants";

const LMParticipantList = () => {
  const { participantsList } = useParticipants();
  console.log(participantsList);
  //   const avatarContent = getAvatar({ imageUrl, name });

  return (
    <div className="lm-participant-wrapper">
      <div className="lm-participant-header">
        <div className="heading">Participants</div>
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
